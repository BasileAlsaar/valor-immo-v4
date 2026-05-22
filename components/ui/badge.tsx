import { cn } from "@/lib/utils"

/** Variante visuelle du badge — statut (À louer / À vendre / Sous compromis),
 *  type (Local commercial / Bureaux…), ref (MZ1-2026), illustration (legacy). */
export type BadgeVariant = "status" | "type" | "ref" | "illustration"
export type BadgeTone = "gold" | "green" | "neutral" | "dark"

type Props = {
  variant?: BadgeVariant
  tone?: BadgeTone
  className?: string
  children: React.ReactNode
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  gold: "bg-gold text-ink",
  green: "bg-fir-darker text-gold",
  neutral: "bg-white/95 text-fir-dark",
  dark: "bg-black/40 text-white/85 backdrop-blur-sm",
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  status: "rounded-full px-3 py-1",
  type: "rounded-full border border-fir-dark/15 px-3 py-1",
  ref: "rounded-md px-2 py-0.5",
  illustration: "rounded px-2 py-1",
}

/** Badge réutilisable — remplace les 5 occurrences inlinées du sprint 1-3. */
export function Badge({
  variant = "status",
  tone = "neutral",
  className,
  children,
}: Props) {
  return (
    <span
      data-testid="ui-badge"
      data-variant={variant}
      data-tone={tone}
      className={cn(
        "inline-flex items-center text-[10px] font-medium uppercase leading-none tracking-wider",
        variant === "status" && "text-xs",
        VARIANT_CLASSES[variant],
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
