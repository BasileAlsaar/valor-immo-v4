import { cache } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react"

import { DescriptionApimo } from "@/components/commerces/description-apimo"
import {
  MOBILE_ACTION_BAR_SPACER,
  MobileActionBar,
} from "@/components/commerces/mobile-action-bar"
import { MobileFigures } from "@/components/commerces/mobile-figures"
import { ZoneMap } from "@/components/commerces/zone-map"
import { Gallery } from "@/components/ui/gallery"
import { Badge } from "@/components/ui/badge"
import { Container } from "@/components/ui/container"
import { CtaPill } from "@/components/ui/cta-pill"
import { Eyebrow } from "@/components/ui/eyebrow"
import { SetHeaderLight } from "@/components/site/set-header-light"
import { nearestStops } from "@/lib/transports/nearest-stops"
import {
  extractReferenceFromSlug,
  listPubliableProperties,
  type PublicProperty,
} from "@/lib/apimo"
import { SITE } from "@/lib/site"

export const revalidate = 3600

type Params = Promise<{ slug: string }>

// Dedupe l'appel Apimo au sein d'une même requête : generateStaticParams,
// generateMetadata et le default export appellent tous ce lookup. Sans
// cache(), on ferait 3 hits Apimo par render.
const getPublishable = cache(async () => {
  const res = await listPubliableProperties()
  return res.publishable
})

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const publishable = await getPublishable()
  return publishable.map((p) => ({ slug: p.slug }))
}

async function findBienForSlug(
  requestedSlug: string
): Promise<
  | { kind: "match"; bien: PublicProperty }
  | { kind: "canonical"; canonicalSlug: string }
  | { kind: "not_found" }
> {
  const publishable = await getPublishable()
  const direct = publishable.find((p) => p.slug === requestedSlug)
  if (direct) return { kind: "match", bien: direct }
  const ref = extractReferenceFromSlug(requestedSlug)
  if (!ref) return { kind: "not_found" }
  const byRef = publishable.find((p) => p.reference.toLowerCase() === ref)
  if (byRef) return { kind: "canonical", canonicalSlug: byRef.slug }
  return { kind: "not_found" }
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { slug } = await params
  const result = await findBienForSlug(slug)
  if (result.kind !== "match") return {}
  const b = result.bien
  const cityLine = [b.district?.name, b.city?.name].filter(Boolean).join(", ")
  const desc = b.content?.comment
    ? b.content.comment.slice(0, 160).replace(/\s+/g, " ").trim()
    : `${b.type}${b.subtype && b.subtype !== b.type ? ` — ${b.subtype}` : ""} · ${cityLine}`
  return {
    title: b.content?.title ?? `${b.type} · ${b.reference}`,
    description: desc,
    openGraph: {
      title: b.content?.title ?? `${b.type} · ${b.reference}`,
      description: desc,
      images: b.pictures[0] ? [{ url: b.pictures[0].url }] : undefined,
    },
  }
}

const NF = new Intl.NumberFormat("fr-FR")

function formatPrice(price: NonNullable<PublicProperty["price"]>): string {
  if (price.value === null) return "Sur demande"
  const currency = price.currency === "EUR" ? "€" : price.currency
  return `${NF.format(price.value)} ${currency} / ${price.period.toLowerCase()}`
}

// Facteurs de conversion vers annuel selon le label de période (Apimo culture=fr).
// Utilisé UNIQUEMENT pour dériver un €/m²/an sur une LOCATION. On ne
// mensualise/annualise jamais le prix affiché principal.
const PERIOD_TO_YEARLY_FACTOR: Record<string, number> = {
  jour: 365,
  semaine: 52,
  quinzaine: 26,
  mois: 12,
  bimensuel: 6,
  trimestre: 4,
  semestre: 2,
  an: 1,
}

// Prix au m² : deux sémantiques distinctes selon la nature du bien.
//  - Vente     → prix d'acquisition / surface   (unité : € / m², chiffre exact)
//  - Location  → loyer annualisé / surface       (unité : € / m² / an, indicatif)
// La distinction se fait sur `PublicProperty.category` (label "Vente" ou
// "Location"). Utiliser l'annualisation sur une vente donnerait un « / an »
// dépourvu de sens.

