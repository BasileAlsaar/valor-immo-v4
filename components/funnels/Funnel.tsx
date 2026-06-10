"use client"

import { useEffect, useId, useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react"

import type { FunnelConfig, FunnelField, FunnelStep } from "@/lib/data/funnels"
import { slideStep, easing } from "@/lib/motion"
import { SITE } from "@/lib/site"
import { cn } from "@/lib/utils"
import { SectionTitle } from "@/components/ui/section-title"

/* -------------------------------------------------------------------------- */
/*                                Validation                                  */
/* -------------------------------------------------------------------------- */

const PHONE_FR_REGEX = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/

function validateField(
  field: FunnelField,
  raw: string | boolean | undefined,
): string | null {
  if (field.type === "toggle") return null
  const value = typeof raw === "string" ? raw.trim() : ""
  if (field.required && !value) return "Champ requis"
  if (!value) return null
  if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return "Email invalide"
  if (field.type === "tel" && !PHONE_FR_REGEX.test(value))
    return "Numéro français invalide"
  if (field.type === "number" && Number.isNaN(Number(value)))
    return "Nombre invalide"
  return null
}

function validateStep(
  step: FunnelStep,
  values: Record<string, string | boolean>,
): Record<string, string> {
  const errors: Record<string, string> = {}
  if (step.kind === "choice") {
    const v = values[step.field]
    if (typeof v !== "string" || !v) errors[step.field] = "Choisissez une option"
    return errors
  }
  for (const f of step.fields) {
    const e = validateField(f, values[f.name])
    if (e) errors[f.name] = e
  }
  return errors
}

/* -------------------------------------------------------------------------- */
/*                                  Funnel                                    */
/* -------------------------------------------------------------------------- */

type Status = "idle" | "submitting" | "error" | "success"

export function Funnel({ config }: { config: FunnelConfig }) {
  const reduce = useReducedMotion()
  const [stepIndex, setStepIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [values, setValues] = useState<Record<string, string | boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [consent, setConsent] = useState(false)
  const [honeypot, setHoneypot] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const totalSteps = config.steps.length
  const isLast = stepIndex === totalSteps - 1

  // Focus management — bouge le focus vers le titre de l'étape à chaque
  // transition pour les lecteurs d'écran.
  useEffect(() => {
    if (status === "success") return
    headingRef.current?.focus()
  }, [stepIndex, status])

  const step = config.steps[stepIndex]

  function setValue(name: string, v: string | boolean) {
    setValues((prev) => ({ ...prev, [name]: v }))
    setErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  function goNext() {
    const e = validateStep(step, values)
    if (Object.keys(e).length > 0) {
      setErrors(e)
      return
    }
    if (stepIndex < totalSteps - 1) {
      setDirection(1)
      setStepIndex(stepIndex + 1)
    }
  }

  function goBack() {
    if (stepIndex === 0) return
    setDirection(-1)
    setStepIndex(stepIndex - 1)
  }

  function pickChoice(value: string) {
    if (step.kind !== "choice") return
    setValue(step.field, value)
    if (stepIndex < totalSteps - 1) {
      // Auto-advance après un court délai pour laisser voir la sélection.
      window.setTimeout(() => {
        setDirection(1)
        setStepIndex((i) => Math.min(i + 1, totalSteps - 1))
      }, 240)
    }
  }

  async function submit() {
    const e = validateStep(step, values)
    if (Object.keys(e).length > 0) {
      setErrors(e)
      return
    }
    if (!consent) return
    setStatus("submitting")
    setErrorMessage(null)
    try {
      const res = await fetch("/api/funnel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcours: config.parcours,
          fields: values,
          consentement: true,
          website: honeypot,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? "Envoi impossible")
      }
      setStatus("success")
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Envoi impossible")
      setStatus("error")
    }
  }

  if (status === "success") {
    return <FunnelSuccess message={config.confirmationMessage} />
  }

  const transitionVariants = reduce ? undefined : slideStep

  return (
    <div className="space-y-10">
      <FunnelProgress current={stepIndex} labels={config.stepLabels} />

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={stepIndex}
            custom={direction}
            variants={transitionVariants}
            initial={reduce ? false : "enter"}
            animate="center"
            exit={reduce ? undefined : "exit"}
          >
            <SectionTitle
              as="h2"
              size="md"
              ref={headingRef}
              tabIndex={-1}
              className="focus:outline-none"
            >
              {step.title}
            </SectionTitle>
            {step.subtitle && (
              <p className="mt-3 text-sm leading-relaxed text-ink/65 md:text-base">
                {step.subtitle}
              </p>
            )}

            <div className="mt-8">
              {step.kind === "choice" ? (
                <ChoiceGrid
                  step={step}
                  selected={values[step.field]}
                  onPick={pickChoice}
                  error={errors[step.field]}
                />
              ) : (
                <FieldsGrid
                  step={step}
                  values={values}
                  errors={errors}
                  onChange={setValue}
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Honeypot — caché des humains, lu par les bots. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        aria-hidden
        className="sr-only"
      />

      {isLast && (
        <ConsentBlock
          checked={consent}
          onChange={setConsent}
          parcours={config.parcours}
        />
      )}

      {status === "error" && errorMessage && (
        <div
          role="alert"
          className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900"
        >
          <p className="font-medium">{errorMessage}</p>
          <p className="mt-1 text-amber-800/80">
            Vous pouvez aussi nous écrire à{" "}
            <a href={`mailto:${SITE.email}`} className="underline">
              {SITE.email}
            </a>{" "}
            ou appeler le{" "}
            <a href={`tel:${SITE.telephoneTel}`} className="underline">
              {SITE.telephoneDisplay}
            </a>
            .
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-fir-dark/10 pt-6">
        <button
          type="button"
          onClick={goBack}
          disabled={stepIndex === 0 || status === "submitting"}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border-2 border-fir-dark/20 px-5 py-2.5 text-sm font-medium uppercase tracking-wider text-fir-dark transition disabled:opacity-30",
            stepIndex !== 0 &&
              "hover:border-fir-dark hover:bg-fir-dark hover:text-cream",
          )}
        >
          <ArrowLeft className="h-4 w-4" /> Précédent
        </button>

        {!isLast ? (
          step.kind === "fields" ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-2 rounded-full bg-fir-dark px-6 py-3 text-sm font-medium uppercase tracking-wider text-cream transition hover:bg-ink"
              style={{
                transitionTimingFunction: `cubic-bezier(${easing.brisk.join(",")})`,
              }}
            >
              Suivant <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <p className="text-xs uppercase tracking-wider text-ink/40">
              Choisissez une option pour continuer
            </p>
          )
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={status === "submitting" || !consent}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-medium uppercase tracking-wider text-ink transition hover:bg-gold-warm disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              transitionTimingFunction: `cubic-bezier(${easing.brisk.join(",")})`,
            }}
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Envoi…
              </>
            ) : (
              <>
                Envoyer ma demande <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                Progress                                    */
/* -------------------------------------------------------------------------- */

function FunnelProgress({
  current,
  labels,
}: {
  current: number
  labels: string[]
}) {
  const total = labels.length
  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current + 1}
    >
      <div className="flex items-center gap-2">
        {labels.map((_, i) => {
          const isActive = i === current
          const isDone = i < current
          return (
            <div key={i} className="relative flex-1">
              <div className="h-[3px] w-full overflow-hidden rounded-full bg-fir-dark/10">
                <motion.div
                  initial={false}
                  animate={{
                    width: isActive ? "60%" : isDone ? "100%" : "0%",
                    backgroundColor: isActive ? "#C9A961" : "#0F3D2E",
                  }}
                  transition={{ duration: 0.8, ease: easing.smooth }}
                  className="h-full origin-left"
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex justify-between gap-3 text-[11px] uppercase tracking-[0.16em]">
        {labels.map((label, i) => {
          const isActive = i === current
          const isDone = i < current
          return (
            <span
              key={label}
              className={cn(
                "transition-colors",
                isActive && "text-gold-deep font-medium",
                isDone && "text-fir-dark",
                !isActive && !isDone && "text-ink/40",
              )}
            >
              {label}
            </span>
          )
        })}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Choice / Fields                               */
/* -------------------------------------------------------------------------- */

function ChoiceGrid({
  step,
  selected,
  onPick,
  error,
}: {
  step: Extract<FunnelStep, { kind: "choice" }>
  selected: string | boolean | undefined
  onPick: (value: string) => void
  error?: string
}) {
  return (
    <div>
      <div
        role="radiogroup"
        aria-label={step.title}
        className="grid gap-3 sm:grid-cols-2 md:gap-4"
      >
        {step.options.map((opt) => {
          const isSelected = selected === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onPick(opt.value)}
              className={cn(
                "group relative flex items-center justify-between gap-4 rounded-2xl border-2 px-5 py-5 text-left transition-colors duration-200 ease-out-expo md:px-6 md:py-6",
                isSelected
                  ? "border-gold bg-cream-soft"
                  : "border-fir-dark/10 bg-white hover:border-fir-dark/40",
              )}
            >
              <span className="text-base font-medium text-fir-dark md:text-lg">
                {opt.label}
              </span>
              <span
                aria-hidden
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isSelected
                    ? "border-gold bg-gold text-ink"
                    : "border-fir-dark/20 bg-transparent text-transparent group-hover:border-fir-dark/50",
                )}
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
            </button>
          )
        })}
      </div>
      {error && (
        <p className="mt-4 text-sm text-amber-700" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function FieldsGrid({
  step,
  values,
  errors,
  onChange,
}: {
  step: Extract<FunnelStep, { kind: "fields" }>
  values: Record<string, string | boolean>
  errors: Record<string, string>
  onChange: (name: string, value: string | boolean) => void
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {step.fields.map((f) => (
        <div key={f.name} className={cn(f.fullWidth && "sm:col-span-2")}>
          <FieldControl
            field={f}
            value={values[f.name]}
            error={errors[f.name]}
            onChange={(v) => onChange(f.name, v)}
          />
        </div>
      ))}
    </div>
  )
}

function FieldControl({
  field,
  value,
  error,
  onChange,
}: {
  field: FunnelField
  value: string | boolean | undefined
  error?: string
  onChange: (v: string | boolean) => void
}) {
  const id = useId()
  const labelText = field.required ? `${field.label} *` : field.label

  if (field.type === "toggle") {
    const isOn = value === true
    return (
      <div>
        <span className="text-xs font-medium uppercase tracking-wider text-ink/60">
          {labelText}
        </span>
        <div className="mt-3 inline-flex rounded-full border-2 border-fir-dark/10 bg-white p-1">
          <button
            type="button"
            aria-pressed={!isOn}
            onClick={() => onChange(false)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition-colors",
              !isOn
                ? "bg-fir-dark text-cream"
                : "text-fir-dark/70 hover:text-fir-dark",
            )}
          >
            {field.falseLabel ?? "Non"}
          </button>
          <button
            type="button"
            aria-pressed={isOn}
            onClick={() => onChange(true)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition-colors",
              isOn
                ? "bg-fir-dark text-cream"
                : "text-fir-dark/70 hover:text-fir-dark",
            )}
          >
            {field.trueLabel ?? "Oui"}
          </button>
        </div>
      </div>
    )
  }

  if (field.type === "textarea") {
    const v = typeof value === "string" ? value : ""
    return (
      <div>
        <label
          htmlFor={id}
          className="text-xs font-medium uppercase tracking-wider text-ink/60"
        >
          {labelText}
        </label>
        <textarea
          id={id}
          rows={4}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          value={v}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          className="mt-2 w-full rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-base text-fir-dark transition focus:border-gold focus:outline-none"
        />
        {error && (
          <p className="mt-1 text-xs text-amber-700" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }

  const inputType =
    field.type === "email"
      ? "email"
      : field.type === "tel"
        ? "tel"
        : field.type === "number"
          ? "text"
          : "text"
  const inputMode = field.type === "number" ? "numeric" : undefined
  const v = typeof value === "string" ? value : ""

  return (
    <div>
      <label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-wider text-ink/60"
      >
        {labelText}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          type={inputType}
          inputMode={inputMode}
          autoComplete={field.autoComplete}
          placeholder={field.placeholder}
          value={v}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          className={cn(
            "w-full border-0 border-b-2 border-ink/15 bg-transparent px-0 pb-2 text-base text-fir-dark transition focus:border-gold focus:outline-none focus:ring-0",
            field.suffix && "pr-10",
          )}
        />
        {field.suffix && (
          <span className="pointer-events-none absolute right-0 bottom-2 text-sm text-ink/40">
            {field.suffix}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-amber-700" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Consent block                                 */
/* -------------------------------------------------------------------------- */

function ConsentBlock({
  checked,
  onChange,
  parcours,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  parcours: string
}) {
  const id = useId()
  return (
    <div className="rounded-2xl border border-fir-dark/10 bg-cream-soft p-5 text-sm leading-relaxed text-ink/80 md:p-6">
      <label htmlFor={id} className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-gold"
          aria-describedby={`${id}-desc`}
        />
        <span id={`${id}-desc`}>
          J&apos;accepte que Valor Immo utilise les informations saisies pour me
          recontacter au sujet de ma demande (parcours{" "}
          <strong>{parcours}</strong>). Vous pouvez exercer vos droits d&apos;accès,
          de rectification et de suppression à tout moment. Voir la{" "}
          <Link
            href="/politique-de-confidentialite"
            className="underline underline-offset-2 hover:text-fir-dark"
          >
            politique de confidentialité
          </Link>
          .
        </span>
      </label>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                 Success                                    */
/* -------------------------------------------------------------------------- */

function FunnelSuccess({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-fir-dark/10 bg-cream-soft px-6 py-12 text-center md:px-12 md:py-16">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
        <Check className="h-7 w-7" strokeWidth={2.4} />
      </div>
      <SectionTitle as="h2" size="md" className="mt-6">
        Demande reçue.
      </SectionTitle>
      <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink/75">
        {message}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm">
        <Link
          href="/"
          className="rounded-full border-2 border-fir-dark/20 px-5 py-2.5 uppercase tracking-wider text-fir-dark transition hover:border-fir-dark hover:bg-fir-dark hover:text-cream"
        >
          Retour à l&apos;accueil
        </Link>
        <a
          href={`tel:${SITE.telephoneTel}`}
          className="text-fir-dark/70 underline-offset-2 hover:text-gold hover:underline"
        >
          {SITE.telephoneDisplay}
        </a>
      </div>
    </div>
  )
}
