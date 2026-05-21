import Link from "next/link"
import { cn } from "@/lib/utils"

type Variant = "gold" | "fir" | "outline-gold" | "outline-white" | "outline-ink"
type Size = "md" | "lg"

const variants: Record<Variant, string> = {
  gold: "bg-gold text-ink hover:bg-gold-warm",
  fir: "bg-fir-dark text-white hover:bg-ink",
  "outline-gold": "border-2 border-gold text-gold hover:bg-gold hover:text-ink",
  "outline-white": "border-2 border-white text-white hover:bg-white hover:text-ink",
  "outline-ink": "border-2 border-ink text-ink hover:bg-ink hover:text-cream",
}

const sizes: Record<Size, string> = {
  md: "px-8 py-3 text-sm",
  lg: "px-10 py-4 text-base",
}

type Props = {
  href?: string
  variant?: Variant
  size?: Size
  className?: string
  children: React.ReactNode
  type?: "button" | "submit"
  onClick?: () => void
}

export function CtaPill({
  href,
  variant = "gold",
  size = "md",
  className,
  children,
  type,
  onClick,
}: Props) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium uppercase tracking-wider transition-colors duration-300 ease-out-expo",
    variants[variant],
    sizes[size],
    className,
  )
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type ?? "button"} onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
