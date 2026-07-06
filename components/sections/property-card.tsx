import Image from "next/image"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import type { DisplayProperty } from "@/lib/apimo/to-display"
import { STATUT_LABEL, TYPE_LABEL } from "@/lib/property-labels"

const NF = new Intl.NumberFormat("fr-FR")

/**
 * Format prix brut + période. « 2 000 €/mois », « 42 000 €/an », « 6 800
 * 000 € ». Jamais mensualisé à l'écran — la mensualisation est réservée
 * au filtre `loyerMax`.
 */
function formatDisplayPrice(p: DisplayProperty): string {
  if (p.loyerMensuel != null) {
    const suffix = p.period ? `/${p.period.toLowerCase()}` : ""
    return `${NF.format(p.loyerMensuel)} €${suffix}`
  }
  if (p.prix != null) return `${NF.format(p.prix)} €`
  return "Sur demande"
}

type Props = {
  property: DisplayProperty
  /** LCP hint : `true` sur les cartes visibles en haut de grille. */
  priority?: boolean
}

export function PropertyCard({ property: p, priority }: Props) {
  const statusTone: "gold" | "neutral" | "green" =
    p.statut === "vente"
      ? "gold"
      : p.statut === "murs-libres"
        ? "green"
        : "neutral"
  const photo = p.photos?.[0]
  const priceLabel = formatDisplayPrice(p)
  const locLine =
    p.quartier && p.quartier !== p.ville
      ? `${p.quartier} · ${p.surface} m²`
      : `${p.ville} · ${p.surface} m²`

  return (
    <Link
      href={`/commerces/${p.slug}`}
      className="group flex flex-col h-full overflow-hidden rounded-2xl bg-white shadow-[0_8px_28px_-12px_rgba(15,61,46,0.18)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgba(15,61,46,0.25)]"
    >
      <div className="relative aspect-[4/5] md:aspect-[4/3] overflow-hidden bg-fir-dark">
        {photo ? (
          <Image
            src={photo}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            priority={priority}
            className="object-cover transition duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/60">
            <span className="eyebrow">Photo à venir</span>
          </div>
        )}
        <Badge variant="status" tone={statusTone} className="absolute left-4 top-4">
          {STATUT_LABEL[p.statut]}
        </Badge>
        <Badge variant="ref" tone="dark" className="absolute right-4 top-4">
          {p.ref}
        </Badge>
      </div>
      <div className="p-5 md:p-6 flex flex-1 flex-col">
        <p className="eyebrow text-gold-deep">{TYPE_LABEL[p.type]}</p>
        <h2 className="mt-3 text-lg font-medium leading-tight text-fir-dark">
          {p.title}
        </h2>
        <p className="mt-2 text-sm text-ink/60">{locLine}</p>
        <p className="mt-4 md:mt-auto md:pt-5 font-display text-3xl uppercase tracking-tight text-fir-dark">
          {priceLabel}
        </p>
      </div>
    </Link>
  )
}
