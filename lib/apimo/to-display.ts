/**
 * Adaptateur `PublicProperty` (flux Apimo) → `DisplayProperty` (forme
 * consommée par les composants existants — Property mock de
 * lib/data/properties.ts).
 *
 * Discipline (identique à `public-property.ts`) :
 *  - fonction pure, construction d'un NOUVEL objet, jamais de spread ;
 *  - aucun accès à des champs Apimo non déjà exposés par `PublicProperty` —
 *    ce module n'a AUCUNE dépendance sur `ApimoProperty` ni sur les
 *    catalogs bruts. Il ne consomme que la surface publique déjà
 *    normalisée par `toPublicProperty`.
 *  - tous les champs optionnels du mock qui ne sont pas dérivables
 *    d'Apimo restent `undefined` (jamais chaîne vide ni valeur factice).
 *
 * Rôle : permettre aux pages actuelles (Opportunités / Location / Vente,
 * carrousel home, /classes-d-actifs/[slug]) de lire du flux Apimo sans
 * changement de forme, en préservant l'affichage brut + période côté prix
 * (voir champ `period` exposé pour usage filtre & affichage).
 *
 * ⚠️ Une fine divergence de forme est assumée par rapport au mock :
 *  - `arrondissement` : `number | null` (le mock imposait `number`). Apimo
 *    ne peut PAS fournir d'arrondissement pour un bien hors 75XXX ; on
 *    expose `null` plutôt qu'un `0` menteur.
 *  - `center` : `[number, number] | null` (le mock imposait `[number,
 *    number]`). Un bien Apimo sans lat/lng doit rester non-cartable —
 *    fallback interdit (ne mentirait pas juste sur la précision, mais
 *    inventerait une localisation).
 *  Les pages qui lisent ces deux champs devront gérer le cas `null` lors
 *  du branchement Apimo — c'est le seul contrat qui change.
 */

import type { PublicProperty } from "./public-property"
import type {
  Property as MockProperty,
  PropertyCategory,
  PropertyStatut,
  PropertyType,
} from "@/lib/data/properties"

// ============================================================================
// Table de correspondance typologie : (Apimo type, Apimo subtype) → PropertyCategory / PropertyType
// ============================================================================
//
// Source : catalog `property_type` + `property_subtype` (culture=fr, snapshot
// 2026-07-01). Cf. lib/apimo/catalogs.ts.
//
// Périmètre `PUBLIABLE_TYPES` (lib/apimo/index.ts) = ids type ∈ {4, 7, 9}.
// Les types 1/2/3/5/6/8/10 (Appartement, Maison, Terrain, Parking, Immeuble,
// Bateau, Cave/Box) sont donc EXCLUS AVANT d'arriver ici — l'adaptater n'a
// pas à les gérer.
//
// Règles (par label Apimo, indépendantes des ids) :
//
//   Apimo type            | Apimo subtype                    | mock category           | mock type
//   ----------------------|----------------------------------|-------------------------|------------------
//   "Bureau"              | *                                | "bureaux"               | "bureau"
//   "Locaux d'activité /  | *                                | "entrepots-logistique"  | "logistique"
//    Entrepôts"           |                                  |                         |
//   "Commerce"            | "Hôtel"                          | "hotellerie"            | "hotellerie"
//   "Commerce"            | "Fonds de commerce"              | "cession-droit-au-bail" | "fonds-commerce"
//   "Commerce"            | "Droit au bail"                  | "cession-droit-au-bail" | "fonds-commerce"
//   "Commerce"            | "Local et fonds de commerce"     | "cession-droit-au-bail" | "fonds-commerce"
//   "Commerce"            | "Local commercial"               | "locaux-commerciaux"    | "local-commercial"
//   "Commerce"            | "Boutique"                       | "locaux-commerciaux"    | "local-commercial"
//   "Commerce"            | "Commerce"                       | "locaux-commerciaux"    | "local-commercial"
//   "Commerce"            | "Arcade"                         | "locaux-commerciaux"    | "local-commercial"
//   "Commerce"            | "Atelier"                        | "locaux-commerciaux"    | "local-commercial"
//   "Commerce"            | "Atelier artisanal"              | "locaux-commerciaux"    | "local-commercial"
//   "Commerce"            | null / autre                     | "locaux-commerciaux"    | "local-commercial"  ← fallback safe
//
// Classes NON DÉRIVABLES du flux Apimo actuel :
//   - "immeubles" (mock)  → Apimo modélise l'immeuble par type=6 "Immeuble",
//                            NON inclus dans PUBLIABLE_TYPES {4,7,9}. Tant que
//                            la règle de publication reste inchangée, aucun
//                            bien Apimo ne peut être classifié "immeubles"
//                            par cet adaptater. → filtre à masquer côté UI.
//
// Statut (`PropertyStatut`) — dérivé de `PublicProperty.category` (label) :
//   - "Location"           → "location"
//   - "Vente"              → "vente"
//   - "murs-libres" (mock) → NON DÉRIVABLE : concept éditorial propre à Valor
//                            Immo (cession des murs sans le fonds). Apimo ne
//                            distingue pas ce cas de la vente. → jamais
//                            produit par toDisplayProperty. Filtre à masquer.
//
// ============================================================================

