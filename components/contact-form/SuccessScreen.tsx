"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"

import {
  LABELS,
  zoneLabel,
  type ContactFormValues,
  type Zone,
} from "@/lib/validations/contact"
import { duration, easing } from "@/lib/motion"
import { Container } from "@/components/ui/container"
import { CtaPill } from "@/components/ui/cta-pill"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Surface } from "@/components/ui/surface"
import { setHeaderMode } from "@/lib/header-mode"
import { SITE } from "@/lib/site"
import { cn } from "@/lib/utils"

type Props = {
  /** Snapshot des champs validés au submit. Tous les sous-champs sont optionnels
   * dans le typage pour permettre un rendu défensif (cf. masquage de ligne). */
  lead: Partial<ContactFormValues>
}

type RecapEntry = { label: string; value: string }

function formatZones(zones: Zone[]): string {
  if (zones.length === 0) return ""
  if (zones.length > 2) {
    return `${zones.slice(0, 2).map(zoneLabel).join(", ")} +${zones.length - 2}`
  }
  return zones.map(zoneLabel).join(", ")
}

function buildRecap(lead: Partial<ContactFormValues>): RecapEntry[] {
  const candidates: { label: string; value: string | null }[] = [
    {
      label: "Typologie",
      value: lead.typologie ? LABELS.typologie[lead.typologie] : null,
    },
    {
      label: "Transaction",
      value: lead.transaction ? LABELS.transaction[lead.transaction] : null,
    },
    {
      label: "Horizon",
      value: lead.deadline ? LABELS.deadline[lead.deadline] : null,
    },
    {
      label: "Zone(s)",
      value: lead.zones && lead.zones.length > 0 ? formatZones(lead.zones) : null,
    },
  ]
  return candidates.filter((e): e is RecapEntry => e.value !== null)
}

const TIMELINE_STEPS = [
  { label: "Demande reçue", detail: "À l'instant", state: "done" as const },
  { label: "Étude qualifiée", detail: "Sous 24h ouvrées", state: "active" as const },
  { label: "Premier échange", detail: "Par téléphone", state: "pending" as const },
]

export function SuccessScreen({ lead }: Props) {
  const reduce = useReducedMotion() ?? false
  const recap = buildRecap(lead)

  // Bascule le SiteHeader en mode minimal (logo seul) le temps de l'écran.
  useEffect(() => {
    setHeaderMode("minimal")
    return () => setHeaderMode("default")
  }, [])

  const seq = (delay: number) =>
    reduce
      ? { initial: false, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: duration.base, ease: easing.smooth },
        }

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-fir-dark text-cream">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-fir-dark via-fir-dark to-fir-darker"
        aria-hidden
      />

      <Container className="flex flex-1 flex-col items-center justify-center pt-28 pb-10 md:pt-32">
        <div className="flex w-full max-w-xl flex-col items-center text-center">
          <Medallion reduce={reduce} />

          <motion.div {...seq(0.45)} className="mt-6">
            <Eyebrow className="text-gold">Dossier reçu</Eyebrow>
            <h1 className="font-display mt-3 text-[clamp(1.75rem,5vw,3.25rem)] uppercase leading-none tracking-tight text-cream">
              Demande reçue.
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-cream/75">
              Un de nos interlocuteurs confirmés étudie votre dossier et vous
              contacte sous 24 heures ouvrées.
            </p>
          </motion.div>

          {recap.length > 0 && (
            <motion.div {...seq(0.6)} className="mt-6 w-full">
              <Surface variant="dark" className="p-5 text-left md:p-6">
                <Eyebrow className="text-gold-warm">Récapitulatif</Eyebrow>
                <dl className="font-mono mt-3 divide-y divide-cream/10 text-sm tabular">
                  {recap.map((entry) => (
                    <RecapRow key={entry.label} label={entry.label} value={entry.value} />
                  ))}
                </dl>
              </Surface>
            </motion.div>
          )}

          <motion.ol {...seq(0.75)} className="mt-6 grid w-full grid-cols-3 gap-2 sm:gap-4">
            {TIMELINE_STEPS.map((step, i) => (
              <TimelineItem key={step.label} step={step} index={i} reduce={reduce} />
            ))}
          </motion.ol>

          <motion.div
            {...seq(0.9)}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center"
          >
            <CtaPill href="/" variant="gold" size="md">
              Retour à l&apos;accueil
            </CtaPill>
            <Link
              href="/opportunites"
              className="inline-flex items-center text-sm uppercase tracking-wider text-cream/80 underline-offset-4 transition hover:text-gold hover:underline"
            >
              Découvrir nos opportunités →
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}

function RecapRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <dt className="text-cream/55">{label}</dt>
      <dd className="text-right text-cream">{value}</dd>
    </div>
  )
}

function TimelineItem({
  step,
  index,
  reduce,
}: {
  step: (typeof TIMELINE_STEPS)[number]
  index: number
  reduce: boolean
}) {
  const dotClasses = cn(
    "h-2.5 w-2.5 rounded-full",
    step.state === "done" && "bg-gold",
    step.state === "active" && "bg-gold/60",
    step.state === "pending" && "bg-cream/25",
  )
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.85 + index * 0.08, duration: duration.base, ease: easing.smooth }}
      className="flex flex-col items-center text-center"
    >
      <div className="relative flex w-full items-center justify-center">
        {index > 0 && (
          <span
            aria-hidden
            className={cn(
              "absolute right-1/2 top-1/2 h-px w-full -translate-y-1/2",
              step.state === "done" || step.state === "active"
                ? "bg-gold/40"
                : "bg-cream/15",
            )}
          />
        )}
        <span className={cn("relative", dotClasses)} />
      </div>
      <p className="eyebrow mt-2 text-cream">{step.label}</p>
      <p className="mt-1 text-xs leading-snug text-cream/55">
        {step.detail}
      </p>
    </motion.li>
  )
}

function Medallion({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: duration.slow, ease: easing.smooth }}
      className="relative h-28 w-28 sm:h-32 sm:w-32"
    >
      <Sunburst reduce={reduce} />

      <motion.div
        animate={reduce ? undefined : { rotate: 360 }}
        transition={
          reduce
            ? undefined
            : { duration: 40, ease: "linear", repeat: Infinity }
        }
        className="absolute inset-1 rounded-full border border-gold/35"
      >
        <span
          aria-hidden
          className="absolute -top-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gold"
        />
      </motion.div>

      <motion.div
        animate={reduce ? undefined : { scale: [1, 1.025, 1] }}
        transition={
          reduce
            ? undefined
            : { duration: 3.6, ease: "easeInOut", repeat: Infinity }
        }
        className="absolute inset-3 flex items-center justify-center rounded-full bg-fir-darker ring-1 ring-gold/30"
      >
        <div className="flex h-full w-full items-center justify-center rounded-full ring-1 ring-gold/40">
          <Image
            src="/logo-valor-immo.png"
            alt={SITE.name}
            width={400}
            height={400}
            priority
            className="h-3/4 w-3/4 object-contain brightness-0 invert"
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

function Sunburst({ reduce }: { reduce: boolean }) {
  const rays = Array.from({ length: 12 }, (_, i) => i)
  return (
    <motion.svg
      viewBox="0 0 100 100"
      aria-hidden
      initial={reduce ? false : { opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15, duration: duration.slow, ease: easing.smooth }}
      className="absolute inset-0 h-full w-full text-gold/30"
    >
      {rays.map((i) => (
        <line
          key={i}
          x1="50"
          y1="6"
          x2="50"
          y2="14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          transform={`rotate(${i * 30} 50 50)`}
        />
      ))}
    </motion.svg>
  )
}
