import Image from "next/image"
import Link from "next/link"

import { Badge, type BadgeTone, type BadgeVariant } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type CardBadge = {
  label: string
  variant?: BadgeVariant
  tone?: BadgeTone
  position?: "tl" | "tr" | "bl" | "br"
}

type Props = {
  image: { src: string; alt: string; aspectRatio?: "4/3" | "16/9" | "4/5" | "3/4" }
  eyebrow?: string
  title: string
  subtitle?: string
  description?: string
  badges?: CardBadge[]
  href?: string
  cta?: string
  /** Affecte les paddings et l'aspect ratio par défaut. */
  variant?: "category" | "opportunity" | "opportunity-detail"
  priority?: boolean
  className?: string
}

const POSITION_CLASSES: Record<NonNullable<CardBadge["position"]>, string> = {
  tl: "absolute left-4 top-4",
  tr: "absolute right-4 top-4",
  bl: "absolute bottom-4 left-4",
  br: "absolute bottom-4 right-4",
}

const ASPECT_CLASSES: Record<NonNullable<Props["image"]["aspectRatio"]>, string> = {
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-[16/9]",
  "4/5": "aspect-[4/5]",
  "3/4": "aspect-[3/4]",
}

const VARIANT_DEFAULTS: Record<NonNullable<Props["variant"]>, { aspect: NonNullable<Props["image"]["aspectRatio"]>; padding: string }> = {
  category: { aspect: "4/5", padding: "p-7 md:p-9" },
  opportunity: { aspect: "4/3", padding: "p-6" },
  "opportunity-detail": { aspect: "4/3", padding: "p-5" },
}

/**
 * Card générique — image full-bleed + overlay vert + badges absolus + texte.
 * Utilisée par CategoriesGrid, OpportunitiesPreview et le catalogue.
 */
export function Card({
  image,
  eyebrow,
  title,
  subtitle,
  description,
  badges,
  href,
  cta,
  variant = "opportunity",
  priority,
  className,
}: Props) {
  const defaults = VARIANT_DEFAULTS[variant]
  const aspect = image.aspectRatio ?? defaults.aspect
  const padding = defaults.padding

  const Inner = (
    <>
      <div className={cn("relative overflow-hidden bg-fir-dark", ASPECT_CLASSES[aspect])}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={
            variant === "category"
              ? "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              : "(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
          }
          priority={priority}
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
        {variant === "category" && (
          <div className="absolute inset-0 bg-gradient-to-t from-fir-darker/95 via-fir-dark/55 to-fir-dark/15" />
        )}
        {variant !== "category" && (
          <div className="absolute inset-0 bg-gradient-to-t from-fir-dark/30 to-transparent" />
        )}
        {badges?.map((b, i) => (
          <Badge
            key={`${b.label}-${i}`}
            variant={b.variant}
            tone={b.tone}
            className={cn(POSITION_CLASSES[b.position ?? "tl"])}
          >
            {b.label}
          </Badge>
        ))}
        {variant === "category" && (
          <div className={cn("absolute inset-0 flex flex-col justify-between text-white", padding)}>
            {eyebrow && <span className="eyebrow text-gold">{eyebrow}</span>}
            <div>
              <h3 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] uppercase leading-[0.95] tracking-tight">
                {title}
              </h3>
              {description && (
                <p className="mt-4 text-sm leading-relaxed opacity-85">{description}</p>
              )}
              {cta && (
                <span className="mt-6 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-gold">
                  {cta} ↗
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      {variant !== "category" && (
        <div className={padding}>
          {eyebrow && <p className="eyebrow text-gold-deep">{eyebrow}</p>}
          <h3 className="mt-2 text-base font-medium leading-tight text-fir-dark md:text-lg">
            {title}
          </h3>
          {subtitle && <p className="mt-1 text-xs text-ink/60">{subtitle}</p>}
          {description && (
            <p className="mt-3 text-sm leading-relaxed text-ink/70">{description}</p>
          )}
        </div>
      )}
    </>
  )

  const sharedClasses = cn(
    "group block h-full overflow-hidden rounded-2xl bg-white shadow-[0_8px_28px_-12px_rgba(15,61,46,0.18)] transition hover:-translate-y-1",
    variant === "category" && "bg-fir-dark",
    className,
  )

  if (href) {
    return (
      <Link href={href} data-testid="ui-card" className={sharedClasses}>
        {Inner}
      </Link>
    )
  }
  return (
    <div data-testid="ui-card" className={sharedClasses}>
      {Inner}
    </div>
  )
}
