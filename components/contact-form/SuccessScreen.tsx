"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"

import {
  LABELS,
  zoneLabel,
  type ContactFormValues,
} from "@/lib/validations/contact"
import { duration, easing, fadeUp } from "@/lib/motion"
import { CtaPill } from "@/components/ui/cta-pill"

type Props = {
  lead: ContactFormValues
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n)
}

export function SuccessScreen({ lead }: Props) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 1.05, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: duration.base, ease: easing.smooth }}
      className="flex flex-col items-center text-center"
    >
      <CheckMark reduce={reduce ?? false} />

      <motion.h2
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4, duration: duration.base, ease: easing.smooth }}
        className="font-display mt-8 text-[clamp(2rem,5vw,3.75rem)] uppercase leading-[1.05] tracking-tight text-fir-dark"
      >
        Demande reçue.
      </motion.h2>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.55, duration: duration.base, ease: easing.smooth }}
        className="mt-4 max-w-md text-base text-ink/70"
      >
        Un de nos interlocuteurs confirmés vous contacte sous 24h ouvrées.
      </motion.p>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.7, duration: duration.base, ease: easing.smooth }}
        className="mt-10 w-full max-w-md rounded-2xl bg-cream/70 p-6 text-left"
      >
        <p className="eyebrow text-gold-deep">Récapitulatif</p>
        <dl className="font-mono mt-4 space-y-2 text-sm tabular text-ink/80">
          <Row label="Typologie" value={LABELS.typologie[lead.typologie]} />
          <Row label="Transaction" value={LABELS.transaction[lead.transaction]} />
          <Row
            label="Surface"
            value={
              lead.surfaceMin === lead.surfaceMax
                ? `${formatNumber(lead.surfaceMin)} m²`
                : `${formatNumber(lead.surfaceMin)} – ${formatNumber(lead.surfaceMax)} m²`
            }
          />
          <Row label="Horizon" value={LABELS.deadline[lead.deadline]} />
          <Row
            label="Zone(s)"
            value={
              lead.zones.length > 2
                ? `${lead.zones.slice(0, 2).map(zoneLabel).join(", ")} +${lead.zones.length - 2}`
                : lead.zones.map(zoneLabel).join(", ")
            }
          />
        </dl>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.85, duration: duration.base, ease: easing.smooth }}
        className="mt-10 flex flex-wrap items-center justify-center gap-3"
      >
        <CtaPill href="/" variant="outline-ink" size="md">
          Retour à l'accueil
        </CtaPill>
        <Link
          href="/opportunites"
          className="inline-flex items-center text-sm uppercase tracking-wider text-gold-deep underline-offset-4 hover:underline"
        >
          Découvrir nos opportunités →
        </Link>
      </motion.div>
    </motion.div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-ink/50">{label}</dt>
      <dd className="text-fir-dark">{value}</dd>
    </div>
  )
}

function CheckMark({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      initial={reduce ? false : { scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: easing.brisk }}
      className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/30 bg-gold/10"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="h-10 w-10 text-gold-deep"
      >
        <motion.path
          d="M4 12.5l5 5L20 7"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: easing.smooth, delay: 0.2 }}
        />
      </svg>
    </motion.div>
  )
}
