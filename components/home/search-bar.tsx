"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"

const TABS = [
  { id: "location", label: "Location" },
  { id: "vente", label: "Vente" },
  { id: "bureaux", label: "Bureaux" },
  { id: "tous", label: "Tous" },
] as const

const TAGS = [
  "Avec extraction",
  "Sans extraction",
  "Façade d'angle",
  "Tous commerces",
] as const

type Tab = (typeof TABS)[number]["id"]

export function SearchBar() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("location")
  const [ville, setVille] = useState("")
  const [surface, setSurface] = useState("")
  const [loyerMax, setLoyerMax] = useState("")
  const [activeTags, setActiveTags] = useState<string[]>([])

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (tab === "location") params.set("statut", "location")
    if (tab === "vente") params.set("statut", "vente")
    if (tab === "bureaux") params.set("type", "bureau")
    if (ville) params.set("q", ville)
    if (surface) params.set("surfaceMin", surface)
    if (loyerMax) params.set("loyerMax", loyerMax)
    if (activeTags.length) params.set("tags", activeTags.join(","))
    router.push(`/opportunites?${params.toString()}`)
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full rounded-3xl bg-white/95 p-6 text-ink shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-md md:p-8"
    >
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-ink/10">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "relative px-5 py-3 text-sm font-medium uppercase tracking-wider transition",
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
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <Field
          label="Ville · Arrondissement"
          value={ville}
          onChange={setVille}
          placeholder="Paris 8ᵉ · Triangle d'or"
        />
        <Field
          label="Surface min (m²)"
          value={surface}
          onChange={setSurface}
          placeholder="80"
          type="number"
        />
        <Field
          label={tab === "vente" ? "Budget max (€)" : "Loyer max (€/mois HT)"}
          value={loyerMax}
          onChange={setLoyerMax}
          placeholder={tab === "vente" ? "1 500 000" : "8 000"}
          type="number"
        />
      </div>

      {/* Tags */}
      <div className="mt-6 flex flex-wrap gap-2">
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

      {/* Submit */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-wider text-ink/50">
          Plus de 40 000 références analysées
        </p>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-medium uppercase tracking-wider text-ink transition hover:bg-gold-warm"
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
