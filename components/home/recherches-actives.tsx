// PLACEHOLDER §6 — contenu d'exemple à remplacer par des mandats réels
// confirmés par le client avant toute mise en production. Ne pas publier
// tel quel comme affirmation factuelle.
//
// Pour passer en production réelle :
//   1. Vider/remplacer RECHERCHES_PLACEHOLDER avec les vraies recherches.
//   2. Retirer le préfixe "[Exemple]" des titres (laisse-le tant que ce
//      sont des données illustratives).
//   3. Retirer le badge APERÇU au-dessus du titre de section.
//   4. Optionnel — renommer le composant en RecherchesActives sans
//      annotation placeholder dans le commentaire d'en-tête.

import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { CtaPill } from "@/components/ui/cta-pill"
import { RevealStagger, RevealItem } from "@/components/motion/reveal"

type Recherche = {
  titre: string
  description: string
}

const RECHERCHES_PLACEHOLDER: readonly Recherche[] = [
  {
    titre: "Murs commerciaux occupés — Paris",
    description:
      "Localisations centrales, bail commercial en cours, rendement net stable.",
  },
  {
    titre: "Immeubles de rapport",
    description: "Monopropriétés mixtes ou logement, lots à arbitrer.",
  },
  {
    titre: "Hôtels exploités ou libres",
    description:
      "Indépendants, boutique-hôtels, opérations de repositionnement.",
  },
  {
    titre: "Actifs logistiques — Île-de-France",
    description: "Stockage urbain, dernier kilomètre, locaux d'activité.",
  },
  {
    titre: "Boutiques avec extraction",
    description: "Emplacement n°1 à 2, façade dégagée, conformité CHR.",
  },
  {
    titre: "Bureaux vacants",
    description: "Plateaux divisibles, sièges sociaux, surfaces premium.",
  },
] as const

export function RecherchesActives() {
  return (
    <section className="relative overflow-hidden bg-fir-dark py-20 text-cream md:py-24 lg:py-28">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow className="text-gold">Nos recherches actives</Eyebrow>
            <h2 className="font-display mt-3 max-w-2xl text-[clamp(1.75rem,4.5vw,4rem)] uppercase leading-[0.95] tracking-tight">
              Ce que nous cherchons
              <br />
              <span className="text-gold">pour nos clients.</span>
            </h2>
          </div>
          <PreviewBadge />
        </div>

        <RevealStagger className="mt-12 grid gap-5 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {RECHERCHES_PLACEHOLDER.map((r) => (
            <RevealItem key={r.titre}>
              <article className="group relative flex h-full flex-col justify-between gap-6 rounded-2xl border border-gold/15 bg-fir-darker p-7 transition-colors duration-300 ease-out-expo hover:border-gold/45 md:p-8">
                <span className="eyebrow text-gold/80">[Exemple]</span>
                <div>
                  <h3 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] uppercase leading-[0.95] tracking-tight text-cream">
                    {r.titre}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-cream/70">
                    {r.description}
                  </p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealStagger>

        <div className="mt-12 flex flex-col items-center gap-4 text-center md:mt-16">
          <p className="font-accent text-lg italic text-cream/80 md:text-xl">
            Vous avez un bien correspondant&nbsp;?
          </p>
          <CtaPill href="/proprietaire" variant="gold" size="lg">
            Proposer mon bien
          </CtaPill>
        </div>
      </Container>
    </section>
  )
}

/**
 * Badge visible signalant que la section est un aperçu maquette, pas une
 * publication de mandats réels. À retirer en même temps que les données
 * placeholder.
 */
function PreviewBadge() {
  return (
    <span className="inline-flex items-center gap-2 self-start rounded-full border border-gold/40 bg-fir-darker/60 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-gold md:self-end">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold" />
      Aperçu — contenu à confirmer
    </span>
  )
}
