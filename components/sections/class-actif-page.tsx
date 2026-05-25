import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

import { PageHero } from "@/components/sections/page-hero"
import { CallbackSection } from "@/components/sections/callback-section"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Badge } from "@/components/ui/badge"
import { RevealStagger, RevealItem } from "@/components/motion/reveal"
import {
  properties,
  STATUT_LABEL,
  TYPE_LABEL,
  type PropertyCategory,
} from "@/lib/data/properties"

type Props = {
  category: PropertyCategory
  eyebrow: string
  title: React.ReactNode
  subtitle: string
  vocab: { label: string; value: string }[]
  /** Phrase d'intro de la colonne gauche Vocabulaire métier, propre à la typologie. */
  vocabIntro: string
  quartiers: string[]
  clientele: string[]
  backgroundImage: string
}

function formatPrice(v: number) {
  return new Intl.NumberFormat("fr-FR").format(v)
}

export function ClassActifPage({
  category,
  eyebrow,
  title,
  subtitle,
  vocab,
  vocabIntro,
  quartiers,
  clientele,
  backgroundImage,
}: Props) {
  const matching = properties.filter((p) => p.categories.includes(category))

  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        backgroundImage={backgroundImage}
      />

      <section className="bg-cream py-24 md:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
            <div className="lg:sticky lg:top-[120px] lg:self-start">
              <Eyebrow className="text-gold-deep">Vocabulaire métier</Eyebrow>
              <h3 className="font-accent mt-4 text-[clamp(2rem,3vw,2.75rem)] italic leading-[1.05] text-fir-dark">
                Les indices qui structurent la lecture.
              </h3>
              <div aria-hidden className="my-6 h-px w-12 bg-gold" />
              <p className="max-w-[36ch] text-[15px] leading-relaxed text-fir-dark/70 md:text-base">
                {vocabIntro}
              </p>
            </div>
            <dl className="grid gap-6 md:grid-cols-2">
              {vocab.map((v) => (
                <div key={v.label} className="rounded-2xl border border-fir-dark/10 bg-white p-6">
                  <dt className="eyebrow text-gold-deep">{v.label}</dt>
                  <dd className="mt-3 text-sm leading-relaxed text-ink/80">{v.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      <section className="py-24 md:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow className="text-gold-deep">Quartiers prioritaires</Eyebrow>
              <ul className="mt-6 space-y-3">
                {quartiers.map((q) => (
                  <li key={q} className="flex items-start gap-3 text-ink/80">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Eyebrow className="text-gold-deep">Typologie clients</Eyebrow>
              <ul className="mt-6 space-y-3">
                {clientele.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-ink/80">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {matching.length > 0 && (
        <section className="bg-cream-soft py-24 md:py-32">
          <Container>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <Eyebrow className="text-gold-deep">Sélection en cours</Eyebrow>
                <h2 className="font-display mt-4 text-[clamp(1.75rem,4.5vw,3.5rem)] uppercase leading-tight tracking-tight text-fir-dark">
                  Opportunités dans cette classe d'actif
                </h2>
              </div>
              <Link
                href="/opportunites"
                className="group inline-flex items-center gap-2 text-sm uppercase tracking-wider text-gold-deep hover:text-fir-dark"
              >
                Voir tout
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <RevealStagger className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {matching.map((p) => (
                <RevealItem key={p.ref}>
                  <Link
                    href={`/opportunites/${p.slug}`}
                    className="group block h-full overflow-hidden rounded-2xl bg-white shadow-[0_8px_28px_-12px_rgba(15,61,46,0.18)] transition hover:-translate-y-1"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-fir-dark">
                      <Image
                        src={`/images/properties/${p.slug}.jpg`}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition duration-700 ease-out-expo group-hover:scale-105"
                      />
                      <Badge
                        variant="status"
                        tone={
                          p.statut === "vente"
                            ? "gold"
                            : p.statut === "murs-libres"
                              ? "green"
                              : "neutral"
                        }
                        className="absolute left-4 top-4"
                      >
                        {STATUT_LABEL[p.statut]}
                      </Badge>
                    </div>
                    <div className="p-6">
                      <p className="eyebrow text-gold-deep">{TYPE_LABEL[p.type]}</p>
                      <h3 className="mt-2 text-base font-medium leading-tight text-fir-dark">
                        {p.title}
                      </h3>
                      <p className="mt-1 text-xs text-ink/60">
                        {p.quartier} · {p.surface} m²
                      </p>
                      <p className="mt-4 font-display text-2xl uppercase tracking-tight text-fir-dark">
                        {p.loyerMensuel
                          ? `${formatPrice(p.loyerMensuel)} €/mois`
                          : p.prix
                            ? `${formatPrice(p.prix)} €`
                            : "Sur demande"}
                      </p>
                    </div>
                  </Link>
                </RevealItem>
              ))}
            </RevealStagger>
          </Container>
        </section>
      )}

      <CallbackSection />
    </>
  )
}
