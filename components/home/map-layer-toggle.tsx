"use client"

import { Layers, Droplets, MapPin } from "lucide-react"

import { cn } from "@/lib/utils"

export type LayersState = {
  choropleth: boolean
  heatmap: boolean
  markers: boolean
}

type Props = {
  value: LayersState
  onChange: (next: LayersState) => void
  className?: string
}

const ITEMS: Array<{
  key: keyof LayersState
  icon: typeof Layers
  label: string
}> = [
  { key: "choropleth", icon: Layers, label: "Valeurs €/m² par arrondissement" },
  { key: "heatmap", icon: Droplets, label: "Densité du marché" },
  { key: "markers", icon: MapPin, label: "Biens en exclusivité" },
]

/**
 * Overlay top-right de la carte ARGUS — toggle indépendant des 3 layers.
 * Cohérent design V4 (pas de switch iOS-style, cf. brief §191 anti-cliché).
 */
export function MapLayerToggle({ value, onChange, className }: Props) {
  return (
    <div
      className={cn(
        "absolute right-4 top-4 z-10 min-w-[200px] rounded-lg bg-cream/95 p-3 shadow-md backdrop-blur-sm",
        className,
      )}
      role="group"
      aria-label="Calques de la carte"
    >
      <ul className="space-y-1.5">
        {ITEMS.map(({ key, icon: Icon, label }) => {
          const checked = value[key]
          return (
            <li key={key}>
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 transition",
                  "hover:bg-fir-dark/5",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onChange({ ...value, [key]: !checked })}
                  className="peer sr-only"
                  aria-label={label}
                />
                <span
                  className={cn(
                    "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border-2 transition",
                    checked
                      ? "border-fir-dark bg-fir-dark"
                      : "border-fir-dark/30 bg-transparent",
                  )}
                  aria-hidden
                >
                  {checked && (
                    <svg
                      viewBox="0 0 12 12"
                      fill="none"
                      className="h-2.5 w-2.5 text-cream"
                      aria-hidden
                    >
                      <path
                        d="M2.5 6.5l2.5 2.5 4.5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <Icon
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 transition",
                    checked ? "text-fir-dark" : "text-ink/40",
                  )}
                  strokeWidth={1.6}
                  aria-hidden
                />
                <span
                  className={cn(
                    "text-[11px] uppercase leading-tight tracking-wide transition",
                    checked ? "text-fir-dark" : "text-ink/50",
                  )}
                >
                  {label}
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
