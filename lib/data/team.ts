/**
 * Équipe Valor Immo — 2 interlocuteurs confirmés affichés sur /l-agence.
 *
 * Photos non encore fournies — le markup affiche un fallback initiales gold
 * sur fond fir-dark (brief V3 ligne 817 : pas de mannequin Pexels en costume).
 */

export type TeamMember = {
  name: string
  initials: string
  role: string
  expertise: string
}

export const team: TeamMember[] = [
  {
    name: "Yoav Marciano",
    initials: "YM",
    role: "Fondateur",
    expertise:
      "Fondateur de Valor Immo. Spécialiste de l'immobilier commercial parisien et de la transmission d'établissements.",
  },
  {
    name: "Basile Alsaar",
    initials: "BA",
    role: "Spécialiste IT",
    expertise:
      "Conception et développement de la plateforme digitale Valor Immo. Outils d'analyse et de mise en relation.",
  },
]
