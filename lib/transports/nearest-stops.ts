/**
 * Résolution des stations de transport les plus proches d'un point
 * donné, à partir du dataset IDFM compilé au build (voir
 * `scripts/build-idfm-stops.ts`).
 *
 * Contrat serveur uniquement :
 *  - Ce module N'EST PAS un composant client (aucun "use client"). Il
 *    est destiné à être appelé depuis les pages / Server Components,
 *    qui passent ensuite le résultat (2-3 stations) au composant map.
 *  - Le dataset complet (`data/idfm-stops.json`, ~170 KB) reste côté
 *    serveur — jamais expédié au bundle client.
 *  - Les coordonnées passées ici sont les coordonnées ARRONDIES
 *    (3 décimales, ±100 m). Aucun accès aux coords brutes.
 *
 * Architecture : implémentation « β IDFM » derrière une interface
 * source-agnostique. Un swap vers un dataset « α curated » (mini-liste
 * hardcodée) est un simple changement d'import + de structure de
 * données identique — aucun impact UI.
 */

import idfmData from "@/data/idfm-stops.json"

export type StopType = "metro" | "tram" | "rer" | "train"

export type Stop = {
  name: string
  lat: number
  lng: number
  /** Lignes desservies, triées. Ex. `["4"]`, `["A", "B"]`, `["T3a"]`. */
  lines: string[]
  type: StopType
}

export type NearbyStop = Stop & {
  /** Distance approximative en mètres. À convertir en libellé indicatif
   *  côté UI (« à proximité ») — jamais afficher la valeur brute au mètre. */
  distanceMeters: number
}

type Dataset = { stops: Stop[] }
const DATASET: Dataset = idfmData as unknown as Dataset

const EARTH_RADIUS_M = 6_371_000

/** Distance grand-cercle Haversine en mètres. */
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a))
}

/**
 * Priorité des types pour le tri secondaire (à distance égale, ordre :
 * métro > RER > tram > train). Décision produit : le métro est le repère
 * le plus « lisible » à l'échelle du quartier commercial parisien.
 */
const TYPE_PRIORITY: Record<StopType, number> = {
  metro: 0,
  rer: 1,
  tram: 2,
  train: 3,
}

export type NearestOptions = {
  /** Rayon max en mètres. Défaut : 1500 m (~15 min à pied). */
  maxDistanceMeters?: number
}

/**
 * Retourne les `k` stations les plus proches du point (lat, lng) parmi
 * le dataset compilé, dans la limite du rayon `maxDistanceMeters`. Tri
 * primaire par distance ascendante ; en cas d'égalité, par priorité de
 * type (métro d'abord).
 *
 * Renvoie `[]` si aucune station dans le rayon — le composant map
 * masquera alors la section « à proximité » proprement, plutôt que de
 * mentir sur des repères hors périmètre.
 */
export function nearestStops(
  lat: number,
  lng: number,
  k: number = 3,
  opts: NearestOptions = {},
): NearbyStop[] {
  const maxD = opts.maxDistanceMeters ?? 1500
  const enriched: NearbyStop[] = []
  for (const s of DATASET.stops) {
    const d = haversine(lat, lng, s.lat, s.lng)
    if (d > maxD) continue
    enriched.push({ ...s, distanceMeters: d })
  }
  enriched.sort((a, b) => {
    if (a.distanceMeters !== b.distanceMeters) {
      return a.distanceMeters - b.distanceMeters
    }
    return TYPE_PRIORITY[a.type] - TYPE_PRIORITY[b.type]
  })
  return enriched.slice(0, k)
}
