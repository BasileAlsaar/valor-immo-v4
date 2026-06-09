"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { ZoneCombobox, type ZoneSelection } from "@/components/ui/zone-combobox"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*                                  Options                                   */
/* -------------------------------------------------------------------------- */

const TABS = [
  { id: "location-pure", label: "Location pure" },
  { id: "achat", label: "Achat" },
  { id: "vente", label: "Vente" },
  { id: "fonds-commerce", label: "Fonds de commerce" },
  { id: "bureaux", label: "Bureaux" },
  { id: "tous", label: "Tous" },
] as const

type Tab = (typeof TABS)[number]["id"]

/**
 * Sous-puces : conservent les 4 raffinements CHR/commerce d'origine
 * (Restaurant avec/sans extraction, Façade d'angle, Tous commerces) +
 * 3 typologies additionnelles (Hôtellerie, Immeubles, Logistique).
 * Cachées si tab=bureaux (la typologie est déjà fixée par l'onglet).
 */
const TAGS = [
  "Restaurant avec extraction",
  "Restaurant sans extraction",
  "Façade d'angle",
  "Tous commerces",
  "Hôtellerie",
  "Immeubles",
  "Logistique",
] as const

const CHR_TAGS: string[] = [
  "Restaurant avec extraction",
  "Restaurant sans extraction",
  "Façade d'angle",
  "Tous commerces",
]

/** Précédence chip → typologie (la plus spécifique gagne en cas de combo). */
function resolveChipTypologie(activeTags: string[]): string | null {
  if (activeTags.includes("Logistique")) return "entrepots-logistique"
  if (activeTags.includes("Immeubles")) return "immeubles"
  if (activeTags.includes("Hôtellerie")) return "hotellerie"
  if (CHR_TAGS.some((t) => activeTags.includes(t))) return "locaux-commerciaux"
  return null
}

/** Mapping onglet → param `transaction` consommé par /opportunites. */
function resolveTabTransaction(tab: Tab): string | null {
  if (tab === "location-pure") return "location"
  if (tab === "achat" || tab === "vente") return "vente"
  return null
}

/** Mapping onglet → param `typologie` consommé par /opportunites. */
function resolveTabTypologie(tab: Tab): string | null {
  if (tab === "fonds-commerce") return "cession-droit-au-bail"
  if (tab === "bureaux") return "bureaux"
  return null
}

/* -------------------------------------------------------------------------- */
/*                                Composant                                   */
/* -------------------------------------------------------------------------- */

export function SearchBar() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("location-pure")
  const [ville, setVille] = useState("")
  const [arrondissement, setArrondissement] = useState<number | null>(null)
  const [surface, setSurface] = useState("")
  const [loyerMax, setLoyerMax] = useState("")
  const [activeTags, setActiveTags] = useState<string[]>([])

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  function onZoneSelect(sel: ZoneSelection) {
    setArrondissement(sel.arrondissement)
  }

  function onVilleChange(v: string) {
    setVille(v)
    // Saisie manuelle → on invalide la résolution précédente.
    if (arrondissement !== null) setArrondissement(null)
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()

    const tx = resolveTabTransaction(tab)
    if (tx) params.set("transaction", tx)

    // Typologie : la chip override l'onglet si elle en résout une.
    const chipTypo = resolveChipTypologie(activeTags)
    const typo = chipTypo ?? resolveTabTypologie(tab)
    if (typo) params.set("typologie", typo)

    if (arrondissement) params.set("arrondissement", String(arrondissement))
    if (ville) params.set("q", ville)
    if (surface) params.set("surfaceMin", surface)
    if (loyerMax) params.set("loyerMax", loyerMax)
    if (activeTags.length) params.set("tags", activeTags.join(","))

    const qs = params.toString()
    router.push(qs ? `/opportunites?${qs}` : "/opportunites")
  }

  const isVenteLike = tab === "vente" || tab === "achat" || tab === "fonds-commerce"

  return (
    <form
      onSubmit={onSubmit}
      className="w-full rounded-3xl bg-white/95 p-5 text-ink shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-md md:p-6"
    >
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-ink/10">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTab(t.id)
              if (t.id === "bureaux") setActiveTags([])
            }}
            className={cn(
              "relative px-5 py-2.5 text-sm font-medium uppercase tracking-wider transition",
              tab === t.id ? "text-ink" : "text-ink/50 hover:text-ink",
            )}
          >
            {t.label}
            {tab === t.id && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 bg-gold" />
            )}
          </button>
        ))}
      </div>

      {/* Champs */}
      <div className="mt-4 grid gap-5 md:grid-cols-3">
        <ZoneCombobox
          label="Ville · Arrondissement"
          placeholder="Paris 8ᵉ · ville ou arrondissement"
          value={ville}
          onChange={onVilleChange}
          onSelect={onZoneSelect}
          type="municipality"
        />
        <Field
          label="Surface min (m²)"
          value={surface}
          onChange={setSurface}
          placeholder="80"
          type="number"
        />
        <Field
          label={isVenteLike ? "Budget max (€)" : "Loyer max (€/mois HT)"}
          value={loyerMax}
          onChange={setLoyerMax}
          placeholder={isVenteLike ? "1 500 000" : "8 000"}
          type="number"
        />
      </div>

      {/* Sous-puces — masquées si tab=bureaux (typologie déjà fixée). */}
      {tab !== "bureaux" && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {TAGS.map((tag) => {
            const on = activeTags.includes(tag)
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wider transition",
                  on
                    ? "border-gold bg-gold text-ink"
                    : "border-ink/15 text-ink/70 hover:border-ink/40 hover:text-ink",
                )}
              >
                {tag}
              </button>
            )
          })}
        </div>
      )}

      {/* Submit */}
      <div className="mt-4 flex flex-wrap items-center justify-end gap-4">
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

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <label className="block">
      <span className="eyebrow text-ink/60">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full border-0 border-b-2 border-ink/15 bg-transparent px-0 pb-2 text-base text-ink placeholder:text-ink/30 focus:border-gold focus:outline-none focus:ring-0"
      />
    </label>
  )
}
