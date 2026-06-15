"use client"

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { MapPin, Loader2 } from "lucide-react"

import {
  PARIS_AUTOCOMPLETE,
  matchesParisQuery,
} from "@/lib/data/paris-arrondissements"
import { getDepartement } from "@/lib/data/departements"
import { cn } from "@/lib/utils"

/**
 * Combobox d'autocomplete adresse / arrondissement adossé à la Base Adresse
 * Nationale (api-adresse.data.gouv.fr) — gratuit, sans clé, sans facturation.
 *
 * Comportements clés :
 *   - Saisie ≥ 2 caractères → fetch BAN debounced 250 ms (AbortController).
 *   - Si la saisie matche "Paris" → fallback liste locale ordonnée
 *     ("Paris" entière puis Paris 1ᵉʳ → 20ᵉ).
 *   - Dropdown portalé sur document.body en position fixed pour
 *     échapper à tout parent en overflow-hidden / transform (z-index ≥ 70).
 *   - max-h-72 + overflow-y-auto, scroll-into-view sur navigation clavier.
 *   - À la sélection : remonte au parent via `onSelect({ label, postcode,
 *     arrondissement })`. L'arrondissement parisien est extrait du code
 *     postal 750XX si applicable.
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
  /** Code postal à pousser dans l'URL (CP non-Paris uniquement). */
  codePostal: string | null
  /** Code département 2 ou 3 chars (Corse 2A/2B exclu côté détection num). */
  departement: string | null
}

