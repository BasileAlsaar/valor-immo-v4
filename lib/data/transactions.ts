/**
 * Transactions récentes — données réelles fournies par le client.
 *
 * Schéma volontairement minimal : libellé, adresse, arrondissement, image
 * optionnelle. Aucune commission, honoraire, montant ou nom interne. Aucun
 * superlatif marketing. Cf. brief Lot 1 / actualisation.
 *
 * Quand une image est fournie, renseigner `image` avec le chemin public
 * (ex. `/images/transactions/langue-turquoise.jpg`). Le rendu de carte
 * gère proprement l'absence d'image (pas de cadre cassé, pas de alt vide).
 */

export type Transaction = {
  libelle: string
  adresse: string
  /** Code postal (5 chiffres). Conserver la valeur transmise sans normalisation. */
  arrondissement: string
  /** Image optionnelle, à compléter ultérieurement. */
  image?: string
}

export const TRANSACTIONS: readonly Transaction[] = [
  {
    libelle: "Langue Turquoise — studio photo",
    adresse: "7 ter rue Duvergier",
    arrondissement: "75019",
  },
  {
    libelle: "Restaurant avec extraction",
    adresse: "16 rue Niepce",
    arrondissement: "75014",
  },
  {
    libelle: "Restaurant sans extraction",
    adresse: "251 boulevard Raspail",
    arrondissement: "75014",
  },
  {
    libelle: "Institut de beauté",
    adresse: "18 rue de Mesnil",
    arrondissement: "75116",
  },
  {
    libelle: "Commerce",
    adresse: "79 avenue de Clichy",
    arrondissement: "75017",
  },
] as const
