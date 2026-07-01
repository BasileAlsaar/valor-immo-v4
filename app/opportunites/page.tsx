import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Mail } from "lucide-react"

import { PageHero } from "@/components/sections/page-hero"
import { CallbackSection } from "@/components/sections/callback-section"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Badge } from "@/components/ui/badge"
import { CtaPill } from "@/components/ui/cta-pill"
import { OpportunitiesFilters } from "@/components/sections/opportunities-filters"
import {
  parseFiltersFromSearchParams,
  type FilterParams,
} from "@/lib/filters/opportunities"
import { getDepartement } from "@/lib/data/departements"
import { ScrollToResultsOnMount } from "./scroll-on-search"
import { listPubliableProperties } from "@/lib/apimo"
import { toDisplayProperty, type DisplayProperty } from "@/lib/apimo/to-display"
import { STATUT_LABEL, TYPE_LABEL } from "@/lib/data/properties"

// Revalidation ISR alignée sur /commerces (Apimo mis à jour 1-2×/jour côté
// agence). Voir app/commerces/page.tsx pour la justification.
export const revalidate = 3600

export const metadata: Metadata = {
  title: "Opportunités — Catalogue",
  description:
    "Catalogue des biens commerciaux disponibles à la location, à l'acquisition ou en cession de fonds à Paris.",
}

