import { cn } from "@/lib/utils"

type Color = "ink" | "fir" | "gold" | "white"

const colorClass: Record<Color, string> = {
  ink: "text-outline-black",
  fir: "[-webkit-text-stroke:1.5px_#0F3D2E] text-transparent lg:[-webkit-text-stroke:2px_#0F3D2E]",
  gold: "text-outline-gold lg:[-webkit-text-stroke:2px_#C9A961]",
  white: "text-outline-white",
}

export function OutlineText({
  children,
  color = "ink",
  className,
  as: As = "h2",
}: {
  children: React.ReactNode
  color?: Color
  className?: string
  as?: "h1" | "h2" | "h3"
}) {
  return (
    <As className={cn("font-display uppercase", colorClass[color], className)}>
      {children}
    </As>
  )
}
