import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { cn } from "@/lib/utils"

type Props = {
  eyebrow: string
  title: React.ReactNode
  subtitle?: string
  backgroundImage?: string
  className?: string
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  backgroundImage,
  className,
}: Props) {
  return (
    <section
      className={cn(
        "relative isolate flex min-h-[70vh] flex-col justify-end overflow-hidden bg-fir-dark pt-40 text-white",
        className,
      )}
    >
      {backgroundImage && (
        <>
          <div
            className="absolute inset-0 -z-20 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
            aria-hidden
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
      </Container>
    </section>
  )
}
