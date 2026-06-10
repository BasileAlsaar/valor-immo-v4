"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"
import { RotateCcw } from "lucide-react"

import { FilterChip } from "@/components/ui/filter-chip"
import { CATEGORIES } from "@/lib/data/categories"
import { cn } from "@/lib/utils"

const TRANSACTIONS = [
  { value: "location", label: "Location" },
  { value: "vente", label: "Vente" },
] as const

const ARRONDISSEMENTS = Array.from({ length: 20 }, (_, i) => i + 1)

type Props = {
  /** Compteur de résultats actuel après filtrage server. */
  resultCount: number
  /** Compteur "tous biens" avant filtrage — pour l'affichage X/Y. */
  totalCount: number
}

function parseList(value: string | null): string[] {
  if (!value) return []
  return value.split(",").map((v) => v.trim()).filter(Boolean)
}

export function OpportunitiesFilters({ resultCount, totalCount }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const active = useMemo(
    () => ({
      typologie: parseList(searchParams.get("typologie")),
      transaction: parseList(searchParams.get("transaction")),
      arrondissement: parseList(searchParams.get("arrondissement")).map((n) =>
        parseInt(n, 10),
      ),
    }),
    [searchParams],
  )

  const hasFilters =
    active.typologie.length > 0 ||
    active.transaction.length > 0 ||
    active.arrondissement.length > 0

  const updateUrl = useCallback(
    (next: { typologie: string[]; transaction: string[]; arrondissement: number[] }) => {
      const params = new URLSearchParams()
      if (next.typologie.length) params.set("typologie", next.typologie.join(","))
      if (next.transaction.length) params.set("transaction", next.transaction.join(","))
      if (next.arrondissement.length)
        params.set("arrondissement", next.arrondissement.join(","))
      const query = params.toString()
      router.replace(query ? `/opportunites?${query}` : "/opportunites", {
        scroll: false,
      })
    },
    [router],
  )

  function toggleTypologie(slug: string) {
    const next = active.typologie.includes(slug)
      ? active.typologie.filter((v) => v !== slug)
      : [...active.typologie, slug]
    updateUrl({ ...active, typologie: next })
  }

  function toggleTransaction(value: string) {
    // Mono-select au sein de transaction (mais peut être désactivé)
    const next = active.transaction.includes(value) ? [] : [value]
    updateUrl({ ...active, transaction: next })
  }

  function toggleArrondissement(n: number) {
    const next = active.arrondissement.includes(n)
      ? active.arrondissement.filter((v) => v !== n)
      : [...active.arrondissement, n]
    updateUrl({ ...active, arrondissement: next })
  }

  function reset() {
    router.replace("/opportunites", { scroll: false })
  }

  return (
    <div
      data-testid="opportunities-filters"
      className="z-30 -mx-6 border-b border-fir-dark/10 bg-cream-soft/95 px-6 py-4 backdrop-blur-md md:sticky md:top-20 md:-mx-12 md:px-12 lg:-mx-24 lg:px-24"
    >
      {/* Padding inline aligné sur <Container> (max-w-[1440px] px-6/12/24) — composant rendu hors Container, voir app/opportunites/page.tsx. */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-6 md:px-12 lg:px-24">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="text-sm font-medium text-fir-dark">
            <span className="font-display text-2xl tabular">{resultCount}</span>{" "}
            <span className="text-xs uppercase tracking-wider text-ink/60">
              {hasFilters ? `résultat${resultCount !== 1 ? "s" : ""} / ${totalCount}` : `bien${totalCount !== 1 ? "s" : ""} disponible${totalCount !== 1 ? "s" : ""}`}
            </span>
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-gold-deep transition hover:text-fir-dark"
            >
              <RotateCcw className="h-3 w-3" /> Réinitialiser
            </button>
          )}
        </div>

        <div className="space-y-3">
          <FilterGroup label="Typologie">
            {CATEGORIES.map((c) => (
              <FilterChip
                key={c.slug}
                label={c.label}
                active={active.typologie.includes(c.slug)}
                onClick={() => toggleTypologie(c.slug)}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="Transaction">
            {TRANSACTIONS.map((t) => (
              <FilterChip
                key={t.value}
                label={t.label}
                active={active.transaction.includes(t.value)}
                onClick={() => toggleTransaction(t.value)}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="Arrondissement">
            {ARRONDISSEMENTS.map((n) => (
              <FilterChip
                key={n}
                label={n === 1 ? "Paris 1ᵉʳ" : `Paris ${n}ᵉ`}
                active={active.arrondissement.includes(n)}
                onClick={() => toggleArrondissement(n)}
              />
            ))}
          </FilterGroup>
        </div>
      </div>
    </div>
  )
}

function FilterGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className={cn("eyebrow w-28 shrink-0 text-ink/50")}>{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}
