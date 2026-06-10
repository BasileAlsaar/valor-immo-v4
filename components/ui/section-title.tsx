import { cn } from "@/lib/utils"

type Tag = "h2" | "h3" | "h4"
type Size = "md" | "lg"

type Props = {
  children: React.ReactNode
  as?: Tag
  /**
   * "lg" reprend l'échelle des grands titres éditoriaux (l-agence intro,
   * location/vente intro). "md" reprend l'échelle des titres de carte.
   * Aucune valeur en pixels nouvelle — tokens repris du relevé typo V4.
   */
  size?: Size
  className?: string
  /** Forwardé pour focus management a11y (cf. Funnel.tsx step heading). */
  ref?: React.Ref<HTMLHeadingElement>
  tabIndex?: number
  id?: string
}

const SIZE_CLASS: Record<Size, string> = {
  md: "text-2xl md:text-3xl",
  lg: "text-[clamp(2rem,3vw,2.75rem)]",
}

const BASE_CLASS = cn(
  "font-sans font-semibold uppercase text-fir-dark",
  "leading-[1.15] tracking-wide",
)

export function SectionTitle({
  children,
  as: Tag = "h2",
  size = "lg",
  className,
  ref,
  tabIndex,
  id,
}: Props) {
  return (
    <Tag
      ref={ref}
      tabIndex={tabIndex}
      id={id}
      className={cn(BASE_CLASS, SIZE_CLASS[size], className)}
    >
      {children}
    </Tag>
  )
}
