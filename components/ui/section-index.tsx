import { RevealStagger, RevealItem } from "@/components/motion/reveal"
import { cn } from "@/lib/utils"

type Item = {
  titre: string
  text: string
}

type Props = {
  items: ReadonlyArray<Item>
  className?: string
}

/**
 * Grille numérotée façon "process". Description toujours visible.
 * Numérotation générée depuis l'index. Tokens DA Option A 15/06/2026 :
 * chiffre Anton or, titre Inter uppercase tracking-tight fir-dark,
 * description Inter ink/75, filet or border-top 2px.
 */
export function SectionIndex({ items, className }: Props) {
  return (
    <RevealStagger className={cn("grid gap-8 sm:grid-cols-2 sm:gap-x-10", className)}>
      {items.map((item, i) => {
        const num = String(i + 1).padStart(2, "0")
        return (
          <RevealItem key={item.titre}>
            <div className="border-t-2 border-gold/30 pt-5">
              <p className="font-display text-[clamp(2.25rem,4vw,3.5rem)] leading-[0.85] text-gold">
                {num}
              </p>
              <h4 className="mt-3 text-sm font-medium uppercase tracking-tight text-fir-dark md:text-base">
                {item.titre}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">
                {item.text}
              </p>
            </div>
          </RevealItem>
        )
      })}
    </RevealStagger>
  )
}
