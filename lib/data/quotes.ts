/**
 * 6 quotes preuve sociale — fictives, anonymisées par persona générique.
 * CONTENU FICTIF À REMPLACER AVANT MISE EN LIGNE PUBLIQUE.
 * Voir CONTENT_TODO.md section « PHASE 11 — Quotes preuve sociale fictives ».
 *
 * Pas de nom d'entreprise réelle. Attributions copiées littéralement
 * depuis le brief Phase 11.
 */

export type Quote = {
  id: string
  text: string
  attribution: string
}

export const quotes: Quote[] = [
  {
    id: "q1",
    text: "Recherche d'un emplacement Triangle d'or pendant plus de six mois, négociation conduite sans relais — c'est ce qui fait la différence à ce niveau de marché.",
    attribution: "Directeur immobilier d'un groupe horloger international",
  },
  {
    id: "q2",
    text: "Sur des dossiers de cession à plusieurs millions d'euros, la qualité du conseil amont vaut largement les honoraires. On a évité deux erreurs structurelles dès la phase de brief.",
    attribution: "Investisseur, family office parisien",
  },
  {
    id: "q3",
    text: "Le marché parisien des bureaux QCA demande une connaissance fine des arbitrages 8ᵉ / 9ᵉ que peu d'agences maîtrisent vraiment. Brief écouté, restitution rapide, exécution propre.",
    attribution: "DAF d'un cabinet de conseil mid-cap",
  },
  {
    id: "q4",
    text: "Cession de fonds en restauration : entre la fiscalité, la licence IV et la négociation avec le bailleur, l'accompagnement intégré nous a fait gagner trois mois sur le calendrier.",
    attribution: "Restaurateur, cession d'un établissement parisien",
  },
  {
    id: "q5",
    text: "Pas de chasse hors cible, pas de visites pour faire du chiffre. On nous a présenté trois biens, on en a signé un. C'est rare.",
    attribution: "Directrice retail d'une enseigne lifestyle européenne",
  },
  {
    id: "q6",
    text: "Mandat de gestion sur un immeuble haussmannien : reporting régulier, gestion technique anticipée, locataires renouvelés sans vacance. Travail patrimonial sérieux.",
    attribution: "Investisseur institutionnel, SCPI",
  },
]
