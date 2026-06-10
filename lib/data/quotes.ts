/**
 * Quotes preuve sociale — fictives, anonymisées par persona générique.
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
    text: "Nous cherchions à arbitrer un immeuble de bureaux dans le 9e. Estimation, sourcing de l'acquéreur, closing en quatre mois — sans que j'aie à courir après quoi que ce soit.",
    attribution: "Investisseur, family office parisien",
  },
  {
    id: "q2",
    text: "Trouver un local avec extraction dans le Marais relevait du parcours du combattant. Trois emplacements hors-marché présentés en deux semaines.",
    attribution: "Restaurateur, Paris 4e",
  },
]