function formatPrice(v: number) {
  return new Intl.NumberFormat("fr-FR").format(v)
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

/**
 * Clés de paramètres URL considérées comme "recherche utilisateur" — pour
 * décider si on doit auto-scroller vers la section résultats à l'arrivée.
 * Whitelist explicite pour ignorer d'éventuels params techniques.
 */
const SEARCH_PARAM_KEYS = [
  "transaction",
  "typologie",
  "arrondissement",
  "commune",
  "surfaceMin",
  "loyerMax",
  "q",
  "tags",
] as const

function hasAnySearchParam(
  sp: { [key: string]: string | string[] | undefined },
): boolean {
  return SEARCH_PARAM_KEYS.some((k) => {
    const v = sp[k]
    if (Array.isArray(v)) return v.some((x) => typeof x === "string" && x.length > 0)
    return typeof v === "string" && v.length > 0
  })
}

function ordinalArrondissement(n: number): string {
  return n === 1 ? "1ᵉʳ" : `${n}ᵉ`
}

/**
 * Libellé de zone pour l'EmptyState contextualisé. Précédence : commune
 * (chip UI) > arrondissement (SearchBar) > codePostal > departement > q.
 */
function buildZoneLabel(f: FilterParams): string | null {
  if (f.commune.length === 1) {
    return `à ${f.commune[0]}`
  }
  if (f.arrondissement.length === 1) {
    return `dans le ${ordinalArrondissement(f.arrondissement[0])} arrondissement`
  }
  if (f.codePostal) {
    return `sur ce secteur (${f.codePostal})`
  }
  if (f.departement) {
    const nom = getDepartement(f.departement)
    if (nom) return `en ${nom}`
  }
  if (f.q) {
    return `à ${f.q}`
  }
  return null
}

/**
 * Facteurs de conversion vers un loyer mensuel selon le label de période
 * Apimo (culture=fr). Utilisé UNIQUEMENT pour NORMALISER le filtre
 * `loyerMax` — jamais pour l'affichage. Voir carte : la valeur brute et la
 * période brute restent affichées telles quelles (« 42 000 €/an »).
 */
const PERIOD_TO_MONTHLY_FACTOR: Record<string, number> = {
  jour: 30,
  semaine: 52 / 12,
  quinzaine: 26 / 12,
  mois: 1,
  bimensuel: 0.5,
  trimestre: 1 / 3,
  semestre: 1 / 6,
  an: 1 / 12,
}

function monthlyEquivalent(
  loyer: number | undefined,
  period: string | undefined,
): number | undefined {
  if (loyer == null) return undefined
  if (!period) return loyer
  const factor = PERIOD_TO_MONTHLY_FACTOR[period.toLowerCase()]
  if (factor == null) return loyer
  return loyer * factor
}

function priceForCap(
  p: DisplayProperty,
): { value: number; kind: "location" | "vente" } | undefined {
  if (p.statut === "location") {
    // Normalisation mensuelle CÔTÉ FILTRE UNIQUEMENT — les affichages
    // conservent la valeur brute + la période.
    const monthly = monthlyEquivalent(p.loyerMensuel, p.period)
    if (monthly == null) return undefined
    return { value: monthly, kind: "location" }
  }
  if (p.prix != null) return { value: p.prix, kind: "vente" }
  return undefined
}

function applyFilters(
  list: DisplayProperty[],
  f: FilterParams,
): DisplayProperty[] {
  return list.filter((p) => {
    if (f.typologie.length > 0) {
      const match = p.categories.some((c) => f.typologie.includes(c))
      if (!match) return false
    }
    if (f.transaction.length > 0) {
      if (f.transaction.includes("location") && p.statut === "location") {
        // ok
      } else if (
        f.transaction.includes("vente") &&
        (p.statut === "vente" || p.statut === "murs-libres")
      ) {
        // ok
      } else {
        return false
      }
    }
    // Commune (chip UI) — match exact case-insensitive contre p.ville.
    // OR intra-groupe, AND vs autres filtres géo.
    if (f.commune.length > 0) {
      const villeLower = p.ville.toLowerCase()
      const match = f.commune.some((c) => c.toLowerCase() === villeLower)
      if (!match) return false
    }
    // Arrondissement (SearchBar Hero) — les biens hors 75 (arrondissement
    // null) sont exclus si un filtre arrondissement est actif.
    if (f.arrondissement.length > 0) {
      if (p.arrondissement == null) return false
      if (!f.arrondissement.includes(p.arrondissement)) return false
    }
    if (f.codePostal !== undefined && p.codePostal !== f.codePostal) {
      return false
    }
    if (f.departement !== undefined) {
      const len = f.departement.length
      if (p.codePostal.slice(0, len) !== f.departement) return false
    }
    // q (texte libre ville) — fallback souple. Match insensible casse sur
    // ville ou quartier. Ignoré si une clé géo structurée filtre déjà.
    if (
      f.q !== undefined &&
      f.commune.length === 0 &&
      f.arrondissement.length === 0 &&
      f.codePostal === undefined &&
      f.departement === undefined
    ) {
      const needle = f.q.toLowerCase()
      const matches =
        p.ville.toLowerCase().includes(needle) ||
        p.quartier.toLowerCase().includes(needle)
      if (!matches) return false
    }
    if (f.surfaceMin !== undefined && p.surface < f.surfaceMin) {
      return false
    }
    if (f.loyerMax !== undefined) {
      const cap = priceForCap(p)
      if (cap === undefined || cap.value > f.loyerMax) return false
    }
    return true
  })
}

/**
 * Tri des communes pour le chip UI :
 *   1. Paris intra-muros (Paris 1ᵉʳ → Paris 20ᵉ) triés par arrondissement,
 *   2. Autres communes, ordre alphabétique.
 */
function sortCommunes(names: string[]): string[] {
  const parisRe = /^Paris\s+(\d+)/i
  return names.slice().sort((a, b) => {
    const ma = a.match(parisRe)
    const mb = b.match(parisRe)
    if (ma && mb) return parseInt(ma[1], 10) - parseInt(mb[1], 10)
    if (ma) return -1
    if (mb) return 1
    return a.localeCompare(b, "fr")
  })
}

export default async function OpportunitesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams
  const filters = parseFiltersFromSearchParams(sp)

  const { publishable } = await listPubliableProperties()
  const all = publishable.map(toDisplayProperty)
  const filtered = applyFilters(all, filters)

  // Options de filtres DYNAMIQUES — dérivées des biens réellement présents.
  // Une classe / une commune n'apparaît que si ≥ 1 bien la porte.
  const availableTypologies = Array.from(
    new Set(all.flatMap((p) => p.categories)),
  )
  const availableCommunes = sortCommunes(
    Array.from(new Set(all.map((p) => p.ville).filter(Boolean))),
  )

  const shouldScrollToResults = hasAnySearchParam(sp)

  return (
    <>
      <PageHero
        eyebrow="Opportunités"
        title={
          <>
            Catalogue des biens <span className="text-gold">disponibles.</span>
          </>
        }
        subtitle="Mise à jour hebdomadaire. Chaque opportunité est validée avant publication, avec accès direct à la pièce maîtresse : bail, plan, baux comparables, simulation."
        backgroundImage="/images/categories/locaux-commerciaux.jpg"
      />

      {all.length > 0 && (
        <OpportunitiesFilters
          resultCount={filtered.length}
          totalCount={all.length}
          availableTypologies={availableTypologies}
          availableCommunes={availableCommunes}
        />
      )}

      <ScrollToResultsOnMount active={shouldScrollToResults} />

      <section id="resultats" className="scroll-mt-24 py-12 md:py-16">
        <Container>
          <div className="mb-8">
            <Eyebrow className="text-gold-deep">Sélection en cours</Eyebrow>
            <p className="mt-2 text-sm text-ink/60">
              Sélection mise à jour chaque semaine. Visites sur rendez-vous.
            </p>
          </div>

          {filtered.length === 0 ? (
            all.length === 0 ? (
              <EmptyCatalogState />
            ) : (
              <EmptyState zoneLabel={buildZoneLabel(filters)} />
            )
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <PropertyCard key={p.ref} property={p} formatPrice={formatPrice} />
              ))}
            </div>
          )}
        </Container>
      </section>

      <CallbackSection />
    </>
  )
}

