"use client"

import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"

import {
  contactFormSchema,
  stepSchemas,
  type ContactFormValues,
} from "@/lib/validations/contact"
import { slideStep, easing } from "@/lib/motion"
import { ProgressBar } from "@/components/contact-form/ProgressBar"
import { StepProjet } from "@/components/contact-form/steps/StepProjet"
import { StepContexte } from "@/components/contact-form/steps/StepContexte"
import { StepCoordonnees } from "@/components/contact-form/steps/StepCoordonnees"
import { SITE } from "@/lib/site"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "valor-contact-form-draft"
type Step = 1 | 2 | 3

const STEP_FIELDS: Record<Step, (keyof ContactFormValues)[]> = {
  1: [
    "typologie",
    "transaction",
    "budgetMin",
    "budgetMax",
    "budgetMinAcquisition",
    "budgetMaxAcquisition",
  ],
  2: ["deadline", "financement", "secteur", "secteurAutre", "zones"],
  3: [
    "nom",
    "societe",
    "email",
    "telephone",
    "source",
    "message",
    "consentement",
    "website",
  ],
}

/**
 * Métadonnées de rattachement à un bien Apimo, calculées côté serveur à
 * partir de `?bien={reference}` sur `/contact`. La résolution reference →
 * (id, label) se fait via `listPubliableProperties` : si la référence n'est
 * pas publiable ou introuvable, le parent ne fournit pas cette prop et le
 * formulaire fonctionne normalement (aucune régression).
 */
export type BienPrefill = {
  reference: string
  id: number
  /** Libellé lisible pré-inséré dans le champ « Précisions », ex.
   *  « Demande de visite — VI7 · Paris 14ème ». */
  label: string
}

type Props = {
  /** Appelé avec les valeurs validées une fois l'API contact OK. Le parent
   * monte alors le SuccessScreen plein écran à la place du formulaire. */
  onSuccess: (values: ContactFormValues) => void
  bienPrefill?: BienPrefill
}

export function ContactForm({ onSuccess, bienPrefill }: Props) {
  const [step, setStep] = useState<Step>(1)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const methods = useForm<ContactFormValues>({
    mode: "onChange",
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      zones: [],
      website: "",
    },
  })

  const { getValues, reset, setValue, trigger, handleSubmit } = methods

  // Restauration sessionStorage au mount, puis pré-remplissage bien (dans le
  // MÊME effect pour garantir que le prefill écrase une éventuelle valeur
  // restaurée — le prefill URL est plus intentionnel qu'un draft dormant).
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as {
          values: Partial<ContactFormValues>
          step: Step
        }
        reset(parsed.values as ContactFormValues, { keepDefaultValues: true })
        if ([1, 2, 3].includes(parsed.step)) setStep(parsed.step)
      }
    } catch {
      // ignore — drafts corrompus
    }
    if (bienPrefill) {
      setValue("bienReference", bienPrefill.reference, { shouldDirty: false })
      setValue("bienId", bienPrefill.id, { shouldDirty: false })
      setValue("message", bienPrefill.label, { shouldDirty: false })
    }
    // On veut ce comportement UNIQUEMENT au montage. Les changements
    // ultérieurs de bienPrefill (rare) ne doivent pas ré-écraser un message
    // en cours d'édition.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persistance auto à chaque changement
  useEffect(() => {
    const sub = methods.watch((values) => {
      if (typeof window === "undefined") return
      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ values, step }),
        )
      } catch {
        // quota / private mode — ignore
      }
    })
    return () => sub.unsubscribe()
  }, [methods, step])

  async function validateStep(s: Step): Promise<boolean> {
    const fields = STEP_FIELDS[s]
    const ok = await trigger(fields as never)
    if (!ok) return false
    // Validation custom de l'étape (cross-field refines)
    const values = getValues()
    const schemaForStep = s === 1 ? stepSchemas.projet : s === 2 ? stepSchemas.contexte : stepSchemas.coordonnees
    const result = schemaForStep.safeParse(values)
    return result.success
  }

  async function goNext() {
    const ok = await validateStep(step)
    if (!ok) return
    if (step < 3) {
      setDirection(1)
      setStep((step + 1) as Step)
    }
  }

  function goBack() {
    if (step > 1) {
      setDirection(-1)
      setStep((step - 1) as Step)
    }
  }

  async function onSubmit(values: ContactFormValues) {
    setStatus("submitting")
    setErrorMessage(null)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? "Envoi impossible")
      }
      try {
        sessionStorage.removeItem(STORAGE_KEY)
      } catch {
        // ignore
      }
      onSuccess(values)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Envoi impossible"
      setErrorMessage(message)
      setStatus("error")
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-10">
        <ProgressBar current={step} />

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideStep}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {step === 1 && <StepProjet />}
              {step === 2 && <StepContexte />}
              {step === 3 && <StepCoordonnees />}
            </motion.div>
          </AnimatePresence>
        </div>

        {status === "error" && errorMessage && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900">
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
            disabled={step === 1 || status === "submitting"}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border-2 border-fir-dark/20 px-5 py-2.5 text-sm font-medium uppercase tracking-wider text-fir-dark transition disabled:opacity-30",
              step !== 1 && "hover:border-fir-dark hover:bg-fir-dark hover:text-cream",
            )}
          >
            <ArrowLeft className="h-4 w-4" /> Précédent
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-2 rounded-full bg-fir-dark px-6 py-3 text-sm font-medium uppercase tracking-wider text-cream transition hover:bg-ink"
              style={{ transitionTimingFunction: `cubic-bezier(${easing.brisk.join(",")})` }}
            >
              Suivant <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-medium uppercase tracking-wider text-ink transition hover:bg-gold-warm disabled:opacity-60"
              style={{ transitionTimingFunction: `cubic-bezier(${easing.brisk.join(",")})` }}
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
      </form>
    </FormProvider>
  )
}
