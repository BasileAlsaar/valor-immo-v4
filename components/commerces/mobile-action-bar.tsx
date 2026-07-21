import Link from "next/link"
import { Phone } from "lucide-react"

/**
 * Barre d'action mobile pour la fiche bien : visible sous `lg`, cachée
 * au-dessus (où la carte prix `aside sticky` remplit déjà ce rôle).
 *
 * `position: fixed` — safe pour le ZoneMap MapLibre (dont le canvas est
 * dans son propre conteneur relatif). Le parent doit prévoir un
 * `padding-bottom` équivalent à `MOBILE_ACTION_BAR_SPACER` pour que le
 * contenu ne passe pas dessous.
 *
 * `env(safe-area-inset-bottom)` respecte le home indicator iPhone.
 */

// Spacer à appliquer sur le conteneur parent (padding-bottom). Combine la
// hauteur intrinsèque de la barre (`h-16` = 4rem) et l'inset safe-area.
export const MOBILE_ACTION_BAR_SPACER =
  "pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0"

type Props = {
  visitHref: string
  telHref: string
  telDisplay: string
}

export function MobileActionBar({ visitHref, telHref, telDisplay }: Props) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-fir-dark/10 bg-cream/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_28px_-12px_rgba(15,61,46,0.18)] backdrop-blur lg:hidden"
      role="region"
      aria-label="Actions rapides"
    >
      <div className="flex h-16 items-center gap-3 px-4">
        <Link
          href={visitHref}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-fir-dark text-sm font-medium uppercase tracking-wider text-white transition-colors duration-300 ease-out-expo hover:bg-ink"
        >
          Demander une visite
        </Link>
        <a
          href={telHref}
          aria-label={`Appeler ${telDisplay}`}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-fir-dark/20 text-fir-dark transition-colors duration-300 ease-out-expo hover:border-fir-dark hover:bg-fir-dark hover:text-white"
        >
          <Phone className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}
