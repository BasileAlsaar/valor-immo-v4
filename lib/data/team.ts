/**
 * 4 cards équipe — /l-agence.
 * CONTENU FICTIF À REMPLACER AVANT MISE EN LIGNE PUBLIQUE.
 * Voir CONTENT_TODO.md section « PHASE 8 — Contenu fictif à remplacer ».
 *
 * Noms francisés crédibles, aucun individu réel. Photos en fallback fir-dark
 * + initiales gold (brief V3 ligne 817 : pas de mannequin Pexels en costume).
 */

export type TeamMember = {
  name: string
  initials: string
  role: string
  expertise: string
}

export const team: TeamMember[] = [
  {
    name: "Camille Berthier",
    initials: "CB",
    role: "Directrice générale",
    expertise:
      "15 ans en immobilier commercial parisien, ex-directrice de département en agence institutionnelle.",
  },
  {
    name: "Antoine Lavergne",
    initials: "AL",
    role: "Directeur transactions retail",
    expertise:
      "Spécialiste des baux commerciaux pied d'immeuble et des cessions de fonds CHR.",
  },
  {
    name: "Sophie Rouvier",
    initials: "SR",
    role: "Directrice tertiaire & investissement",
    expertise:
      "Pilote les opérations de bureaux et d'immeubles en bloc — clientèle family offices et institutionnels.",
  },
  {
    name: "Marc Vanderputte",
    initials: "MV",
    role: "Conseil cession et reprise",
    expertise:
      "Expert des cessions de droit au bail et de la transmission de fonds CHR.",
  },
]
