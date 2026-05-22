/**
 * scripts/generate-references-synthetic.ts
 *
 * Génère un dataset synthétique reproductible de transactions immobilières
 * commerciales parisiennes (+ petite couronne réduite). Le fichier de sortie
 * est utilisé comme source du layer heatmap de la section ARGUS enrichie
 * (sprint 3).
 *
 * Reproductibilité : PRNG Mulberry32 seedé avec 20260522 (cf. brief sprint 3
 * §86). Aucune dépendance externe pour le seeding — l'algorithme est inline.
 *
 * Usage :
 *   node --experimental-strip-types scripts/generate-references-synthetic.ts
 *
 * Sortie :
 *   - data/references-synthetic.json (référence source, livrable §5)
 *   - public/references-synthetic.json (servie statique pour le Source react-map-gl)
 *
 * Honnêteté éditoriale (cf. brief §87) : ce dataset n'est PAS représentatif
 * du marché réel. Volume = 1200 points (cible recommandée brief, fourchette
 * autorisée 500-2000), distribution calquée sur les concentrations attendues
 * du brief §61.
 */

import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { bbox, booleanPointInPolygon, point } from "@turf/turf"

// Types GeoJSON locaux (équivalent @types/geojson) — évite l'ajout d'une dep types-only.
type Position = [number, number] | [number, number, number]
type Polygon = { type: "Polygon"; coordinates: Position[][] }
type MultiPolygon = { type: "MultiPolygon"; coordinates: Position[][][] }
type Feature<G, P> = { type: "Feature"; geometry: G; properties: P }
type FeatureCollection<G, P> = { type: "FeatureCollection"; features: Feature<G, P>[] }

const SEED = 20260522
const TOTAL_TARGET = 1200

/**
 * Quotas Paris intramuros calqués sur les concentrations §61.
 * Somme = 1150 ; les 50 restants sont alloués à la petite couronne réduite.
 */
const QUOTAS_PARIS: Record<string, number> = {
  "75001": 60,  "75002": 70,  "75003": 90,  "75004": 90,
  "75005": 50,  "75006": 75,  "75007": 40,  "75008": 90,
  "75009": 90,  "75010": 80,  "75011": 90,  "75012": 70,
  "75013": 40,  "75014": 40,  "75015": 50,  "75016": 30,
  "75017": 50,  "75018": 60,  "75019": 40,  "75020": 45,
}

/**
 * Bbox approximatives des 5 communes petite couronne mentionnées §71.
 * 10 points chacune, total 50 points.
 */
const PETITE_COURONNE: Array<{
  code: string
  nom: string
  bbox: [number, number, number, number] // [minLng, minLat, maxLng, maxLat]
  prixCommerce: number
  prixRestauExtract: number
}> = [
  { code: "92044", nom: "Levallois-Perret",       bbox: [2.27, 48.88, 2.30, 48.90], prixCommerce: 1100, prixRestauExtract: 1320 },
  { code: "92051", nom: "Neuilly-sur-Seine",      bbox: [2.24, 48.87, 2.28, 48.89], prixCommerce: 1450, prixRestauExtract: 1740 },
  { code: "92012", nom: "Boulogne-Billancourt",   bbox: [2.23, 48.83, 2.27, 48.86], prixCommerce: 1050, prixRestauExtract: 1260 },
  { code: "94067", nom: "Saint-Mandé",            bbox: [2.41, 48.84, 2.43, 48.85], prixCommerce: 900,  prixRestauExtract: 1080 },
  { code: "94080", nom: "Vincennes",              bbox: [2.43, 48.84, 2.46, 48.86], prixCommerce: 950,  prixRestauExtract: 1140 },
]

type RefType = "commerce" | "restau_extract" | "bureaux"
type RefAnnee = 2024 | 2025 | 2026

interface SyntheticRef {
  id: string
  lat: number
  lng: number
  arr: string
  type: RefType
  prix_m2_an_ht_hc: number
  surface_estimee: number
  annee: RefAnnee
}

// ──────────────────────────────────────────────────────────────────────────
// PRNG Mulberry32 — reproductible, 32-bit state, distribution uniforme [0,1)
// ──────────────────────────────────────────────────────────────────────────
function mulberry32(seed: number): () => number {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6d2b79f5) >>> 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

// Box-Muller pour bruit gaussien (centré, écart-type configurable)
function gaussianNoise(prng: () => number, sigma = 1): number {
  const u1 = Math.max(prng(), Number.MIN_VALUE)
  const u2 = prng()
  return sigma * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}

function pickType(prng: () => number): RefType {
  const r = prng()
  if (r < 0.5) return "commerce"
  if (r < 0.8) return "restau_extract"
  return "bureaux"
}

function pickAnnee(prng: () => number): RefAnnee {
  const r = prng()
  if (r < 0.33) return 2024
  if (r < 0.67) return 2025
  return 2026
}

function pickSurface(prng: () => number, type: RefType): number {
  // Surface log-normale centrée selon le type
  const mu = type === "bureaux" ? 180 : type === "restau_extract" ? 120 : 80
  const noise = gaussianNoise(prng, 0.45) // log-écart
  const s = Math.round(mu * Math.exp(noise))
  return Math.max(15, Math.min(s, 1500))
}

function priceForType(
  prng: () => number,
  type: RefType,
  prixCommerce: number,
  prixRestauExtract: number,
): number {
  // Bureaux ≈ 65-80 % du prix commerce (loyers tertiaires inférieurs au pied d'immeuble)
  const base =
    type === "commerce"
      ? prixCommerce
      : type === "restau_extract"
        ? prixRestauExtract
        : prixCommerce * (0.65 + prng() * 0.15)
  const noise = gaussianNoise(prng, 0.25) // écart-type 25 % brief §72
  const value = base * (1 + noise)
  return Math.max(100, Math.round(value)) // garde-fou §72 (pas de 100€)
}