type UnifiedSuggestion = {
  key: string
  primary: string
  secondary: string | null
  selection: ZoneSelection
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

function extractArrondissement(postcode?: string | null): number | null {
  if (!postcode) return null
  const m = /^750(\d{2})$/.exec(postcode)
  if (!m) return null
  const n = parseInt(m[1], 10)
  return n >= 1 && n <= 20 ? n : null
}

function banToUnified(f: BanFeature, idx: number): UnifiedSuggestion {
  const postcode = f.properties.postcode ?? null
  const secondary =
    f.properties.city && f.properties.postcode
      ? `${f.properties.postcode} · ${f.properties.city}`
      : null
  const arrondissement = extractArrondissement(postcode)
  return {
    key: `ban-${f.properties.label}-${idx}`,
    primary: f.properties.label,
    secondary,
    selection: {
      label: f.properties.label,
      postcode,
      arrondissement,
      // Si la BAN a renvoyé un arrondissement parisien, on filtre par arr
      // (cohérent avec PARIS_AUTOCOMPLETE) — sinon on pousse le codePostal.
      codePostal: arrondissement !== null ? null : postcode,
      departement: null,
    },
  }
}

function parisToUnified(): UnifiedSuggestion[] {
  return PARIS_AUTOCOMPLETE.map((item, idx) => ({
    key: `paris-${idx}`,
    primary: item.label,
    secondary: item.postcode ? `${item.postcode} · Paris` : null,
    selection: {
      label: item.label,
      postcode: item.postcode,
      arrondissement: item.arrondissement,
      codePostal: null,
      departement: null,
    },
  }))
}

function departementToUnified(code: string, nom: string): UnifiedSuggestion {
  return {
    key: `dep-${code}`,
    primary: `${nom} (${code})`,
    secondary: "Département",
    selection: {
      label: `${nom} (${code})`,
      postcode: null,
      arrondissement: null,
      codePostal: null,
      departement: code,
    },
  }
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
  const [suggestions, setSuggestions] = useState<UnifiedSuggestion[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const [rect, setRect] = useState<{
    top: number
    left: number
    width: number
  } | null>(null)
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchSuggestions = useCallback(
    async (q: string) => {
      const trimmed = q.trim()
      if (trimmed.length < 2) {
        setSuggestions([])
        return
      }
      // Court-circuit Paris : liste locale ordonnée, pas d'appel BAN.
      if (matchesParisQuery(trimmed)) {
        abortRef.current?.abort()
        setLoading(false)
        setSuggestions(parisToUnified())
        return
      }
      // CP 5 chiffres parisien (750XX) : suggestion arrondissement locale.
      // CP non-Paris : on laisse passer au fetch BAN générique qui résoudra
      // la commune via q=CP (le mapping codePostal est fait par banToUnified).
      if (/^\d{5}$/.test(trimmed) && /^750\d{2}$/.test(trimmed)) {
        const parisItem = PARIS_AUTOCOMPLETE.find((p) => p.postcode === trimmed)
        if (parisItem) {
          abortRef.current?.abort()
          setLoading(false)
          setSuggestions([
            {
              key: `cp-${trimmed}`,
              primary: parisItem.label,
              secondary: `${trimmed} · Paris`,
              selection: {
                label: parisItem.label,
                postcode: parisItem.postcode,
                arrondissement: parisItem.arrondissement,
                codePostal: null,
                departement: null,
              },
            },
          ])
          return
        }
      }
      // Département 2 ou 3 chiffres : table locale. Si code inconnu, on laisse
      // passer au BAN (qui ne trouvera probablement rien d'utile, mais on
      // n'invente pas de suggestion).
      if (/^\d{2}$|^\d{3}$/.test(trimmed)) {
        const nom = getDepartement(trimmed)
        if (nom) {
          abortRef.current?.abort()
          setLoading(false)
          setSuggestions([departementToUnified(trimmed, nom)])
          return
        }
      }
      abortRef.current?.abort()
      const ctrl = new AbortController()
      abortRef.current = ctrl
      setLoading(true)
      try {
        const typeParam = type ? `&type=${type}` : ""
        const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(trimmed)}&limit=5&autocomplete=1${typeParam}`
        const res = await fetch(url, { signal: ctrl.signal })
        if (!res.ok) throw new Error(`BAN ${res.status}`)
        const data = (await res.json()) as { features: BanFeature[] }
        setSuggestions((data.features ?? []).map(banToUnified))
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setSuggestions([])
        }
      } finally {
        setLoading(false)
      }
    },
    [type],
  )

  // Debounce 250 ms.
  useEffect(() => {
    const handle = window.setTimeout(() => {
      void fetchSuggestions(value)
    }, 250)
    return () => window.clearTimeout(handle)
  }, [value, fetchSuggestions])

  // Click outside → close. Détecte aussi les clics sur le dropdown portalé
  // via la liste ref.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node
      if (containerRef.current?.contains(t)) return
      if (listRef.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  // Position du dropdown : suit l'input via scroll + resize. position fixed,
  // donc on lit getBoundingClientRect (coords viewport) sans ajouter scrollY.
  useLayoutEffect(() => {
    if (!open) return
    function update() {
      const el = containerRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      setRect({ top: r.bottom + 8, left: r.left, width: r.width })
    }
    update()
    window.addEventListener("scroll", update, true)
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update, true)
      window.removeEventListener("resize", update)
    }
  }, [open, suggestions.length])

  // Scroll-into-view sur navigation clavier.
  useEffect(() => {
    if (!open || activeIndex < 0) return
    const el = document.getElementById(`${id}-opt-${activeIndex}`)
    el?.scrollIntoView({ block: "nearest" })
  }, [activeIndex, open, id])

  function commitSelection(idx: number) {
    const sug = suggestions[idx]
    if (!sug) return
    onChange(sug.selection.label)
    onSelect(sug.selection)
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

  const showDropdown =
    open && mounted && suggestions.length > 0 && rect !== null

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
      {showDropdown &&
        createPortal(
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            style={{
              position: "fixed",
              top: rect.top,
              left: rect.left,
              width: rect.width,
              zIndex: 70,
            }}
            className="max-h-72 overflow-y-auto overflow-x-hidden rounded-2xl border border-fir-dark/10 bg-white shadow-[0_24px_60px_-24px_rgba(10,45,34,0.35)]"
          >
            {suggestions.map((s, i) => {
              const active = i === activeIndex
              return (
                <li
                  key={s.key}
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
                    active
                      ? "bg-cream text-fir-dark"
                      : "text-ink/85 hover:bg-cream/60",
                  )}
                >
                  <div className="font-medium">{s.primary}</div>
                  {s.secondary && (
                    <div className="text-xs text-ink/55">{s.secondary}</div>
                  )}
                </li>
              )
            })}
          </ul>,
          document.body,
        )}
    </div>
  )
}
