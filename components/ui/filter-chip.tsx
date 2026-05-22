"use client"

import { cn } from "@/lib/utils"

type Props = {
  label: string
  active: boolean
  onClick: () => void
  count?: number
  className?: string
}

/** Chip de filtre — inactif = bordure or, actif = fond vert profond + ivoire. */
export function FilterChip({ label, active, onClick, count, className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid="ui-filter-chip"
      data-active={active}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium uppercase leading-none tracking-wider transition-colors duration-200 ease-out",
        active
          ? "border-fir-dark bg-fir-dark text-cream"
          : "border-gold/50 bg-transparent text-fir-dark hover:border-gold hover:bg-gold/10",
        className,
      )}
    >
      <span>{label}</span>
      {typeof count === "number" && (
        <span
          className={cn(
            "ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold tabular",
            active ? "bg-cream/15 text-cream/90" : "bg-fir-dark/5 text-fir-dark/60",
          )}
        >
          {count}
        </span>
      )}
    </button>
  )
}
