import { Mail } from "lucide-react"

import { Container } from "@/components/ui/container"
import { CtaPill } from "@/components/ui/cta-pill"
import { Eyebrow } from "@/components/ui/eyebrow"
import { OpportunitiesFilters } from "@/components/sections/opportunities-filters"
import { PropertyCard } from "@/components/sections/property-card"
import { sortCommunes } from "@/lib/opportunities/pipeline"
import type { DisplayProperty } from "@/lib/apimo/to-display"

type Props = {
  /**
   * Base URL utilisée par la filter bar pour router.replace. Chaque page
   * listing passe la sienne (/opportunites, /location, /vente).
   */
  basePath: string
  /**
   * Tous les biens du périmètre (avant application des filtres URL). Sert
   * à calculer les options dynamiques (typologies, communes) et à
   * afficher l'état vide "catalogue vide" (0 bien).
   */
  all: DisplayProperty[]
  /** Biens visibles après filtrage (searchParams). */
  filtered: DisplayProperty[]
  /**
   * Libellé contextualisé pour l'empty state "aucun résultat"
   * (« à Suresnes », « dans le 14ᵉ arrondissement », …). null → message
   * générique.
   */
  emptyZoneLabel: string | null
  /**
   * Texte de sous-titre au-dessus de la grille (« Sélection mise à jour
   * chaque semaine »…). Permet de garder la sémantique éditoriale
   * spécifique à chaque page.
   */
  sectionSubtitle?: string
}

export function PropertyListingSection({
  basePath,
  all,
  filtered,
  emptyZoneLabel,
  sectionSubtitle = "Sélection mise à jour chaque semaine. Visites sur rendez-vous.",
}: Props) {
  const availableTypologies = Array.from(
    new Set(all.flatMap((p) => p.categories)),
  )
  const availableCommunes = sortCommunes(
    Array.from(new Set(all.map((p) => p.ville).filter(Boolean))),
  )

  return (
    <>
      {all.length > 0 && (
        <OpportunitiesFilters
          resultCount={filtered.length}
          totalCount={all.length}
          availableTypologies={availableTypologies}
          availableCommunes={availableCommunes}
          basePath={basePath}
        />
      )}

      <section id="resultats" className="scroll-mt-24 py-12 md:py-16">
        <Container>
          <div className="mb-8">
            <Eyebrow className="text-gold-deep">Sélection en cours</Eyebrow>
            <p className="mt-2 text-sm text-ink/60">{sectionSubtitle}</p>
          </div>

          {filtered.length === 0 ? (
            all.length === 0 ? (
              <EmptyCatalogState />
            ) : (
              <EmptyFilterState zoneLabel={emptyZoneLabel} />
            )
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <PropertyCard key={p.ref} property={p} priority={i < 3} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  )
}

/**
 * Catalogue vide (0 bien dans le flux Apimo pour ce périmètre). Distinct
 * de l'empty state "aucun résultat" : ici il n'y a jamais eu de bien à
 * filtrer, donc pas de suggestion de « modifier votre recherche ».
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

function EmptyFilterState({ zoneLabel }: { zoneLabel: string | null }) {
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
