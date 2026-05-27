import Image from "next/image"

import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { cn } from "@/lib/utils"

type Props = {
  eyebrow: string
  title: React.ReactNode
  subtitle?: string
  backgroundImage?: string
  className?: string
  actions?: React.ReactNode
}

/**
 * Hero générique pages V4. Sprint 4a : remplace l'image background CSS par
 * `<Image fill priority />` Next/Image pour activer `loading="eager"` (équivalent
 * `priority` côté Next) + optimisation WebP/AVIF via la config sprint 4a.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  backgroundImage,
  className,
  actions,
}: Props) {
  return (
    <section
      className={cn(
        "relative isolate flex min-h-[70vh] flex-col justify-end overflow-hidden bg-fir-dark pt-56 text-white",
        className,
      )}
    >
      {backgroundImage && (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-fir-dark/55 via-fir-dark/60 to-fir-darker/90" aria-hidden />
        </>
      )}
      <Container className="pb-24 lg:pb-32">
        <Eyebrow className="text-gold">{eyebrow}</Eyebrow>
        <h1 className="font-display mt-6 max-w-5xl text-[clamp(2.5rem,9vw,9rem)] uppercase leading-[0.92] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-8 max-w-2xl text-base leading-relaxed opacity-90 md:text-lg">
            {subtitle}
          </p>
        )}
        {actions && <div className="mt-10 flex flex-wrap items-center gap-4">{actions}</div>}
      </Container>
    </section>
  )
}
