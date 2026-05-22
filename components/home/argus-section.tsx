"use client"

import { useState } from "react"
import { ArrowUpRight } from "lucide-react"

import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { CtaPill } from "@/components/ui/cta-pill"
import { ArgusMap } from "@/components/home/argus-map"
import { ARRONDISSEMENTS_PARIS, ARGUS_DISCLAIMER } from "@/lib/data/valeurs-locatives"
import { cn } from "@/lib/utils"

export function ArgusSection() {
  const [focus, setFocus] = useState<number | null>(null)
  const [adresse, setAdresse] = useState("")

  function formatPrix(p: number) {
    return new Intl.NumberFormat("fr-FR").format(p)
  }

  return (
    <section id="argus" className="relative bg-cream-soft py-20 md:py-24 lg:py-28">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <Eyebrow className="text-gold-deep">Estimation</Eyebrow>
            <h2 className="font-display mt-3 text-[clamp(1.75rem,4.5vw,3.75rem)] uppercase leading-[1] tracking-tight text-fir-dark">
              Quelle est la valeur locative{" "}
              <span className="text-gold-deep">de votre commerce ?</span>
            </h2>
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
          <div className="overflow-hidden rounded-3xl border border-fir-dark/10 bg-white shadow-[0_24px_80px_-20px_rgba(15,61,46,0.18)]">
            <ArgusMap focus={focus} onFocus={setFocus} />
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

        <div className="mt-16 grid gap-6 rounded-3xl border border-fir-dark/10 bg-white p-8 lg:grid-cols-[1fr_auto] lg:items-end">
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
      </Container>
    </section>
  )
}
