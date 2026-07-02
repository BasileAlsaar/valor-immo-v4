/**
 * scripts/build-idfm-stops.ts
 *
 * Génère `data/idfm-stops.json` à partir du référentiel « arrets-lignes »
 * publié par Île-de-France Mobilités (données ouvertes, licence
 * Etalab 2.0). Filtre les bus, agrège par nom de station, unifie les
 * lignes desservies.
 *
 * Usage :
 *   pnpm exec tsx scripts/build-idfm-stops.ts
 *
 * Régénérer périodiquement (rythme d'ouverture/fermeture de stations
 * IDFM ~1×/an suffit ; la maj se lit tel quel côté site).
 *
 * Attribution IDFM à afficher partout où ce dataset est consommé :
 *   « Transport : Île-de-France Mobilités — Etalab 2.0 »
 */

import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"

// Modes IDFM non-bus (l'ensemble bus fait ~72 000 arrêts, hors périmètre
// « repères contextuels à l'échelle du quartier »).
const MODES = ["Metro", "Tramway", "RapidTransit", "LocalTrain", "regionalRail"] as const

// Traduction du mode IDFM vers un type éditorial court (« M », « RER »,
// « T », « Train ») consommé côté chip UI.
const MODE_TO_TYPE: Record<(typeof MODES)[number], "metro" | "tram" | "rer" | "train"> = {
  Metro: "metro",
  Tramway: "tram",
  RapidTransit: "rer",
  LocalTrain: "train",
  regionalRail: "train",
}

type IdfmRecord = {
  stop_name: string
  stop_lat: string
  stop_lon: string
  shortname: string
  route_long_name: string
  mode: (typeof MODES)[number] | string
  nom_commune: string
}

type Stop = {
  name: string
  lat: number
  lng: number
  /** Lignes desservies (short names, ex. « 4 », « A », « T3a »). Dédupliquées, triées. */
  lines: string[]
  /** Type dominant de la station (le premier trouvé — 99 % des cas, une station est
   *  attachée à un seul mode ; les rares interconnexions RER/Métro sont représentées
   *  par 2 entrées distinctes dans le référentiel IDFM). */
  type: "metro" | "tram" | "rer" | "train"
}

const IDFM_EXPORT_URL =
  "https://data.iledefrance-mobilites.fr/api/explore/v2.1/catalog/datasets/arrets-lignes/exports/json"

function buildWhereClause() {
  return MODES.map((m) => `mode = "${m}"`).join(" OR ")
}

async function fetchRecords(): Promise<IdfmRecord[]> {
  const url = `${IDFM_EXPORT_URL}?where=${encodeURIComponent(buildWhereClause())}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`IDFM fetch failed: ${res.status}`)
  return (await res.json()) as IdfmRecord[]
}

function aggregate(records: IdfmRecord[]): Stop[] {
  const byName = new Map<
    string,
    { name: string; lat: number; lng: number; lines: Set<string>; type: Stop["type"] }
  >()

  for (const r of records) {
    const mode = MODES.includes(r.mode as (typeof MODES)[number])
      ? (r.mode as (typeof MODES)[number])
      : null
    if (!mode) continue
    const lat = Number(r.stop_lat)
    const lng = Number(r.stop_lon)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue
    const line = (r.shortname ?? r.route_long_name ?? "").trim()
    if (!line) continue
    const key = `${r.stop_name}::${mode}`
    const entry = byName.get(key) ?? {
      name: r.stop_name,
      lat,
      lng,
      lines: new Set<string>(),
      type: MODE_TO_TYPE[mode],
    }
    entry.lines.add(line)
    byName.set(key, entry)
  }

  const stops: Stop[] = []
  for (const e of byName.values()) {
    stops.push({
      name: e.name,
      lat: Math.round(e.lat * 1e5) / 1e5, // 5 décimales ≈ 1 m — suffisant
      lng: Math.round(e.lng * 1e5) / 1e5,
      lines: Array.from(e.lines).sort((a, b) => a.localeCompare(b, "fr", { numeric: true })),
      type: e.type,
    })
  }

  // Tri stable : nom asc pour faciliter les diffs de régénération.
  stops.sort((a, b) => a.name.localeCompare(b.name, "fr"))
  return stops
}

async function main() {
  console.info("Fetching IDFM referentiel arrets-lignes (non-Bus)…")
  const records = await fetchRecords()
  console.info(`  → ${records.length} entrées brutes`)

  const stops = aggregate(records)
  console.info(`  → ${stops.length} stations uniques après agrégation`)

  const byType = stops.reduce<Record<string, number>>((acc, s) => {
    acc[s.type] = (acc[s.type] ?? 0) + 1
    return acc
  }, {})
  console.info(`  → répartition: ${JSON.stringify(byType)}`)

  const output = {
    _meta: {
      source: "Île-de-France Mobilités — arrets-lignes (Etalab 2.0)",
      generated_at: new Date().toISOString(),
      total: stops.length,
      by_type: byType,
    },
    stops,
  }

  const dest = resolve(process.cwd(), "data/idfm-stops.json")
  mkdirSync(dirname(dest), { recursive: true })
  writeFileSync(dest, JSON.stringify(output, null, 2))
  console.info(`  → écrit dans ${dest}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
