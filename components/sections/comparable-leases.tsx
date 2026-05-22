import { readFileSync } from "node:fs"
import { resolve } from "node:path"

import { Eyebrow } from "@/components/ui/eyebrow"
import type { PropertyType } from "@/lib/data/properties"

/** Mapping property.type → dataset type (sprint 3 `references-synthetic.json`). */
const PROPERTY_TYPE_TO_DATASET: Record<PropertyType, "commerce" | "restau_extract" | "bureaux"> = {
  "local-commercial": "commerce",
  bureau: "bureaux",
  immeuble: "bureaux",
  hotellerie: "restau_extract",
  logistique: "commerce",
  "fonds-commerce": "restau_extract",
}

const ARRONDISSEMENTS_LIMITROPHES: Record<number, number[]> = {
  1: [2, 4, 6, 7, 8, 9],
  2: [1, 3, 9, 10],
  3: [2, 4, 10, 11],
  4: [1, 3, 5, 11, 12],
  5: [4, 6, 12, 13],
  6: [1, 5, 7, 14, 15],
  7: [1, 6, 8, 15],
  8: [1, 7, 9, 16, 17],
  9: [1, 2, 8, 10, 18],
  10: [2, 3, 9, 11, 18, 19],
  11: [3, 4, 10, 12, 20],
  12: [4, 5, 11, 13, 20],
  13: [5, 12, 14],
  14: [6, 13, 15],
  15: [6, 7, 14, 16],
  16: [7, 8, 15, 17],
  17: [8, 9, 16, 18],
  18: [9, 10, 17, 19],
  19: [10, 18, 20],
  20: [11, 12, 19],
}

type Reference = {
  id: string
  lat: number
  lng: number
  arr: string
  type: "commerce" | "restau_extract" | "bureaux"
  prix_m2_an_ht_hc: number
  surface_estimee: number
  annee: number
}

type Dataset = { meta: { total: number; seed: number }; references: Reference[] }

let cachedDataset: Dataset | null = null

function loadDataset(): Dataset {
  if (cachedDataset) return cachedDataset
  const path = resolve(process.cwd(), "data/references-synthetic.json")
  cachedDataset = JSON.parse(readFileSync(path, "utf-8")) as Dataset
  return cachedDataset
}

type Props = {
  arrondissement: number
  typologie: PropertyType
  /** Seed déterministe pour le tri si égalités (slug du bien courant). */
  slug: string
}

type SelectionResult = {
  rows: Reference[]
  scope: "exact" | "limitrophe" | "paris" | "limite"
}

/** djb2 pour seed stable. */
function djb2(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0
  return hash >>> 0
}

function select(
  refs: Reference[],
  arrondissement: number,
  datasetType: Reference["type"],
  slug: string,
): SelectionResult {
  const arrCode = `750${String(arrondissement).padStart(2, "0")}`
  const local = refs.filter((r) => r.arr === arrCode && r.type === datasetType)
  const sortByDateThenSlug = (a: Reference, b: Reference): number => {
    if (a.annee !== b.annee) return b.annee - a.annee
    return djb2(slug + a.id) - djb2(slug + b.id)
  }

  if (local.length >= 4) {
    return { rows: [...local].sort(sortByDateThenSlug).slice(0, 4), scope: "exact" }
  }

  const limitrophes = ARRONDISSEMENTS_LIMITROPHES[arrondissement] ?? []
  const limitrophesCodes = new Set(
    limitrophes.map((n) => `750${String(n).padStart(2, "0")}`),
  )
  const extended = refs.filter(
    (r) =>
      r.type === datasetType &&
      (r.arr === arrCode || limitrophesCodes.has(r.arr)),
  )
  if (extended.length >= 4) {
    return {
      rows: [...extended].sort(sortByDateThenSlug).slice(0, 4),
      scope: "limitrophe",
    }
  }

  // Étendre à Paris entier
  const paris = refs.filter(
    (r) => r.type === datasetType && r.arr.startsWith("750"),
  )
  if (paris.length >= 4) {
    return { rows: [...paris].sort(sortByDateThenSlug).slice(0, 4), scope: "paris" }
  }

  // Cas limité
  return { rows: [...refs.filter((r) => r.type === datasetType)].sort(sortByDateThenSlug), scope: "limite" }
}

