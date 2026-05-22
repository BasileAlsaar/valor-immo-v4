/**
 * Logique pure de parsing des searchParams pour /opportunites.
 * Module isolé pour pouvoir être consommé à la fois côté server (page.tsx)
 * et côté client (opportunities-filters.tsx).
 */

export type FilterParams = {
  typologie: string[]
  transaction: string[]
  arrondissement: number[]
}

function parseList(value: string | null | undefined): string[] {
  if (!value) return []
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)
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
  }
}
