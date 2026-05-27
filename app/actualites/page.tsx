import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

import { PageHero } from "@/components/sections/page-hero"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { CallbackSection } from "@/components/sections/callback-section"
import { RevealStagger, RevealItem } from "@/components/motion/reveal"
import { articles } from "@/lib/data/articles"

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Analyses du marché immobilier commercial parisien : valeurs locatives, arbitrages QCA, cessions de fonds. Rédigé par l'équipe Valor Immo.",
}

export default function ActualitesPage() {
  return (
    <>
      <PageHero
        eyebrow="Actualités"
        title={
          <>
            Analyses du marché<br /><span className="text-gold">commercial parisien.</span>
          </>
        }
        subtitle="Données de marché, arbitrages d'emplacement, fiscalité de la cession : nos analyses opérationnelles, écrites par les interlocuteurs confirmés qui les ont vécues sur le terrain."
        backgroundImage="/images/categories/bureaux.jpg"
      />

      <section className="py-24 md:py-32">
        <Container>
          <RevealStagger className="grid gap-10 lg:grid-cols-3">
            {articles.map((a) => (
              <RevealItem key={a.slug}>
                <Link
                  href={`/actualites/${a.slug}`}
                  className="group block h-full overflow-hidden rounded-2xl bg-white shadow-[0_8px_28px_-12px_rgba(15,61,46,0.18)] transition hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-fir-dark">
                    <Image
                      src={`/images/articles/${a.slug}.jpg`}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover transition duration-700 ease-out-expo group-hover:scale-105"
                    />
                  </div>
                  <div className="p-7">
                    <p className="eyebrow text-gold-deep">{a.dateDisplay} · {a.readingTimeMin} min</p>
                    <h2 className="mt-4 font-display text-2xl uppercase leading-tight tracking-tight text-fir-dark">
                      {a.title}
                    </h2>
                    <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-ink/70">
                      {a.excerpt}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1 text-xs uppercase tracking-wider text-gold-deep">
                      Lire l'article
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealStagger>
        </Container>
      </section>

      <CallbackSection />
    </>
  )
}
