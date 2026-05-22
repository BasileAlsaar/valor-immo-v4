"use client"

import { useState } from "react"
import { ArrowUpRight, HelpCircle, X } from "lucide-react"

import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { CtaPill } from "@/components/ui/cta-pill"
import { ArgusMap } from "@/components/home/argus-map"
import type { LayersState } from "@/components/home/map-layer-toggle"
import { ARRONDISSEMENTS_PARIS, ARGUS_DISCLAIMER } from "@/lib/data/valeurs-locatives"
import { REFS_TOTAL } from "@/lib/data/references-meta"
import { cn } from "@/lib/utils"

export function ArgusSection() {
  const [focus, setFocus] = useState<number | null>(null)
  const [adresse, setAdresse] = useState("")
  const [layers, setLayers] = useState<LayersState>({
    choropleth: true,
    heatmap: true,
    markers: true,
  })
  const [helpOpen, setHelpOpen] = useState(false)
  const [loadMs, setLoadMs] = useState<number | null>(null)

  function formatPrix(p: number) {
    return new Intl.NumberFormat("fr-FR").format(p)
  }

  return (
    <section id="argus" className="relative bg-cream-soft py-20 md:py-24 lg:py-28">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <Eyebrow className="text-gold-deep">Estimation</Eyebrow>
            <div className="mt-3 flex items-start gap-3">
              <h2 className="font-display text-[clamp(1.75rem,4.5vw,3.75rem)] uppercase leading-[1] tracking-tight text-fir-dark">
                Quelle est la valeur locative{" "}
                <span className="text-gold-deep">de votre commerce ?</span>
              </h2>
              <button
                type="button"
                onClick={() => setHelpOpen(true)}
                aria-label="À propos de la carte"
                className="mt-2 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-fir-dark/20 text-fir-dark/60 transition hover:border-fir-dark hover:text-fir-dark"
              >
                <HelpCircle className="h-3.5 w-3.5" strokeWidth={1.7} />
              </button>
            </div>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-ink/80 md:text-base">
            Notre base de plus de 40 000 références de transactions et baux
            commerciaux nous permet de fournir une fourchette précise en
            €/m²/an HT HC pour les locaux commerciaux parisiens —
            commerce nu ou restauration avec extraction.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_1fr]">
          {/* Carte */}
          <div className="relative overflow-hidden rounded-3xl border border-fir-dark/10 bg-white shadow-[0_24px_80px_-20px_rgba(15,61,46,0.18)]">
            <ArgusMap
              focus={focus}
              onFocus={setFocus}
              layers={layers}
              onLayersChange={setLayers}
              onLoadMs={setLoadMs}
            />
          </div>

          {/* Tableau */}
          <div className="overflow-hidden rounded-3xl border border-fir-dark/10 bg-white shadow-[0_24px_80px_-20px_rgba(15,61,46,0.12)]">
            <div className="bg-fir-dark px-6 py-4 text-white">
              <p className="eyebrow text-gold">Valeurs locatives indicatives — Paris</p>
              <p className="mt-1 text-xs opacity-70">€/m²/an HT HC</p>
            </div>
            <div className="max-h-[480px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10 bg-cream text-ink">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium uppercase tracking-wider text-xs">
                      Arr.
                    </th>
                    <th className="px-4 py-3 text-right font-medium uppercase tracking-wider text-xs">
                      Commerce
                    </th>
                    <th className="px-6 py-3 text-right font-medium uppercase tracking-wider text-xs">
                      Restau. extract.
                    </th>
                  </tr>
                </thead>
                <tbody className="tabular">
                  {ARRONDISSEMENTS_PARIS.map((arr, idx) => (
                    <tr
                      key={arr.num}
                      onMouseEnter={() => setFocus(arr.num)}
                      onMouseLeave={() => setFocus(null)}
                      className={cn(
                        "transition-colors",
                        idx % 2 === 1 && "bg-cream/40",
                        focus === arr.num && "bg-gold/20",
                      )}
                    >
                      <td className="px-6 py-2.5 text-left font-medium text-fir-dark">
                        {arr.display}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {formatPrix(arr.loyerCommerceMoyen)} €
                      </td>
                      <td className="px-6 py-2.5 text-right text-gold-deep">
                        {formatPrix(arr.loyerRestauExtract)} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-fir-dark/10 bg-cream/40 p-6">
              <p className="text-xs leading-relaxed text-ink/60">{ARGUS_DISCLAIMER}</p>
            </div>
          </div>
        </div>

        {/* Mention transparence (brief §202) */}
        <p className="mt-4 text-right text-xs text-stone-500">
          Échantillon représentatif anonymisé de {REFS_TOTAL.toLocaleString("fr-FR")} points
          affichés sur la carte. Notre base d'analyse compte plus de 40 000 références
          historiques. Pour une estimation personnalisée, contactez-nous.
          {loadMs !== null && process.env.NODE_ENV !== "production" && (
            <span className="ml-2 text-stone-400">· carte chargée en {loadMs} ms</span>
          )}
        </p>

        <div className="mt-12 grid gap-6 rounded-3xl border border-fir-dark/10 bg-white p-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <label className="block">
            <span className="eyebrow text-ink/60">Adresse du local commercial</span>
            <input
              type="text"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              placeholder="45 rue de Passy, 75016 Paris"
              className="mt-2 w-full border-0 border-b-2 border-ink/15 bg-transparent px-0 pb-2 text-base text-ink placeholder:text-ink/30 focus:border-gold focus:outline-none focus:ring-0"
            />
          </label>
          <CtaPill href={`/estimations?adresse=${encodeURIComponent(adresse)}`} variant="gold" size="lg">
            Demander une estimation
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </CtaPill>
        </div>

        {/* Mini-popup d'aide (brief §208) */}
        {helpOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-fir-darker/40 backdrop-blur-sm p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="argus-help-title"
            onClick={() => setHelpOpen(false)}
          >
            <div
              className="max-w-md rounded-2xl bg-cream p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <h3
                  id="argus-help-title"
                  className="eyebrow text-gold-deep"
                >
                  À propos de cette carte
                </h3>
                <button
                  type="button"
                  onClick={() => setHelpOpen(false)}
                  aria-label="Fermer"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink/50 transition hover:bg-fir-dark/5 hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink/80">
                Notre base d'analyse marché compte plus de{" "}
                <strong className="text-fir-dark">40 000 références historiques</strong>{" "}
                de transactions et baux commerciaux parisiens.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">
                La carte affiche un{" "}
                <strong className="text-fir-dark">
                  échantillon représentatif anonymisé de {REFS_TOTAL.toLocaleString("fr-FR")} points
                </strong>{" "}
                : points strictement géolocalisés à l'arrondissement, sans adresse précise
                ni nom de cédant.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">
                Pour une estimation personnalisée appuyée sur la base complète, contactez
                un de nos directeurs.
              </p>
            </div>
          </div>
        )}
      </Container>
    </section>
  )
}
