"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { MapPin, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Combobox d'autocomplete adresse / arrondissement adossé à la Base Adresse
 * Nationale (api-adresse.data.gouv.fr) — gratuit, sans clé, sans facturation.
 * Debounced 250 ms, max 5 suggestions, focus Paris (autocomplete=1).
 *
 * À la sélection : remonte au parent via `onSelect({ label, postcode,
 * arrondissement })`. L'arrondissement est extrait du code postal 750XX si
 * applicable, sinon `null` (utile pour filtrer côté /opportunites).
 */

type BanFeature = {
  properties: {
    label: string
    postcode?: string
    city?: string
    citycode?: string
    type?: string
  }
}

export type ZoneSelection = {
  label: string
  postcode: string | null
  /** Arrondissement parisien 1..20 si applicable, sinon null. */
  arrondissement: number | null
}

type Props = {
  value: string
  onChange: (value: string) => void
  onSelect: (selection: ZoneSelection) => void
  placeholder?: string
  label?: string
  /**
   * Restreint la requête BAN à un type de résultat (municipality = villes
   * + arrondissements ; street = rues ; housenumber = numéro précis).
   * Si omis, tous les types sont retournés.
   */
  type?: "housenumber" | "street" | "locality" | "municipality"
}

function extractArrondissement(postcode?: string): number | null {
  if (!postcode) return null
  const m = /^750(\d{2})$/.exec(postcode)
  if (!m) return null
  const n = parseInt(m[1], 10)
  return n >= 1 && n <= 20 ? n : null
}

export function ZoneCombobox({
  value,
  onChange,
  onSelect,
  placeholder = "Paris 8ᵉ · adresse ou arrondissement",
  label = "Localisation",
  type,
}: Props) {
  const id = useId()
  const listboxId = `${id}-listbox`
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<BanFeature[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setSuggestions([])
      return
    }
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    setLoading(true)
    try {
      const typeParam = type ? `&type=${type}` : ""
      const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=5&autocomplete=1${typeParam}`
      const res = await fetch(url, { signal: ctrl.signal })
      if (!res.ok) throw new Error(`BAN ${res.status}`)
      const data = (await res.json()) as { features: BanFeature[] }
      setSuggestions(data.features ?? [])
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setSuggestions([])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounce 250 ms — re-fetch si le `type` change aussi.
  useEffect(() => {
    const handle = window.setTimeout(() => {
      void fetchSuggestions(value)
    }, 250)
    return () => window.clearTimeout(handle)
  }, [value, fetchSuggestions, type])

  // Click outside → close
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  function commitSelection(idx: number) {
    const feat = suggestions[idx]
    if (!feat) return
    const sel: ZoneSelection = {
      label: feat.properties.label,
      postcode: feat.properties.postcode ?? null,
      arrondissement: extractArrondissement(feat.properties.postcode),
    }
    onChange(sel.label)
    onSelect(sel)
    setOpen(false)
    setActiveIndex(-1)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setOpen(true)
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      if (open && activeIndex >= 0) {
        e.preventDefault()
        commitSelection(activeIndex)
      }
    } else if (e.key === "Escape") {
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={id} className="eyebrow text-ink/60">
        {label}
      </label>
      <div className="relative mt-2">
        <MapPin
          aria-hidden
          className="pointer-events-none absolute left-0 bottom-2 h-4 w-4 text-ink/40"
        />
        <input
          ref={inputRef}
          id={id}
          type="text"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setOpen(true)
            setActiveIndex(-1)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `${id}-opt-${activeIndex}` : undefined
          }
          className="w-full border-0 border-b-2 border-ink/15 bg-transparent pb-2 pl-6 pr-8 text-base text-ink placeholder:text-ink/30 focus:border-gold focus:outline-none focus:ring-0"
        />
        {loading && (
          <Loader2
            aria-hidden
            className="pointer-events-none absolute right-0 bottom-2 h-4 w-4 animate-spin text-ink/40"
          />
        )}
      </div>
      {open && suggestions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-fir-dark/10 bg-white shadow-[0_24px_60px_-24px_rgba(10,45,34,0.25)]"
        >
          {suggestions.map((f, i) => {
            const active = i === activeIndex
            return (
              <li
                key={`${f.properties.label}-${i}`}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={active}
                onMouseDown={(e) => {
                  e.preventDefault()
                  commitSelection(i)
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className={cn(
                  "cursor-pointer px-4 py-3 text-sm transition-colors",
                  active ? "bg-cream text-fir-dark" : "text-ink/85 hover:bg-cream/60",
                )}
              >
                <div className="font-medium">{f.properties.label}</div>
                {f.properties.city && f.properties.postcode && (
                  <div className="text-xs text-ink/55">
                    {f.properties.postcode} · {f.properties.city}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
