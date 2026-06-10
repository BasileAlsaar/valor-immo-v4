/**
 * Quotes preuve sociale — fictives, anonymisées par persona générique.
 * Contenu validé client — 10 juin 2026
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
    text: "Nous cherchions à arbitrer un immeuble de bureaux dans le 9e. Estimation, sourcing de l'acquéreur, closing en quatre mois — sans que j'aie à courir après quoi que ce soit.",
    attribution: "Investisseur, family office parisien",
  },
  {
    id: "q2",
    text: "Trouver un local avec extraction dans le Marais relevait du parcours du combattant. Trois emplacements hors-marché présentés en deux semaines.",
    attribution: "Restaurateur, Paris 4e",
  },
  {
    id: "q3",
    text: "Cession discrète, valorisation juste, acquéreur sérieux. L'accompagnement sur le bail 3-6-9 a fait la différence.",
    attribution: "Gérante d'une enseigne de prêt-à-porter, Paris 6e",
  },
  {
    id: "q4",
    text: "Un interlocuteur unique, des comptes clairs chaque trimestre, aucun impayé laissé sans suite.",
    attribution: "Propriétaire d'un portefeuille mixte, Paris 16e",
  },
]
