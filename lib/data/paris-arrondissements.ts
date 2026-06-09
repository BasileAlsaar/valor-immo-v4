/**
 * Liste ordonnée pour l'autocomplete du Hero : "Paris" (ville entière) en
 * première position, puis Paris 1ᵉʳ → Paris 20ᵉ dans l'ordre croissant des
 * codes postaux 75001 → 75020. Utilisée par ZoneCombobox quand la saisie
 * correspond à "Paris" — court-circuite l'ordre par pertinence de la BAN.
 */

export type ParisAutocompleteItem = {
  /** Libellé affiché. */
  label: string
  /** Code postal, ou null pour "Paris" (ville entière). */
  postcode: string | null
  /** Arrondissement 1..20, ou null pour "Paris" entière. */
  arrondissement: number | null
}

export const PARIS_AUTOCOMPLETE: readonly ParisAutocompleteItem[] = [
  { label: "Paris", postcode: null, arrondissement: null },
  { label: "Paris 1ᵉʳ", postcode: "75001", arrondissement: 1 },
  { label: "Paris 2ᵉ", postcode: "75002", arrondissement: 2 },
  { label: "Paris 3ᵉ", postcode: "75003", arrondissement: 3 },
  { label: "Paris 4ᵉ", postcode: "75004", arrondissement: 4 },
  { label: "Paris 5ᵉ", postcode: "75005", arrondissement: 5 },
  { label: "Paris 6ᵉ", postcode: "75006", arrondissement: 6 },
  { label: "Paris 7ᵉ", postcode: "75007", arrondissement: 7 },
  { label: "Paris 8ᵉ", postcode: "75008", arrondissement: 8 },
  { label: "Paris 9ᵉ", postcode: "75009", arrondissement: 9 },
  { label: "Paris 10ᵉ", postcode: "75010", arrondissement: 10 },
  { label: "Paris 11ᵉ", postcode: "75011", arrondissement: 11 },
  { label: "Paris 12ᵉ", postcode: "75012", arrondissement: 12 },
  { label: "Paris 13ᵉ", postcode: "75013", arrondissement: 13 },
  { label: "Paris 14ᵉ", postcode: "75014", arrondissement: 14 },
  { label: "Paris 15ᵉ", postcode: "75015", arrondissement: 15 },
  { label: "Paris 16ᵉ", postcode: "75016", arrondissement: 16 },
  { label: "Paris 17ᵉ", postcode: "75017", arrondissement: 17 },
  { label: "Paris 18ᵉ", postcode: "75018", arrondissement: 18 },
  { label: "Paris 19ᵉ", postcode: "75019", arrondissement: 19 },
  { label: "Paris 20ᵉ", postcode: "75020", arrondissement: 20 },
] as const

/**
 * Détecte si la saisie utilisateur correspond à une recherche "Paris".
 * Vrai dès que la saisie (≥ 2 caractères) est un préfixe de "paris" ou
 * commence par "paris" — couvre les cas "pa", "par", "pari", "paris",
 * "paris 5", "paris 16e", etc.
 */
export function matchesParisQuery(query: string): boolean {
  const s = query.trim().toLowerCase()
  if (s.length < 2) return false
  return "paris".startsWith(s) || s.startsWith("paris")
}
