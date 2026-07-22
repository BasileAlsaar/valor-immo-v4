import Image from "next/image"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Eyebrow } from "@/components/ui/eyebrow"
import type { PublicProperty } from "@/lib/apimo"

type Props = {
  property: PublicProperty
  /** LCP hint : `true` sur les 3 premières cartes de la grille. */
  priority?: boolean
}

const NF = new Intl.NumberFormat("fr-FR")

function formatPrice(price: NonNullable<PublicProperty["price"]>): string {
  if (price.value === null) return "Sur demande"
  const currency = price.currency === "EUR" ? "€" : price.currency
  return `${NF.format(price.value)} ${currency} / ${price.period.toLowerCase()}`
}

// Apimo unit 1 = m² (défaut sur les 8 fiches observées). Toute autre valeur
// affichera uniquement le nombre — un log serait utile mais on ne veut pas
// polluer le render côté serveur ; à surveiller au fil des ajouts.
function formatArea(area: PublicProperty["area"]): string | null {
  if (area.total == null) return null
  return area.unit === 1 ? `${area.total} m²` : String(area.total)
}

export function CommerceCard({ property: p, priority }: Props) {
  const firstPic = p.pictures[0]
  const geoLine = [p.city?.name, p.district?.name].filter(Boolean).join(" · ")
  const areaStr = formatArea(p.area)
  const secondary = [geoLine, areaStr].filter(Boolean).join(" · ")
  const typeLine =
    p.subtype && p.subtype !== "—" && p.subtype !== p.type
      ? `${p.type} — ${p.subtype}`
      : p.type && p.type !== "—"
        ? p.type
        : ""
  const priceStr = p.price ? formatPrice(p.price) : "Sur demande"
  const altText = p.content?.title ?? `${p.type} · ${p.reference}`

  return (
    <Link
      href={`/commerces/${p.slug}`}
      data-testid="commerce-card"
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_28px_-12px_rgba(15,61,46,0.18)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgba(15,61,46,0.25)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-fir-dark">
        {firstPic ? (
          <Image
            src={firstPic.url}
            alt={altText}
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
        <div className="absolute inset-0 bg-gradient-to-t from-fir-dark/30 to-transparent" />
      </div>

      {/* Grammaire alignée sur la fiche (étape 3) :
          badges → eyebrow type → titre → sub-line → prix section.
          Les badges quittent l'overlay image pour rejoindre le flux
          content, comme sur la fiche — même lecture des deux côtés. */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-3">
          {p.category && p.category !== "—" && (
            <Badge variant="status" tone="neutral">
              {p.category}
            </Badge>
          )}
          <Badge variant="ref" tone="dark">
            {p.reference}
          </Badge>
        </div>

        {typeLine && (
          <Eyebrow as="p" className="mt-4 text-gold-deep">
            {typeLine}
          </Eyebrow>
        )}

        <h2 className="font-display mt-2 text-xl uppercase leading-tight tracking-tight text-fir-dark">
          {p.content?.title ?? "Bien commercial"}
        </h2>

        {secondary && <p className="mt-2 text-sm text-ink/60">{secondary}</p>}

        <div className="mt-auto border-t border-gold-deep/40 pt-4">
          <Eyebrow className="text-gold-deep">Prix</Eyebrow>
          <p className="font-display mt-1 text-3xl uppercase tracking-tight text-fir-dark">
            {priceStr}
          </p>
        </div>
      </div>
    </Link>
  )
}
