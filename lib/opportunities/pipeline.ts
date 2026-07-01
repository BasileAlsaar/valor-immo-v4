/**
 * Pipeline serveur mutualisé pour les pages listing consommant Apimo
 * (/opportunites, /location, /vente). Regroupe les helpers de filtrage
 * qui étaient dupliqués côté pages.
 */

import type { DisplayProperty } from "@/lib/apimo/to-display"
import type { FilterParams } from "@/lib/filters/opportunities"
import { getDepartement } from "@/lib/data/departements"

/**
 * Facteurs de conversion vers un loyer mensuel selon le label de période
 * Apimo (culture=fr). Utilisé UNIQUEMENT pour normaliser `loyerMax`
 * (comparaison strictement mensuelle). L'affichage prix conserve la
 * valeur brute et la période brute.
 */
const PERIOD_TO_MONTHLY_FACTOR: Record<string, number> = {
  jour: 30,
  semaine: 52 / 12,
  quinzaine: 26 / 12,
  mois: 1,
  bimensuel: 0.5,
  trimestre: 1 / 3,
  semestre: 1 / 6,
  an: 1 / 12,
}

function monthlyEquivalent(
  loyer: number | undefined,
  period: string | undefined,
): number | undefined {
  if (loyer == null) return undefined
  if (!period) return loyer
  const factor = PERIOD_TO_MONTHLY_FACTOR[period.toLowerCase()]
  return factor == null ? loyer : loyer * factor
}

function priceForCap(p: DisplayProperty): number | undefined {
  if (p.statut === "location") {
    return monthlyEquivalent(p.loyerMensuel, p.period)
  }
  return p.prix
}

export function applyFilters(
  list: DisplayProperty[],
  f: FilterParams,
): DisplayProperty[] {
  return list.filter((p) => {
    if (f.typologie.length > 0) {
      if (!p.categories.some((c) => f.typologie.includes(c))) return false
    }
    if (f.transaction.length > 0) {
      const isLoc = f.transaction.includes("location") && p.statut === "location"
      const isVente =
        f.transaction.includes("vente") &&
        (p.statut === "vente" || p.statut === "murs-libres")
      if (!isLoc && !isVente) return false
    }
    if (f.commune.length > 0) {
      const villeLower = p.ville.toLowerCase()
      if (!f.commune.some((c) => c.toLowerCase() === villeLower)) return false
    }
    if (f.arrondissement.length > 0) {
      if (p.arrondissement == null) return false
      if (!f.arrondissement.includes(p.arrondissement)) return false
    }
    if (f.codePostal !== undefined && p.codePostal !== f.codePostal) return false
    if (f.departement !== undefined) {
      if (p.codePostal.slice(0, f.departement.length) !== f.departement) return false
    }
    if (
      f.q !== undefined &&
      f.commune.length === 0 &&
      f.arrondissement.length === 0 &&
      f.codePostal === undefined &&
      f.departement === undefined
    ) {
      const needle = f.q.toLowerCase()
      const matches =
        p.ville.toLowerCase().includes(needle) ||
        p.quartier.toLowerCase().includes(needle)
      if (!matches) return false
    }
    if (f.surfaceMin !== undefined && p.surface < f.surfaceMin) return false
    if (f.loyerMax !== undefined) {
      const cap = priceForCap(p)
      if (cap === undefined || cap > f.loyerMax) return false
    }
    return true
  })
}

/**
 * Tri des communes pour le chip UI :
 *   1. Paris intra-muros (Paris 1ᵉʳ → Paris 20ᵉ) triés par arrondissement,
 *   2. Autres communes, ordre alphabétique.
 */
export function sortCommunes(names: string[]): string[] {
  const parisRe = /^Paris\s+(\d+)/i
  return names.slice().sort((a, b) => {
    const ma = a.match(parisRe)
    const mb = b.match(parisRe)
    if (ma && mb) return parseInt(ma[1], 10) - parseInt(mb[1], 10)
    if (ma) return -1
    if (mb) return 1
    return a.localeCompare(b, "fr")
  })
}

function ordinalArrondissement(n: number): string {
  return n === 1 ? "1ᵉʳ" : `${n}ᵉ`
}

/**
 * Libellé de zone pour l'EmptyState contextualisé. Précédence : commune
 * (chip UI) > arrondissement (SearchBar) > codePostal > departement > q.
 */
export function buildZoneLabel(f: FilterParams): string | null {
  if (f.commune.length === 1) return `à ${f.commune[0]}`
  if (f.arrondissement.length === 1) {
    return `dans le ${ordinalArrondissement(f.arrondissement[0])} arrondissement`
  }
  if (f.codePostal) return `sur ce secteur (${f.codePostal})`
  if (f.departement) {
    const nom = getDepartement(f.departement)
    if (nom) return `en ${nom}`
  }
  if (f.q) return `à ${f.q}`
  return null
}
