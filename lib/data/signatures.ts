/**
 * Signatures fictives — réalisations récentes Valor Immo.
 * CONTENU FICTIF À REMPLACER AVANT MISE EN LIGNE PUBLIQUE.
 * Voir CONTENT_TODO.md section « PHASE 8 — Contenu fictif à remplacer ».
 *
 * Descripteurs anonymisés (aucun nom d'enseigne réelle), refs internes
 * fictives, dates 2025-2026, équilibre typologies validé client.
 */

export type SignatureBadge = "TRANSACTION" | "LOCATION" | "CESSION"

export type Signature = {
  ref: string
  badge: SignatureBadge
  type: string
  quartier: string
  arrondissement: number
  surface: number
  /** "ISO date string ex. 2026-04-15" */
  date: string
  dateDisplay: string
  descripteur: string
  contexte: string
  realisation: string
}

export const signatures: Signature[] = [
  {
    ref: "VI-2026-014",
    badge: "TRANSACTION",
    type: "Bail commercial — Local commercial",
    quartier: "Triangle d'or",
    arrondissement: 8,
    surface: 280,
    date: "2026-04",
    dateDisplay: "Avril 2026",
    descripteur: "Bail boutique pour maison de joaillerie",
    contexte:
      "Recherche prolongée sur 5 mois pour cette maison de joaillerie suisse en quête d'un emplacement n°1 absolu dans le Triangle d'or, exigences précises sur le linéaire vitrine et le voisinage immédiat.",
    realisation:
      "Bail commercial 9 ans avec clause de sortie ferme à 6 ans signé en avril 2026, conditions confidentielles, négociation menée en direct avec le bailleur — aucun apporteur intermédiaire.",
  },
  {
    ref: "VI-2026-008",
    badge: "LOCATION",
    type: "Bail commercial — Local commercial",
    quartier: "Le Marais (rue des Francs-Bourgeois)",
    arrondissement: 4,
    surface: 95,
    date: "2026-03",
    dateDisplay: "Mars 2026",
    descripteur: "Bail boutique mode haut de gamme",
    contexte:
      "Marque de mode parisienne en expansion régionale cherchant son cinquième point de vente, exigence d'une façade d'angle dans une artère commerçante du Marais avec flux week-end soutenu.",
    realisation:
      "Bail signé en mars 2026 sur 95 m² façade d'angle, ouverture boutique prévue en septembre — accompagnement état des lieux et travaux preneur.",
  },
  {
    ref: "VI-2026-001",
    badge: "TRANSACTION",
    type: "Acquisition — Bureaux",
    quartier: "Opéra (boulevard Haussmann)",
    arrondissement: 9,
    surface: 620,
    date: "2026-01",
    dateDisplay: "Janvier 2026",
    descripteur: "Acquisition bureaux siège société conseil",
    contexte:
      "Cabinet de conseil parisien en croissance soutenue, mandat acquisition pour regrouper trois implantations dispersées sur un seul plateau divisible certifié, accessibilité métro impérative.",
    realisation:
      "Acquisition d'un plateau de 620 m² Grade A en immeuble haussmannien rénové, signature notaire janvier 2026 — travaux d'aménagement preneur en cours, livraison estimée Q3 2026.",
  },
  {
    ref: "VI-2025-127",
    badge: "LOCATION",
    type: "Bail commercial — Local commercial",
    quartier: "Champs-Élysées",
    arrondissement: 8,
    surface: 410,
    date: "2025-12",
    dateDisplay: "Décembre 2025",
    descripteur: "Bail flagship enseigne lifestyle internationale",
    contexte:
      "Enseigne lifestyle asiatique en première implantation européenne, recherche de plus de 6 mois pour un flagship sur l'avenue, exigences sur la hauteur sous plafond et l'autorisation extraction.",
    realisation:
      "Bail commercial 9 ans signé décembre 2025, prise d'effet mars 2026 après travaux preneur, accompagnement complet du brief stratégique à la remise des clés.",
  },
  {
    ref: "VI-2025-112",
    badge: "CESSION",
    type: "Cession de droit au bail — Local commercial",
    quartier: "Bastille (rue de Lappe)",
    arrondissement: 11,
    surface: 75,
    date: "2025-11",
    dateDisplay: "Novembre 2025",
    descripteur: "Cession droit au bail concept store",
    contexte:
      "Concept store lifestyle parisien souhaitant céder son bail à durée résiduelle de 7 ans, contraintes spécifiques sur la clause d'activité (déspécialisation requise pour le candidat repreneur).",
    realisation:
      "Cession du droit au bail réalisée en novembre 2025 à un repreneur dans le secteur de la beauté, négociation de la déspécialisation avec le bailleur en amont — closing en 8 semaines.",
  },
]
