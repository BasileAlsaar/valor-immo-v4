import { apimoFetch } from "./client"
import { toPublicProperty, type PublicProperty } from "./public-property"
import type {
  ApimoAgenciesResponse,
  ApimoAgency,
  ApimoPropertiesResponse,
  ApimoProperty,
} from "./types"

export { apimoFetch, ApimoError } from "./client"
export {
  labelFor,
  property_category,
  property_period,
  property_status,
  property_step,
  property_subtype,
  property_type,
  UNKNOWN_LABEL,
} from "./catalogs"
export type { CatalogName } from "./catalogs"
export { computeSlug, extractReferenceFromSlug } from "./slug"
export { toPublicProperty } from "./public-property"
export type {
  PublicArea,
  PublicCity,
  PublicComment,
  PublicDistrict,
  PublicPicture,
  PublicPrice,
  PublicProperty,
} from "./public-property"
export type {
  ApimoAgency,
  ApimoAgenciesResponse,
  ApimoArea,
  ApimoCity,
  ApimoComment,
  ApimoDistrict,
  ApimoPicture,
  ApimoPrice,
  ApimoPropertiesResponse,
  ApimoProperty,
  ApimoUser,
} from "./types"

export const VALOR_IMMO_AGENCY_ID = "26398"

export async function listAgencies(): Promise<ApimoAgency[]> {
  const data = await apimoFetch<ApimoAgenciesResponse>("/agencies")
  return data.agencies
}

export type ListPropertiesParams = {
  agencyId?: string
  limit?: number
  offset?: number
}

export async function listProperties(
  params: ListPropertiesParams = {}
): Promise<ApimoPropertiesResponse> {
  const { agencyId = VALOR_IMMO_AGENCY_ID, limit, offset } = params
  return apimoFetch<ApimoPropertiesResponse>(
    `/agencies/${agencyId}/properties`,
    { query: { limit, offset } }
  )
}

// --- Règle de publication ------------------------------------------------
// Décision produit (2026-07-01, branche lot1-commercial). Le filtre est
// appliqué côté serveur après fetch, jamais poussé en query params Apimo,
// pour permettre de logger *ce qui est exclu et pourquoi*.
//
// `group` n'est PAS filtré : Apimo renvoie 404 sur GET /catalogs/property_group
// donc on n'a pas de mapping fiable. On loggue la valeur brute au fetch.

export const PUBLIABLE_STATUS = 1 // "En cours"
export const PUBLIABLE_STEP = 1 // "En cours"
export const PUBLIABLE_CATEGORIES: ReadonlySet<number> = new Set([1, 2])
// 1 Vente, 2 Location
export const PUBLIABLE_TYPES: ReadonlySet<number> = new Set([4, 7, 9])
// 4 Commerce, 7 Bureau, 9 Locaux d'activité / Entrepôts

/**
 * Drapeau éditorial "vérifié / à publier sur le site". Apimo n'expose
 * AUCUN champ prêt-à-l'emploi pour ça (cf. audit 2026-07-01 : `tags`,
 * `tags_customized`, `ranking`, `providers`, `portals`, `publications`,
 * `diffusion`, `broadcast`, `networks` sont tous vides/null sur les 15
 * biens live). Convention : Yoav ajoute la chaîne `site-verifie` dans le
 * champ `tags_customized` du bien côté admin Apimo. Sans ce tag, un bien
 * ne franchit pas la frontière serveur → client.
 *
 * Le matching est TOLÉRANT (normalisation) pour survivre à une variante
 * de casse ou d'accent saisie par erreur — mais la convention officielle
 * reste strictement `site-verifie` (sans accent, sans espace, minuscules).
 */
export const VERIFIED_TAG = "site-verifie"

function normalizeTag(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
}

/**
 * Un bien est considéré "vérifié" si `tags_customized` contient au moins
 * un tag (string) dont la forme normalisée === `site-verifie`.
 * Cas dégradés (tags_customized absent / null / non-array / tag non-string)
 * → false, avec journalisation en amont (evaluatePubliable).
 */
export function hasVerifiedTag(p: ApimoProperty): boolean {
  const raw = p.tags_customized
  if (!Array.isArray(raw)) return false
  return raw.some(
    (t) => typeof t === "string" && normalizeTag(t) === VERIFIED_TAG
  )
}

export type PubliableReason =
  | "step_not_active"
  | "status_not_active"
  | "category_out_of_scope"
  | "type_out_of_scope"
  | "no_verified_tag"

export type ExcludedProperty = {
  id: number
  reference: string
  reasons: PubliableReason[]
}

export function evaluatePubliable(p: ApimoProperty): PubliableReason[] {
  const reasons: PubliableReason[] = []
  if (p.step !== PUBLIABLE_STEP) reasons.push("step_not_active")
  if (p.status !== PUBLIABLE_STATUS) reasons.push("status_not_active")
  if (!PUBLIABLE_CATEGORIES.has(p.category))
    reasons.push("category_out_of_scope")
  if (!PUBLIABLE_TYPES.has(p.type)) reasons.push("type_out_of_scope")
  // Garde-fou éditorial : par défaut FERMÉ (aucun bien ne remonte tant
  // que Yoav n'a pas posé le tag). Voir VERIFIED_TAG.
  if (!hasVerifiedTag(p)) reasons.push("no_verified_tag")
  return reasons
}

export function isPubliable(p: ApimoProperty): boolean {
  return evaluatePubliable(p).length === 0
}

export function partitionByPubliable(properties: ApimoProperty[]): {
  publishable: ApimoProperty[]
  excluded: ExcludedProperty[]
} {
  const publishable: ApimoProperty[] = []
  const excluded: ExcludedProperty[] = []
  for (const p of properties) {
    const reasons = evaluatePubliable(p)
    if (reasons.length === 0) {
      publishable.push(p)
    } else {
      excluded.push({ id: p.id, reference: p.reference, reasons })
    }
  }
  return { publishable, excluded }
}

export type ListPubliableResult = {
  publishable: PublicProperty[]
  excluded: ExcludedProperty[]
  total_items: number
  timestamp: number | null
}

export async function listPubliableProperties(
  params: ListPropertiesParams = {}
): Promise<ListPubliableResult> {
  const res = await listProperties(params)

  const groupCounts = new Map<number, number>()
  for (const p of res.properties) {
    groupCounts.set(p.group, (groupCounts.get(p.group) ?? 0) + 1)
  }
  console.info(
    JSON.stringify({
      event: "apimo.properties.group_values",
      note: "catalog property_group renvoie 404, valeur brute non traduite",
      counts: Object.fromEntries(groupCounts),
      total: res.properties.length,
    })
  )

  const { publishable, excluded } = partitionByPubliable(res.properties)
  if (excluded.length > 0) {
    console.info(
      JSON.stringify({
        event: "apimo.properties.excluded",
        count: excluded.length,
        excluded,
      })
    )
  }

  return {
    publishable: publishable.map(toPublicProperty),
    excluded,
    total_items: res.total_items,
    timestamp: res.timestamp,
  }
}