type Derivation = {
  category: PropertyCategory
  type: PropertyType
}

/**
 * Sous-groupes du type Apimo "Commerce" (label). Les libellés Apimo sont
 * stables dans le catalog fr (cf. catalogs.ts) — on match par label car
 * l'adaptater n'a jamais accès à l'id id-original.
 */
const COMMERCE_HOTEL_SUBTYPES = new Set<string>([
  "Hôtel",
])

const COMMERCE_CESSION_SUBTYPES = new Set<string>([
  "Fonds de commerce",
  "Droit au bail",
  "Local et fonds de commerce",
])

/**
 * Traduit (type label, subtype label) Apimo → mock (category, type).
 *
 * Contrats :
 *  - fallback safe : tout ce qui ne matche pas → "locaux-commerciaux" /
 *    "local-commercial". Justifié parce que PUBLIABLE_TYPES restreint déjà
 *    l'entrée à Commerce / Bureau / Entrepôts — un fallback "local
 *    commercial" est cohérent au sein de ces trois familles.
 *  - jamais "immeubles" (voir note "non dérivable" ci-dessus).
 *  - jamais "murs-libres" (voir note "non dérivable" ci-dessus).
 */
export function deriveTypologie(
  typeLabel: string,
  subtypeLabel: string
): Derivation {
  if (typeLabel === "Bureau") {
    return { category: "bureaux", type: "bureau" }
  }
  if (typeLabel === "Locaux d'activité / Entrepôts") {
    return { category: "entrepots-logistique", type: "logistique" }
  }
  if (typeLabel === "Commerce") {
    if (COMMERCE_HOTEL_SUBTYPES.has(subtypeLabel)) {
      return { category: "hotellerie", type: "hotellerie" }
    }
    if (COMMERCE_CESSION_SUBTYPES.has(subtypeLabel)) {
      return { category: "cession-droit-au-bail", type: "fonds-commerce" }
    }
    return { category: "locaux-commerciaux", type: "local-commercial" }
  }
  // Type inattendu (théoriquement filtré par PUBLIABLE_TYPES en amont). On
  // ne masque pas le bien — fallback lisible + assumé.
  return { category: "locaux-commerciaux", type: "local-commercial" }
}

// ============================================================================
// DisplayProperty — surface consommée par les composants existants
// ============================================================================

/**
 * Divergences délibérées du mock `Property` :
 *  - `arrondissement`  : `number | null` (mock : `number`)
 *  - `center`          : `[number, number] | null` (mock : `[number, number]`)
 *  - `period`          : nouveau champ (jamais présent sur le mock)
 * Tout le reste est strictement identique.
 */
export type DisplayProperty = Omit<MockProperty, "arrondissement" | "center"> & {
  arrondissement: number | null
  center: [number, number] | null
  /**
   * Période brute Apimo (label fr : "Mois", "An", "Jour"…). Absent si le
   * bien n'a pas de prix. Utilisé par :
   *   - le filtre loyer, pour normaliser en mensuel (×12 si "An", ×52/12
   *     si "Semaine", etc.) CÔTÉ FILTRE UNIQUEMENT ;
   *   - l'affichage prix, pour rendre "X €/{period}" sans mensualiser.
   */
  period?: string
}

