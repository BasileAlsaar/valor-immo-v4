/**
 * Logique pure de parsing des searchParams pour /opportunites.
 * Module isolé pour pouvoir être consommé à la fois côté server (page.tsx)
 * et côté client (opportunities-filters.tsx).
 */

export type FilterParams = {
  typologie: string[]
  transaction: string[]
  arrondissement: number[]
  /**
   * Communes exactes (city.name Apimo). Multi-select. Match strict
   * case-insensitive contre `p.ville`. Utilisé par le chip UI de la barre
   * de filtres — dérivé dynamiquement des biens présents. Coexiste avec
   * `arrondissement` (émis par SearchBar Hero) : les deux sont appliqués
   * en AND côté server.
   */
  commune: string[]
  /** Code postal exact (5 chiffres). Undefined = pas de contrainte. */
  codePostal?: string
  /** Code département (2 chars métropole / 2A / 2B, ou 3 chars DROM). */
  departement?: string
  /**
   * Texte de recherche ville libre (fallback si aucune clé géo structurée
   * n'a été résolue par le combobox). Match insensible casse sur
   * `ville` ou `quartier`. Undefined = pas de contrainte.
   */
  q?: string
  /** Surface plancher en m² (saisie SearchBar Hero). Undefined = pas de contrainte. */
  surfaceMin?: number
  /**
   * Plafond monétaire (saisie SearchBar Hero). Comparé à `loyerMensuel`
   * pour les biens en location, à `prix` pour les biens en vente /
   * murs-libres. Undefined = pas de contrainte.
   */
  loyerMax?: number
}

function parseList(value: string | null | undefined): string[] {
  if (!value) return []
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)
}

function readScalar(
  searchParams: { [key: string]: string | string[] | undefined },
  key: string,
): string | undefined {
  const v = searchParams[key]
  if (Array.isArray(v)) return v[0]
  return v
}

function parsePositiveInt(raw: string | undefined): number | undefined {
  if (!raw) return undefined
  const n = parseInt(raw, 10)
  if (!Number.isFinite(n) || n <= 0) return undefined
  return n
}

function parseCodePostal(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  return /^\d{5}$/.test(raw) ? raw : undefined
}

function parseDepartement(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  // 2 chars (métropole y compris 2A/2B) ou 3 chars (DROM).
  return /^(\d{2}|2A|2B|\d{3})$/.test(raw) ? raw : undefined
}

function parseQ(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  const trimmed = raw.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export function parseFiltersFromSearchParams(searchParams: {
  [key: string]: string | string[] | undefined
}): FilterParams {
  function read(k: string): string[] {
    const v = searchParams[k]
    if (Array.isArray(v)) return v
    if (typeof v === "string") return parseList(v)
    return []
  }
  return {
    typologie: read("typologie"),
    transaction: read("transaction"),
    arrondissement: read("arrondissement")
      .map((n) => parseInt(n, 10))
      .filter((n) => Number.isFinite(n)),
    commune: read("commune"),
    codePostal: parseCodePostal(readScalar(searchParams, "codePostal")),
    departement: parseDepartement(readScalar(searchParams, "departement")),
    q: parseQ(readScalar(searchParams, "q")),
    surfaceMin: parsePositiveInt(readScalar(searchParams, "surfaceMin")),
    loyerMax: parsePositiveInt(readScalar(searchParams, "loyerMax")),
  }
}