function salePricePerSqm(
  price: PublicProperty["price"],
  area: PublicProperty["area"]
): string | null {
  if (!price || price.value == null) return null
  if (area.total == null || area.total <= 0) return null
  const perSqm = Math.round(price.value / area.total)
  return `${NF.format(perSqm)} € / m²`
}

function annualRentPerSqm(
  price: PublicProperty["price"],
  area: PublicProperty["area"]
): string | null {
  if (!price || price.value == null) return null
  if (area.total == null || area.total <= 0) return null
  const factor = PERIOD_TO_YEARLY_FACTOR[price.period.toLowerCase()]
  if (factor == null) return null
  const yearly = price.value * factor
  const perSqm = Math.round(yearly / area.total)
  return `${NF.format(perSqm)} € / m² / an`
}

function formatArea(area: PublicProperty["area"]): string | null {
  if (area.total == null) return null
  return area.unit === 1 ? `${area.total} m²` : String(area.total)
}

function jsonLdForBien(b: PublicProperty) {
  // schema.org n'a pas de RealEstateListing standard : on utilise Product +
  // Offer. Aucun geo précis (cohérent avec la carte de zone), seulement la
  // ville / code postal / pays.
  const image = b.pictures.map((p) => p.url)
  const description = b.content?.comment
    ? b.content.comment.replace(/\s+/g, " ").trim()
    : undefined
  const offer: Record<string, unknown> = {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    ...(b.price?.value != null
      ? {
          price: b.price.value,
          priceCurrency: b.price.currency,
          ...(b.price.period.toLowerCase() !== "an"
            ? { unitText: b.price.period }
            : {}),
        }
      : {}),
  }
  const address: Record<string, string> = { "@type": "PostalAddress" }
  if (b.city?.name) address.addressLocality = b.city.name
  if (b.city?.zipcode) address.postalCode = b.city.zipcode
  address.addressCountry = "FR"
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: b.content?.title ?? `${b.type} · ${b.reference}`,
    ...(description ? { description } : {}),
    ...(image.length > 0 ? { image } : {}),
    sku: b.reference,
    category: b.subtype && b.subtype !== "—" ? b.subtype : b.type,
    offers: offer,
    ...(Object.keys(address).length > 1 ? { address } : {}),
  }
}

