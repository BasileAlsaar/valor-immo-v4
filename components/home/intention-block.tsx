import Link from "next/link"
import { Search, TrendingUp, Handshake } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Container } from "@/components/ui/container"
import { RevealStagger, RevealItem } from "@/components/motion/reveal"
import { cn } from "@/lib/utils"

/**
 * Bloc d'intention — porte d'entrée unique sous le hero.
 * Remplace les anciens FunnelsCTA + PortesEntrees ; oriente le visiteur
 * vers le funnel correspondant à son verbe d'intention.
 *
 * Palette stricte : cream (fond section), white (fond carte), fir-dark
 * (texte + h2), gold (accents, eyebrow, border-top), gold-deep
 * (icônes au repos). Aucune autre couleur.
 */

type Intention = {
  verbe: string
  description: string
  href: string
  icon: LucideIcon
  ariaLabel: string
}

const INTENTIONS: Intention[] = [
  {
    verbe: "Louer",
    description: "Trouvez votre local commercial.",
    href: "/commercant",
    icon: Search,
    ariaLabel: "Louer — trouver votre local commercial",
  },
  {
    verbe: "Acheter",
    description: "Investissez dans la pierre.",
    href: "/investisseur",
    icon: TrendingUp,
    ariaLabel: "Acheter — investir dans la pierre",
  },
  {
    verbe: "Vendre",
    description: "Estimez et cédez votre bien.",
    href: "/proprietaire",
    icon: Handshake,
    ariaLabel: "Vendre — estimer et céder votre bien",
  },
]

export function IntentionBlock() {
  return (
    <section className="bg-cream py-20 md:py-24 lg:py-28">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-display text-xs uppercase tracking-[0.3em] text-gold">
            Valor Immo
          </span>
          <h2 className="font-display mt-4 text-[clamp(2rem,5vw,4.5rem)] uppercase leading-[0.95] tracking-tight text-fir-dark">
            Vous avez un projet&nbsp;?
          </h2>
          <p className="mt-5 text-lg leading-snug text-fir-dark/80 md:text-xl">
            Dites-nous votre intention, on s&apos;occupe du reste.
          </p>
        </div>

        <RevealStagger className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6 lg:mt-16">
          {INTENTIONS.map((i) => (
            <RevealItem key={i.verbe}>
              <IntentionCard intention={i} />
            </RevealItem>
          ))}
        </RevealStagger>
      </Container>
    </section>
  )
}

function IntentionCard({ intention }: { intention: Intention }) {
  const Icon = intention.icon
  return (
    <Link
      href={intention.href}
      aria-label={intention.ariaLabel}
      className={cn(
        "group relative flex h-full flex-col gap-8 rounded-2xl border border-gold/40 bg-white p-8 md:p-10",
        "shadow-[0_1px_2px_rgba(10,45,34,0.04),0_10px_24px_-16px_rgba(10,45,34,0.12)]",
        "transition-[transform,box-shadow,border-color] duration-500 ease-out-expo",
        "motion-safe:hover:-translate-y-1",
        "hover:border-gold",
        "hover:shadow-[0_2px_4px_rgba(10,45,34,0.06),0_28px_60px_-24px_rgba(10,45,34,0.25)]",
      )}
    >
      <Icon
        aria-hidden
        strokeWidth={1.5}
        className="h-10 w-10 text-gold-deep transition-colors duration-500 ease-out-expo group-hover:text-gold"
      />
      <div>
        <h3 className="font-display text-[clamp(2rem,3.5vw,3rem)] uppercase leading-none tracking-tight text-fir-dark">
          {intention.verbe}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-ink/70">
          {intention.description}
        </p>
      </div>
    </Link>
  )
}
