import { cn } from "@/lib/utils"

type Variant = "light" | "dark"

type Props = {
  variant?: Variant
  className?: string
  children: React.ReactNode
}

const VARIANT_CLASSES: Record<Variant, string> = {
  light: "bg-white text-ink ring-1 ring-fir-dark/5 shadow-elevation-1",
  dark: "bg-fir-darker text-cream ring-1 ring-gold/20",
}

/**
 * Surface — primitif d'arrière-plan pour cartes textuelles.
 * Tokens only (couleurs, radius, padding, élévation). Pas d'image, pas de
 * sémantique métier. Utilisé pour récap, panneau coordonnées, etc.
 */
export function Surface({ variant = "light", className, children }: Props) {
  return (
    <div className={cn("rounded-2xl p-6 md:p-8", VARIANT_CLASSES[variant], className)}>
      {children}
    </div>
  )
}
