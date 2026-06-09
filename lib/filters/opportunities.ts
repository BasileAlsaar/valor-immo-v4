/**
 * Logique pure de parsing des searchParams pour /opportunites.
 * Module isolé pour pouvoir être consommé à la fois côté server (page.tsx)
 * et côté client (opportunities-filters.tsx).
 */

export type FilterParams = {
  typologie: string[]
  transaction: string[]
  arrondissement: number[]
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
    surfaceMin: parsePositiveInt(readScalar(searchParams, "surfaceMin")),
    loyerMax: parsePositiveInt(readScalar(searchParams, "loyerMax")),
  }
}
