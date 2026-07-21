import { Eyebrow } from "@/components/ui/eyebrow"
import { cn } from "@/lib/utils"

/**
 * Bloc chiffres remonté au-dessus de la Gallery sur la fiche bien,
 * visible uniquement sous `lg`. Le desktop conserve sa carte prix
 * sticky dans l'aside — ce bloc est masqué au-delà pour éviter la
 * redondance.
 *
 * Composition adaptée à la donnée réelle (voir /docs de conception
 * lot 2) :
 *
 *  - Vente     → prix + prix/m² + surface. Composition simple, pas
 *                de grille : une seule métrique factuelle disponible.
 *  - Location  → prix + prix/m²/an + rangée 2 col. (Surface + Dépôt).
 *
 * Aucun champ n'est affiché si sa valeur est absente : la rangée se
 * recompose (2 → 1 col, ou disparaît) plutôt que de laisser une case
 * vide.
 *
 * Le champ Apimo `price.commission` n'est PAS exposé ici : Apimo ne
 * renvoie pas de libellé de payeur (« à charge acquéreur », « inclus »),
 * afficher un montant isolé de mention légale serait ambigu.
 */

const NF = new Intl.NumberFormat("fr-FR")

type Props = {
  category: string
  priceStr: string
  perSqm: { label: string; approx: boolean } | null
  areaStr: string | null
  deposit: number | null
  className?: string
}

export function MobileFigures({
  category,
  priceStr,
  perSqm,
  areaStr,
  deposit,
  className,
}: Props) {
  const showVenteFooter = category === "Vente" && areaStr
  const showLocationFooter =
    category === "Location" && (areaStr || deposit != null)

  return (
    <div className={cn("lg:hidden", className)}>
      <div className="rounded-2xl bg-cream-soft p-6 shadow-[0_8px_28px_-12px_rgba(15,61,46,0.10)]">
        <Eyebrow className="text-gold-deep">Prix</Eyebrow>
        <p className="font-display mt-2 text-3xl uppercase tracking-tight text-fir-dark">
          {priceStr}
        </p>
        {perSqm && (
          <p className="mt-2 text-xs text-ink/55">
            Soit {perSqm.approx ? "~" : ""}
            {perSqm.label} à titre indicatif.
          </p>
        )}

        {showVenteFooter && (
          <div className="mt-5 flex items-baseline justify-between border-t border-fir-dark/10 pt-4 text-sm">
            <span className="text-ink/60">Surface</span>
            <span className="text-fir-dark">{areaStr}</span>
          </div>
        )}

        {showLocationFooter && (
          <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-fir-dark/10 pt-4 text-sm">
            {areaStr && (
              <div>
                <dt className="text-ink/60">Surface</dt>
                <dd className="mt-0.5 text-fir-dark">{areaStr}</dd>
              </div>
            )}
            {deposit != null && (
              <div>
                <dt className="text-ink/60">Dépôt de garantie</dt>
                <dd className="mt-0.5 text-fir-dark">
                  {NF.format(deposit)} €
                </dd>
              </div>
            )}
          </dl>
        )}
      </div>
    </div>
  )
}
