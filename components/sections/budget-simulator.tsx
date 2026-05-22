"use client"

import { useState } from "react"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

import { Eyebrow } from "@/components/ui/eyebrow"

type Props = {
  surfaceInitiale: number
  /** Prix en €/m²/an HT HC dérivé de loyerMensuel ou estimé. */
  prixM2An: number
  slug: string
}

/** Taux de charges fixe (caché à l'utilisateur sprint 4b — sera exposable en sprint 5). */
const TAUX_CHARGES = 0.15

function formatPrice(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n))
}

/**
 * Simulateur budget — surface modifiable, calcul instantané du loyer + charges.
 * CTA « Affiner avec un expert » → /contact?intent=simulation&bien={slug}.
 */
export function BudgetSimulator({ surfaceInitiale, prixM2An, slug }: Props) {
  const [surface, setSurface] = useState<number>(surfaceInitiale)

  const safeSurface = Math.max(10, Math.min(surface, 5000))
  const loyerAnnuel = safeSurface * prixM2An
  const loyerMensuel = loyerAnnuel / 12
  const chargesMensuelles = loyerMensuel * TAUX_CHARGES
  const totalMensuel = loyerMensuel + chargesMensuelles

  return (
    <div
      data-testid="opportunity-budget-simulator"
      className="rounded-3xl border border-fir-dark/10 bg-cream p-8 md:p-10"
    >
      <Eyebrow className="text-gold-deep">Simulation budget</Eyebrow>
      <h3 className="font-display mt-3 text-2xl uppercase leading-tight tracking-tight text-fir-dark md:text-3xl">
        Estimez votre budget
      </h3>
      <p className="mt-3 max-w-md text-sm text-ink/65">
        Ajustez la surface souhaitée pour obtenir une estimation de loyer mensuel
        et de charges.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_1fr]">
        <div>
          <label htmlFor={`surface-${slug}`} className="block">
            <span className="eyebrow text-ink/60">Surface souhaitée (m²)</span>
            <input
              id={`surface-${slug}`}
              type="number"
              inputMode="numeric"
              min={10}
              max={5000}
              step={5}
              value={surface}
              onChange={(e) => {
                const n = parseInt(e.target.value, 10)
                if (Number.isFinite(n)) setSurface(n)
              }}
              className="mt-2 w-full border-0 border-b-2 border-ink/15 bg-transparent px-0 pb-2 font-display text-3xl uppercase tracking-tight text-fir-dark focus:border-gold focus:outline-none focus:ring-0"
            />
          </label>
          <p className="mt-2 text-xs text-ink/45">
            Prix de référence : {formatPrice(prixM2An)} €/m²/an HT HC
          </p>
        </div>

        <dl className="space-y-3 rounded-2xl bg-white p-6 shadow-[0_4px_16px_-8px_rgba(15,61,46,0.18)]">
          <Row label="Loyer annuel HT HC" value={`${formatPrice(loyerAnnuel)} €`} />
          <Row
            label="Loyer mensuel HT HC"
            value={`${formatPrice(loyerMensuel)} €`}
            emphasis
          />
          <Row
            label={`Charges estimées (${Math.round(TAUX_CHARGES * 100)} %)`}
            value={`${formatPrice(chargesMensuelles)} €`}
          />
          <hr className="my-2 border-fir-dark/10" />
          <Row
            label="Budget total mensuel estimé"
            value={`${formatPrice(totalMensuel)} €`}
            emphasis
            tone="gold"
          />
        </dl>
      </div>

      <p className="mt-6 max-w-2xl text-xs leading-relaxed text-ink/50">
        Simulation indicative. Charges réelles, taxes locales, TVA récupérable et
        fiscalité spécifique à confirmer en rendez-vous.
      </p>

      <Link
        href={`/contact?intent=simulation&bien=${slug}`}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-fir-dark px-6 py-3 text-sm font-medium uppercase tracking-wider text-cream transition hover:bg-ink"
      >
        Affiner avec un expert
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

function Row({
  label,
  value,
  emphasis,
  tone,
}: {
  label: string
  value: string
  emphasis?: boolean
  tone?: "gold"
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-xs uppercase tracking-wider text-ink/60">{label}</dt>
      <dd
        className={
          emphasis
            ? tone === "gold"
              ? "font-display text-2xl uppercase tracking-tight text-gold-deep"
              : "font-display text-2xl uppercase tracking-tight text-fir-dark"
            : "tabular font-medium text-fir-dark"
        }
      >
        {value}
      </dd>
    </div>
  )
}