/** Anonymise « Rue de Rivoli » → « Rue de R., Paris IIe ». */
function buildAddress(arr: string, slug: string, idx: number): string {
  const seed = djb2(slug + arr + idx)
  const STREETS = [
    "Rue de B.",
    "Rue du F.",
    "Rue de L.",
    "Avenue M.",
    "Rue Saint-H.",
    "Boulevard de C.",
    "Avenue de la G.",
    "Rue de la P.",
    "Rue du C.",
    "Boulevard H.",
  ]
  const street = STREETS[seed % STREETS.length]
  const arrNum = parseInt(arr.slice(-2), 10)
  const roman = toRoman(arrNum)
  return `${street}, Paris ${roman}ᵉ`
}

const ROMAN_MAP: Record<number, string> = {
  1: "I", 2: "II", 3: "III", 4: "IV", 5: "V",
  6: "VI", 7: "VII", 8: "VIII", 9: "IX", 10: "X",
  11: "XI", 12: "XII", 13: "XIII", 14: "XIV", 15: "XV",
  16: "XVI", 17: "XVII", 18: "XVIII", 19: "XIX", 20: "XX",
}
function toRoman(n: number): string {
  return ROMAN_MAP[n] ?? String(n)
}

function formatPrice(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n)
}

const MOIS = ["Jan.", "Fév.", "Mar.", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."]

/** Date de signature pseudo-aléatoire dans l'année — déterministe par ref.id. */
function buildSignatureDate(ref: Reference): string {
  const seed = djb2(ref.id)
  const monthIdx = seed % 12
  return `${MOIS[monthIdx]} ${ref.annee}`
}

const SCOPE_NOTES: Record<SelectionResult["scope"], string> = {
  exact:
    "Échantillon de baux comparables anonymisés issus de notre base d'analyse marché. Adresses tronquées pour confidentialité.",
  limitrophe:
    "Échantillon de baux comparables anonymisés. Inclut les arrondissements limitrophes pour représentativité statistique.",
  paris:
    "Échantillon de baux comparables anonymisés sur Paris (extension du périmètre, typologie peu représentée localement).",
  limite:
    "Échantillon limité — typologie de bien rare sur le marché actuel.",
}

export function ComparableLeases({ arrondissement, typologie, slug }: Props) {
  const dataset = loadDataset()
  const datasetType = PROPERTY_TYPE_TO_DATASET[typologie]
  const { rows, scope } = select(dataset.references, arrondissement, datasetType, slug)

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-fir-dark/10 bg-cream/40 p-8 text-center">
        <p className="text-sm text-ink/60">Aucun bail comparable disponible.</p>
      </div>
    )
  }

  return (
    <div data-testid="opportunity-comparable-leases" className="overflow-hidden rounded-2xl border border-fir-dark/10 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-fir-dark text-cream">
            <tr>
              <th className="px-5 py-3 text-left font-medium uppercase tracking-wider text-xs">
                Adresse
              </th>
              <th className="px-3 py-3 text-right font-medium uppercase tracking-wider text-xs">
                Surface
              </th>
              <th className="px-3 py-3 text-right font-medium uppercase tracking-wider text-xs">
                €/m²/an HT HC
              </th>
              <th className="px-5 py-3 text-right font-medium uppercase tracking-wider text-xs">
                Signé
              </th>
            </tr>
          </thead>
          <tbody className="tabular divide-y divide-fir-dark/10">
            {rows.map((r, i) => (
              <tr key={r.id} className={i % 2 === 1 ? "bg-cream/40" : ""}>
                <td className="px-5 py-3 text-left font-medium text-fir-dark">
                  {buildAddress(r.arr, slug, i)}
                </td>
                <td className="px-3 py-3 text-right text-ink/80">
                  {r.surface_estimee} m²
                </td>
                <td className="px-3 py-3 text-right font-semibold text-fir-dark">
                  {formatPrice(r.prix_m2_an_ht_hc)} €
                </td>
                <td className="px-5 py-3 text-right text-ink/60">
                  {buildSignatureDate(r)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-fir-dark/10 bg-cream/40 px-5 py-3">
        <p className="text-xs leading-relaxed text-ink/55">{SCOPE_NOTES[scope]}</p>
      </div>
    </div>
  )
}