function samplePointInPolygon(
  prng: () => number,
  feature: Feature<Polygon | MultiPolygon, unknown>,
  maxAttempts = 80,
): [number, number] | null {
  // @turf attend un Feature<…, GeoJsonProperties> ; nos properties sont
  // de type structuré (interface ArrFeatureProps côté composant). Cast
  // explicite pour conserver la lisibilité du reste du script sans
  // dépendance @types/geojson.
  const f = feature as Parameters<typeof bbox>[0]
  const [minLng, minLat, maxLng, maxLat] = bbox(f)
  for (let i = 0; i < maxAttempts; i++) {
    const lng = minLng + prng() * (maxLng - minLng)
    const lat = minLat + prng() * (maxLat - minLat)
    if (booleanPointInPolygon(point([lng, lat]), f as Parameters<typeof booleanPointInPolygon>[1])) {
      return [Number(lng.toFixed(6)), Number(lat.toFixed(6))]
    }
  }
  return null
}

// ──────────────────────────────────────────────────────────────────────────
// Génération
// ──────────────────────────────────────────────────────────────────────────
function main() {
  const prng = mulberry32(SEED)

  const geojsonPath = resolve(process.cwd(), "data/arrondissements-paris.geojson")
  const fc = JSON.parse(readFileSync(geojsonPath, "utf-8")) as FeatureCollection<
    Polygon | MultiPolygon,
    { code: string; nom: string; prix_commerce: number; prix_restau_extract: number }
  >

  const refs: SyntheticRef[] = []
  let nextId = 1

  // ── Paris intramuros : 20 arrondissements
  for (const feature of fc.features) {
    const arrCode = feature.properties.code
    const quota = QUOTAS_PARIS[arrCode] ?? 0
    if (quota === 0) continue
    const { prix_commerce, prix_restau_extract } = feature.properties

    let placed = 0
    let attempts = 0
    const safetyCap = quota * 10
    while (placed < quota && attempts < safetyCap) {
      attempts++
      const pos = samplePointInPolygon(prng, feature)
      if (!pos) continue
      const type = pickType(prng)
      const annee = pickAnnee(prng)
      const surface = pickSurface(prng, type)
      const prix = priceForType(prng, type, prix_commerce, prix_restau_extract)
      refs.push({
        id: `ref-${String(nextId).padStart(4, "0")}`,
        lat: pos[1],
        lng: pos[0],
        arr: arrCode,
        type,
        prix_m2_an_ht_hc: prix,
        surface_estimee: surface,
        annee,
      })
      nextId++
      placed++
    }
    if (placed < quota) {
      console.warn(`[warn] ${arrCode} : ${placed}/${quota} points placés (rejection sampling saturé)`)
    }
  }

  // ── Petite couronne : 5 communes × 10 points = 50
  const POINTS_PER_COMMUNE = 10
  for (const c of PETITE_COURONNE) {
    for (let i = 0; i < POINTS_PER_COMMUNE; i++) {
      const lng = c.bbox[0] + prng() * (c.bbox[2] - c.bbox[0])
      const lat = c.bbox[1] + prng() * (c.bbox[3] - c.bbox[1])
      const type = pickType(prng)
      const annee = pickAnnee(prng)
      const surface = pickSurface(prng, type)
      const prix = priceForType(prng, type, c.prixCommerce, c.prixRestauExtract)
      refs.push({
        id: `ref-${String(nextId).padStart(4, "0")}`,
        lat: Number(lat.toFixed(6)),
        lng: Number(lng.toFixed(6)),
        arr: c.code,
        type,
        prix_m2_an_ht_hc: prix,
        surface_estimee: surface,
        annee,
      })
      nextId++
    }
  }

  // ── Écriture data/ + public/
  const dataPath = resolve(process.cwd(), "data/references-synthetic.json")
  const publicPath = resolve(process.cwd(), "public/references-synthetic.json")
  const payload = {
    meta: {
      seed: SEED,
      generatedAt: "build-time", // figé pour reproductibilité diff-friendly
      total: refs.length,
      note:
        "Dataset synthétique pour la heatmap ARGUS — pas représentatif du marché réel. Cf. SPRINTS_BACKLOG.md pour la traçabilité éthique.",
    },
    references: refs,
  }
  const json = JSON.stringify(payload, null, 2)
  writeFileSync(dataPath, json)
  writeFileSync(publicPath, json)

  // Compte total exposé en TS pour usage côté UI (mention transparence
  // brief §202) — évite d'embarquer le JSON entier dans le bundle client.
  const metaPath = resolve(process.cwd(), "lib/data/references-meta.ts")
  writeFileSync(
    metaPath,
    `// Auto-généré par scripts/generate-references-synthetic.ts. Ne pas éditer.\nexport const REFS_TOTAL = ${refs.length}\nexport const REFS_SEED = ${SEED}\n`,
  )

  console.log(`✓ ${refs.length} points générés (cible ${TOTAL_TARGET})`)
  console.log(`✓ ${dataPath}`)
  console.log(`✓ ${publicPath}`)
  console.log(`✓ ${metaPath}`)

  // Stats rapides par arrondissement
  const byArr = new Map<string, number>()
  for (const r of refs) byArr.set(r.arr, (byArr.get(r.arr) ?? 0) + 1)
  console.log("\nRépartition :")
  for (const [arr, n] of [...byArr.entries()].sort()) {
    console.log(`  ${arr} : ${n} points`)
  }
}

main()