export default async function CommerceDetailPage({
  params,
}: {
  params: Params
}) {
  const { slug } = await params
  const result = await findBienForSlug(slug)
  if (result.kind === "not_found") notFound()
  if (result.kind === "canonical") {
    redirect(`/commerces/${result.canonicalSlug}`)
  }
  const b = result.bien
  const typeLine =
    b.subtype && b.subtype !== "—" && b.subtype !== b.type
      ? `${b.type} — ${b.subtype}`
      : b.type
  const priceStr = b.price ? formatPrice(b.price) : "Sur demande"
  // Prix au m² dérivé — deux sémantiques distinctes. `approx = true` pour
  // la location (loyer annualisé indicatif), false pour la vente
  // (division exacte prix / surface).
  const perSqm: { label: string; approx: boolean } | null =
    b.category === "Vente"
      ? (() => {
          const label = salePricePerSqm(b.price, b.area)
          return label ? { label, approx: false } : null
        })()
      : b.category === "Location"
        ? (() => {
            const label = annualRentPerSqm(b.price, b.area)
            return label ? { label, approx: true } : null
          })()
        : null
  const areaStr = formatArea(b.area)
  const geoLine = [b.district?.name, b.city?.name].filter(Boolean).join(" · ")
  // Référence machine (parsable côté /contact). Le libellé lisible est
  // reconstruit serveur-side sur /contact à partir de PublicProperty — on
  // ne transporte plus de phrase en URL.
  const contactHref = `/contact?bien=${encodeURIComponent(b.reference)}`
  const contactSubject = `Bien ${b.reference}${b.content?.title ? ` — ${b.content.title}` : ""}`

  return (
    <>
      <SetHeaderLight />
      <script
        type="application/ld+json"
        // JSON-LD schema.org — city-level only, aucun geo précis.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdForBien(b)) }}
      />
      {/* Wrapper : réserve l'espace de la MobileActionBar (fixed) sous
          `lg` pour éviter que le dernier contenu passe derrière la barre.
          Au-dessus de `lg`, la barre est masquée → pas de padding. */}
      <div className={MOBILE_ACTION_BAR_SPACER}>
      {/* Padding-top calé sur le token `--header-offset` (96 px mobile /
          160 px desktop) pour que le contenu démarre proprement SOUS le
          `SiteHeader` fixe. Sans ça, "Retour au catalogue" chevauche la
          rangée du header. */}
      <section className="bg-cream pt-[calc(var(--header-offset)+1.5rem)] pb-6 md:pt-[calc(var(--header-offset)+2rem)] md:pb-10">
        <Container>
          <Link
            href="/commerces"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-ink/60 hover:text-fir-dark"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour au catalogue
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Badge variant="status" tone="neutral">
              {b.category}
            </Badge>
            <Badge variant="ref" tone="dark">
              {b.reference}
            </Badge>
            {typeLine && (
              <span className="eyebrow text-gold-deep">{typeLine}</span>
            )}
          </div>

          <h1 className="font-display mt-4 text-[clamp(2rem,4.5vw,3.75rem)] uppercase leading-[0.95] tracking-tight text-fir-dark">
            {b.content?.title ?? "Bien commercial"}
          </h1>

          {/* Sous-titre : `geoLine` toujours affiché (localisation). La
              surface n'apparaît qu'à partir de `lg` — sous ce breakpoint,
              elle est portée par `MobileFigures` juste en dessous, pour
              éviter de la répéter. */}
          {geoLine && (
            <p className="mt-4 text-base text-ink/70 md:text-lg">
              {geoLine}
              {areaStr && (
                <span className="hidden lg:inline"> · {areaStr}</span>
              )}
            </p>
          )}
          {!geoLine && areaStr && (
            <p className="mt-4 hidden text-base text-ink/70 md:text-lg lg:block">
              {areaStr}
            </p>
          )}

          <MobileFigures
            className="mt-8"
            category={b.category}
            priceStr={priceStr}
            perSqm={perSqm}
            areaStr={areaStr}
            deposit={b.price?.deposit ?? null}
          />
        </Container>
      </section>

      {/* Section fusionnée : Gallery + Description (col gauche) et card
          prix sticky (col droite) dans UNE seule grille 2-col. Évite le
          débordement historique : la Gallery, précédemment full-width
          avec `h-[60vh]` mais sans contrainte sur ses vignettes
          `aspect-[4/3]`, laissait déborder ses vignettes sous sa
          section quand ≥ 3 photos étaient publiées (Apimo VI7 en a 3,
          dont la watermark VI). Confiner la Gallery dans une colonne
          de largeur 2fr rend l'overflow structurellement impossible.
          Mobile : `grid-cols-1` implicite → Gallery, puis Description,
          puis card, sans overlap. */}
      <section className="bg-white py-14 md:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
            <div>
              {b.pictures.length > 0 && (
                <Gallery
                  images={b.pictures.map((pic) => ({
                    src: pic.url,
                    alt: b.content?.title ?? `${b.type} · ${b.reference}`,
                  }))}
                  aspectRatio="4/3"
                />
              )}

              <div className={b.pictures.length > 0 ? "mt-12" : ""}>
                <Eyebrow className="text-gold-deep">Description</Eyebrow>
                {b.content?.comment ? (
                  <DescriptionApimo
                    text={b.content.comment}
                    className="mt-6"
                  />
                ) : (
                  <p className="mt-6 text-base text-ink/60">
                    Description à venir. Contactez-nous pour plus d&apos;informations.
                  </p>
                )}
              </div>
            </div>

            <aside className="lg:sticky lg:top-[calc(var(--header-offset)+2rem)] lg:self-start">
              <div className="rounded-2xl border border-fir-dark/10 bg-cream p-8 shadow-[0_8px_28px_-12px_rgba(15,61,46,0.18)]">
                <Eyebrow className="text-gold-deep">Prix</Eyebrow>
                <p className="font-display mt-3 text-3xl uppercase tracking-tight text-fir-dark md:text-4xl">
                  {priceStr}
                </p>
                {perSqm && (
                  <p className="mt-2 text-xs text-ink/55">
                    Soit {perSqm.approx ? "~" : ""}
                    {perSqm.label} à titre indicatif.
                  </p>
                )}

                <dl className="mt-6 space-y-2 text-sm text-ink/70">
                  {areaStr && (
                    <div className="flex justify-between">
                      <dt>Surface</dt>
                      <dd className="text-fir-dark">{areaStr}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt>Type</dt>
                    <dd className="text-fir-dark">{typeLine}</dd>
                  </div>
                  {b.price?.fees != null && (
                    <div className="flex justify-between">
                      <dt>Charges</dt>
                      <dd className="text-fir-dark">
                        {NF.format(b.price.fees)} € /{" "}
                        {b.price.period.toLowerCase()}
                      </dd>
                    </div>
                  )}
                  {b.price?.deposit != null && (
                    <div className="flex justify-between">
                      <dt>Dépôt de garantie</dt>
                      <dd className="text-fir-dark">
                        {NF.format(b.price.deposit)} €
                      </dd>
                    </div>
                  )}
                  {geoLine && (
                    <div className="flex justify-between">
                      <dt>Secteur</dt>
                      <dd className="text-fir-dark">{geoLine}</dd>
                    </div>
                  )}
                </dl>

                <div className="mt-8 space-y-3 border-t border-fir-dark/10 pt-6">
                  <a
                    href={`tel:${SITE.telephoneTel}`}
                    className="flex items-center gap-3 text-sm text-fir-dark hover:text-gold-deep"
                  >
                    <Phone className="h-4 w-4" />
                    {SITE.telephoneDisplay}
                  </a>
                  <a
                    href={`mailto:${SITE.email}?subject=${encodeURIComponent(contactSubject)}`}
                    className="flex items-center gap-3 text-sm text-fir-dark hover:text-gold-deep"
                  >
                    <Mail className="h-4 w-4" />
                    {SITE.email}
                  </a>
                </div>

                <CtaPill
                  href={contactHref}
                  variant="fir"
                  size="md"
                  className="mt-6 w-full justify-center"
                >
                  Demander une visite
                </CtaPill>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {b.latitude != null && b.longitude != null && (() => {
        // Résolution des repères transport côté serveur, à partir des
        // coord ARRONDIES (b.latitude/longitude sont déjà à 3 décimales).
        // Le dataset IDFM complet ne franchit pas la frontière serveur →
        // client — seules les 0-3 stations retournées sont sérialisées
        // dans la carte.
        const stops = nearestStops(b.latitude, b.longitude, 3)
        return (
          <section className="bg-cream py-14 md:py-20">
            <Container>
              <Eyebrow className="text-gold-deep">Zone</Eyebrow>
              <div className="mt-4 flex items-center gap-2 text-sm text-ink/60">
                <MapPin className="h-4 w-4" />
                <span>
                  {geoLine || "Localisation approximative"} · rayon indicatif{" "}
                  {b.zoneRadius} m
                </span>
              </div>
              <div className="mt-8">
                <ZoneMap
                  centerLat={b.latitude}
                  centerLng={b.longitude}
                  radiusMeters={b.zoneRadius}
                  cityLabel={b.city?.name}
                  districtLabel={b.district?.name}
                  stops={stops}
                />
              </div>
              {stops.length > 0 && (
                <p className="mt-2 text-[11px] text-ink/45">
                  Transport : Île-de-France Mobilités — Etalab 2.0.
                </p>
              )}
            </Container>
          </section>
        )
      })()}
      </div>

      <MobileActionBar
        visitHref={contactHref}
        telHref={`tel:${SITE.telephoneTel}`}
        telDisplay={SITE.telephoneDisplay}
      />
    </>
  )
}
