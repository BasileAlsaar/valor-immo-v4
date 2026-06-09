"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { FilterChip } from "@/components/ui/filter-chip"
import { ZoneCombobox, type ZoneSelection } from "@/components/ui/zone-combobox"

/* -------------------------------------------------------------------------- */
/*                         Définitions des options                            */
/* -------------------------------------------------------------------------- */

/**
 * Transaction — alignée sur le contrat /opportunites (qui lit `transaction`
 * = "location" | "vente"). "Achat" est un synonyme côté visiteur acquéreur,
 * émet `transaction=vente`. "Fonds de commerce" mappe à la typologie
 * `cession-droit-au-bail` côté catalogue, donc émet `typologie=` sans
 * `transaction=`.
 */
const TRANSACTIONS = [
  { id: "location-pure", label: "Location pure" },
  { id: "achat", label: "Achat" },
  { id: "vente", label: "Vente" },
  { id: "fonds-commerce", label: "Fonds de commerce" },
] as const
type TransactionId = (typeof TRANSACTIONS)[number]["id"]

/**
 * Typologie — alignée sur les slugs CATEGORIES (lib/data/categories.ts) lus
 * par /opportunites. "Restau. avec/sans extraction" sont 2 vues éditoriales
 * de la même typologie back-end `locaux-commerciaux` (le sous-filtre
 * extraction n'existe pas côté Property — promesse UI honorée par la
 * navigation, pas par un filtre dur).
 */
const TYPOLOGIES = [
  { id: "locaux-commerciaux", label: "Locaux commerciaux" },
  { id: "restau-avec-extraction", label: "Restau. avec extraction" },
  { id: "restau-sans-extraction", label: "Restau. sans extraction" },
  { id: "bureaux", label: "Bureaux" },
  { id: "hotellerie", label: "Hôtellerie" },
  { id: "immeubles", label: "Immeubles" },
  { id: "entrepots-logistique", label: "Logistique" },
] as const
type TypologieId = (typeof TYPOLOGIES)[number]["id"]

/** Mapping UI → param URL `transaction=` consommé par /opportunites. */
function resolveTransactionParam(id: TransactionId | null): string | null {
  if (id === "location-pure") return "location"
  if (id === "achat" || id === "vente") return "vente"
  return null
}

/** Mapping UI → param URL `typologie=` (slug CATEGORIES). */
function resolveTypologieParam(
  txId: TransactionId | null,
  typoId: TypologieId | null,
): string | null {
  if (txId === "fonds-commerce") return "cession-droit-au-bail"
  if (!typoId) return null
  if (typoId === "restau-avec-extraction" || typoId === "restau-sans-extraction") {
    return "locaux-commerciaux"
  }
  return typoId
}

/* -------------------------------------------------------------------------- */
/*                                Composant                                   */
/* -------------------------------------------------------------------------- */

export function SearchBar() {
  const router = useRouter()
  const [tx, setTx] = useState<TransactionId | null>("location-pure")
  const [typo, setTypo] = useState<TypologieId | null>(null)
  const [ville, setVille] = useState("")
  const [arrondissement, setArrondissement] = useState<number | null>(null)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    const txParam = resolveTransactionParam(tx)
    const typoParam = resolveTypologieParam(tx, typo)
    if (txParam) params.set("transaction", txParam)
    if (typoParam) params.set("typologie", typoParam)
    if (arrondissement) params.set("arrondissement", String(arrondissement))
    const qs = params.toString()
    router.push(qs ? `/opportunites?${qs}` : "/opportunites")
  }

  function onZoneSelect(sel: ZoneSelection) {
    setArrondissement(sel.arrondissement)
  }

  function onVilleChange(v: string) {
    setVille(v)
    // L'utilisateur retape : on invalide l'arrondissement précédemment résolu.
    if (arrondissement !== null) setArrondissement(null)
  }

  function toggleTx(id: TransactionId) {
    setTx((prev) => (prev === id ? null : id))
  }
  function toggleTypo(id: TypologieId) {
    setTypo((prev) => (prev === id ? null : id))
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full rounded-3xl bg-white/95 p-5 text-ink shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-md md:p-6"
    >
      {/* Transaction */}
      <div>
        <span className="eyebrow text-ink/55">Type de transaction</span>
        <div className="mt-3 flex flex-wrap gap-2">
          {TRANSACTIONS.map((t) => (
            <FilterChip
              key={t.id}
              label={t.label}
              active={tx === t.id}
              onClick={() => toggleTx(t.id)}
            />
          ))}
        </div>
      </div>

      {/* Typologie */}
      <div className="mt-5">
        <span className="eyebrow text-ink/55">Type d&apos;actif</span>
        <div className="mt-3 flex flex-wrap gap-2">
          {TYPOLOGIES.map((t) => (
            <FilterChip
              key={t.id}
              label={t.label}
              active={typo === t.id}
              onClick={() => toggleTypo(t.id)}
            />
          ))}
        </div>
      </div>

      {/* Localisation BAN */}
      <div className="mt-5">
        <ZoneCombobox
          value={ville}
          onChange={onVilleChange}
          onSelect={onZoneSelect}
        />
      </div>

      {/* Submit */}
      <div className="mt-5 flex flex-wrap items-center justify-end gap-4">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3 text-sm font-medium uppercase tracking-wider text-ink transition hover:bg-gold-warm"
        >
          <Search className="h-4 w-4" /> Rechercher
        </button>
      </div>
    </form>
  )
}
