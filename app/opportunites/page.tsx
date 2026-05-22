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
import { parseFiltersFromSearchParams } from "@/lib/filters/opportunities"
import {
  properties,
  STATUT_LABEL,
  TYPE_LABEL,
  type Property,
  type PropertyCategory,
} from "@/lib/data/properties"

export const metadata: Metadata = {
  title: "Opportunités — Catalogue",
  description:
    "Catalogue des biens commerciaux disponibles à la location, à l'acquisition ou en cession de fonds à Paris.",
}

function formatPrice(v: number) {
  return new Intl.NumberFormat("fr-FR").format(v)
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

function applyFilters(
  list: Property[],
  f: ReturnType<typeof parseFiltersFromSearchParams>,
): Property[] {
  return list.filter((p) => {
    if (f.typologie.length > 0) {
      const match = p.categories.some((c) =>
        f.typologie.includes(c as PropertyCategory),
      )
      if (!match) return false
    }
    if (f.transaction.length > 0) {
      if (f.transaction.includes("location") && p.statut === "location") {
        // ok
      } else if (f.transaction.includes("vente") && (p.statut === "vente" || p.statut === "murs-libres")) {
        // ok
      } else {
        return false
      }
    }
    if (f.arrondissement.length > 0) {
      if (!f.arrondissement.includes(p.arrondissement)) return false
    }
    return true
  })
}

export default async function OpportunitesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams
  const filters = parseFiltersFromSearchParams(sp)
  const filtered = applyFilters(properties, filters)

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

      <OpportunitiesFilters
        resultCount={filtered.length}
        totalCount={properties.length}
      />

      <section className="py-12 md:py-16">
        <Container>
          <div className="mb-8">
            <Eyebrow className="text-gold-deep">Sélection en cours</Eyebrow>
            <p className="mt-2 text-sm text-ink/60">
              Sélection mise à jour chaque semaine. Visites sur rendez-vous.
            </p>
          </div>

          {filtered.length === 0 ? (
            <EmptyState />
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
  property: Property
  formatPrice: (v: number) => string
}) {
  const statusTone: "gold" | "neutral" | "green" =
    p.statut === "vente" ? "gold" : p.statut === "murs-libres" ? "green" : "neutral"

  return (
    <Link
      href={`/opportunites/${p.slug}`}
      className="group block h-full overflow-hidden rounded-2xl bg-white shadow-[0_8px_28px_-12px_rgba(15,61,46,0.18)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgba(15,61,46,0.25)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-fir-dark">
        <Image
          src={`/images/properties/${p.slug}.jpg`}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-105"
        />
        <Badge variant="status" tone={statusTone} className="absolute left-4 top-4">
          {STATUT_LABEL[p.statut]}
        </Badge>
        <Badge variant="ref" tone="dark" className="absolute right-4 top-4">
          {p.ref}
        </Badge>
      </div>
      <div className="p-6">
        <p className="eyebrow text-gold-deep">{TYPE_LABEL[p.type]}</p>
        <h2 className="mt-3 text-lg font-medium leading-tight text-fir-dark">{p.title}</h2>
        <p className="mt-2 text-sm text-ink/60">
          {p.quartier} · {p.surface} m²
        </p>
        <p className="mt-5 font-display text-3xl uppercase tracking-tight text-fir-dark">
          {p.loyerMensuel
            ? `${formatPrice(p.loyerMensuel)} €/mois`
            : p.prix
              ? `${formatPrice(p.prix)} €`
              : "Sur demande"}
        </p>
      </div>
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-fir-dark/10 bg-white p-12 text-center shadow-[0_8px_28px_-12px_rgba(15,61,46,0.10)]">
      <Eyebrow className="text-gold-deep">Aucun résultat</Eyebrow>
      <h2 className="font-display mt-4 text-2xl uppercase leading-tight tracking-tight text-fir-dark md:text-3xl">
        Aucun bien ne correspond à vos critères.
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