function PropertyCard({
  property: p,
  formatPrice,
}: {
  property: DisplayProperty
  formatPrice: (v: number) => string
}) {
  const statusTone: "gold" | "neutral" | "green" =
    p.statut === "vente" ? "gold" : p.statut === "murs-libres" ? "green" : "neutral"

  // Photo : première photo Apimo si disponible, sinon fond fir-dark (fallback
  // brief V3 ligne 252). Aucun /images/properties/{slug}.jpg local n'existe
  // pour les biens Apimo — les URLs media.apimo.pro sont autorisées via
  // next.config.ts.
  const photo = p.photos?.[0]

  // Affichage prix : valeur brute + période (« 2 000 €/mois », « 42 000 €/an »).
  // Jamais mensualisé à l'écran, cf. Commit 1 (period exposé).
  let priceLabel: string
  if (p.loyerMensuel != null) {
    const suffix = p.period ? `/${p.period.toLowerCase()}` : ""
    priceLabel = `${formatPrice(p.loyerMensuel)} €${suffix}`
  } else if (p.prix != null) {
    priceLabel = `${formatPrice(p.prix)} €`
  } else {
    priceLabel = "Sur demande"
  }

  // Localisation : quartier si dispo, sinon ville seule.
  const locLine = p.quartier && p.quartier !== p.ville
    ? `${p.quartier} · ${p.surface} m²`
    : `${p.ville} · ${p.surface} m²`

  return (
    <Link
      href={`/commerces/${p.slug}`}
      className="group flex flex-col h-full overflow-hidden rounded-2xl bg-white shadow-[0_8px_28px_-12px_rgba(15,61,46,0.18)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgba(15,61,46,0.25)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-fir-dark">
        {photo ? (
          <Image
            src={photo}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
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
      <div className="p-6 flex flex-1 flex-col">
        <p className="eyebrow text-gold-deep">{TYPE_LABEL[p.type]}</p>
        <h2 className="mt-3 text-lg font-medium leading-tight text-fir-dark">{p.title}</h2>
        <p className="mt-2 text-sm text-ink/60">{locLine}</p>
        <p className="mt-auto pt-5 font-display text-3xl uppercase tracking-tight text-fir-dark">
          {priceLabel}
        </p>
      </div>
    </Link>
  )
}

/**
 * Empty state affiché quand le CATALOGUE ENTIER est vide (0 bien publiable
 * après filtre `no_verified_tag`). Distinct de l'empty state "aucun
 * résultat pour vos critères" — pour qu'un visiteur qui arrive sur une
 * page sans aucun filtre ne se demande pas ce qu'il a mal fait.
 */
function EmptyCatalogState() {
  return (
    <div className="rounded-3xl border border-fir-dark/10 bg-white p-12 text-center shadow-[0_8px_28px_-12px_rgba(15,61,46,0.10)]">
      <Eyebrow className="text-gold-deep">Sélection en préparation</Eyebrow>
      <h2 className="font-display mt-4 text-2xl uppercase leading-tight tracking-tight text-fir-dark md:text-3xl">
        Nos biens sont en cours de publication.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm text-ink/70">
        La prochaine sélection est en cours de vérification par notre équipe.
        Revenez très bientôt — ou contactez-nous pour être informé en priorité
        des prochaines opportunités.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <CtaPill href="/contact" variant="fir" size="md">
          <Mail className="h-4 w-4" /> Être prévenu
        </CtaPill>
      </div>
    </div>
  )
}

function EmptyState({ zoneLabel }: { zoneLabel?: string | null }) {
  const titre = zoneLabel
    ? `Pas encore de bien ${zoneLabel}.`
    : "Aucun bien ne correspond à vos critères."
  return (
    <div className="rounded-3xl border border-fir-dark/10 bg-white p-12 text-center shadow-[0_8px_28px_-12px_rgba(15,61,46,0.10)]">
      <Eyebrow className="text-gold-deep">Aucun résultat</Eyebrow>
      <h2 className="font-display mt-4 text-2xl uppercase leading-tight tracking-tight text-fir-dark md:text-3xl">
        {titre}
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm text-ink/70">
        Modifiez votre recherche ou contactez-nous pour une recherche personnalisée.
        Notre équipe peut activer son réseau pour vous proposer des biens off-market.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <CtaPill href="/contact" variant="fir" size="md">
          <Mail className="h-4 w-4" /> Recherche personnalisée
        </CtaPill>
      </div>
    </div>
  )
}
