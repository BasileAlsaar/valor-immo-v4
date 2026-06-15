/**
 * 6 classes d'actifs traitées par Valor Immo (grille catégories home + footer + nav).
 * Texte d'accroche éditorial court (1 phrase) utilisé en survol/tooltip.
 *
 * Phase 4 : utilisation du fallback fir-dark + titre gold (brief V3 ligne 252) pour
 * les tuiles. Photos Pexels sourcées en Phase 11 polish ou par le client.
 */

export type Category = {
  slug: string
  label: string
  accroche: string
}

export const CATEGORIES: Category[] = [
  {
    slug: "locaux-commerciaux",
    label: "Locaux commerciaux",
    accroche: "Boutiques, restauration, services — emplacements n°1 à 2 Paris.",
  },
  {
    slug: "bureaux",
    label: "Bureaux",
    accroche: "Plateaux indépendants, sièges sociaux, espaces flex.",
  },
  {
    slug: "hotellerie",
    label: "Hôtellerie",
    accroche: "Murs et fonds d'hôtels parisiens — indépendants et boutique-hôtels.",
  },
  {
    slug: "immeubles",
    label: "Immeubles",
    accroche: "Immeubles mixtes, monopropriétés, lots de copropriété.",
  },
  {
    slug: "entrepots-logistique",
    label: "Entrepôts & Logistique",
    accroche: "Stockage, dernier kilomètre, logistique urbaine.",
  },
  {
    slug: "cession-droit-au-bail",
    label: "Cession de droit au bail",
    accroche: "Reprise, cession, fonds de commerce.",
  },
]