// ============================================================================
// Helpers de dérivation
// ============================================================================

const NF = new Intl.NumberFormat("fr-FR")

function parseArrondissement(zipcode: string | undefined): number | null {
  if (!zipcode) return null
  // Paris intra-muros = 75001 → 75020. 75116 (déprécié) accepté = 16e.
  if (!/^75\d{3}$/.test(zipcode)) return null
  if (zipcode === "75116") return 16
  const n = parseInt(zipcode.slice(3), 10)
  if (!Number.isFinite(n) || n < 1 || n > 20) return null
  return n
}

function toStatut(categoryLabel: string): PropertyStatut {
  if (categoryLabel === "Vente") return "vente"
  // Défaut safe : Location. Les catégories hors {Vente, Location} sont
  // exclues en amont par PUBLIABLE_CATEGORIES.
  return "location"
}

function formatCurrency(value: number, currency: string): string {
  const symbol = currency === "EUR" ? "€" : currency
  return `${NF.format(value)} ${symbol}`
}

function fallbackTitle(
  typeLabel: string,
  subtypeLabel: string,
  district: string | null,
  city: string | null
): string {
  const kind =
    subtypeLabel && subtypeLabel !== "—" && subtypeLabel !== typeLabel
      ? subtypeLabel
      : typeLabel !== "—"
        ? typeLabel
        : "Bien"
  const place = [district, city].filter(Boolean).join(" — ")
  return place ? `${kind} — ${place}` : kind
}

/**
 * Slug utilisé par les composants existants pour l'URL détail. La règle
 * actuelle du mock ("bureaux-monceau-340m2") est éditoriale et n'a pas
 * d'équivalent Apimo. On réutilise le slug déjà calculé par
 * `toPublicProperty` (kebab(title) + "-" + reference), qui est déjà la
 * source de vérité pour /commerces/[slug].
 */
function toDisplaySlug(p: PublicProperty): string {
  return p.slug
}

// ============================================================================
// Fonction principale
// ============================================================================

export function toDisplayProperty(p: PublicProperty): DisplayProperty {
  const { category, type } = deriveTypologie(p.type, p.subtype)
  const statut = toStatut(p.category)

  const ville = p.city?.name ?? ""
  const codePostal = p.city?.zipcode ?? ""
  const quartier = p.district?.name ?? ville
  const arrondissement = parseArrondissement(codePostal)

  const center: [number, number] | null =
    p.latitude != null && p.longitude != null
      ? [p.longitude, p.latitude]
      : null

  const surface = p.area.total ?? 0

  const priceValue = p.price?.value ?? null
  const loyerMensuel = statut === "location" && priceValue != null ? priceValue : undefined
  const prix = statut !== "location" && priceValue != null ? priceValue : undefined

  // Honoraires = `price.commission` (à la charge du preneur), HT par
  // convention Apimo. Suffixe " HT" ajouté à l'affichage pour lever toute
  // ambiguïté côté client.
  // ⚠️ NE PAS utiliser `price.fees` : ce sont les provisions/charges
  // mensuelles (100 € pour VI7), déjà mentionnées dans la description
  // Apimo. Aucune ligne UI n'expose les charges — design intact.
  const honoraires =
    p.price?.commission != null && p.price.commission > 0
      ? `${formatCurrency(p.price.commission, p.price.currency)} HT`
      : undefined
  const depotGarantie =
    p.price?.deposit != null
      ? formatCurrency(p.price.deposit, p.price.currency)
      : undefined

  const photos =
    p.pictures.length > 0 ? p.pictures.map((pic) => pic.url) : undefined

  const description = p.content?.comment ?? undefined

  const title =
    p.content?.title ??
    fallbackTitle(p.type, p.subtype, p.district?.name ?? null, ville || null)

  return {
    slug: toDisplaySlug(p),
    ref: p.reference,
    statut,
    type,
    categories: [category],
    title,
    quartier,
    ville,
    codePostal,
    arrondissement,
    center,
    surface,
    // surfaceSousSol / activiteAutorisee / tags / bail / caracteristiques :
    // NON DÉRIVABLES du flux Apimo actuel — laissés `undefined`.
    loyerMensuel,
    prix,
    honoraires,
    depotGarantie,
    photos,
    description,
    period: p.price?.period,
  }
}
