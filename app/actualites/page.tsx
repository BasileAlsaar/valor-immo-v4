import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, MapPin } from "lucide-react"

import { PageHero } from "@/components/sections/page-hero"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { CallbackSection } from "@/components/sections/callback-section"
import { RevealStagger, RevealItem } from "@/components/motion/reveal"
import { ARTICLES, type Article } from "@/lib/data/articles"
import { TRANSACTIONS, type Transaction } from "@/lib/data/transactions"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Analyses du marché immobilier commercial parisien et transactions récentes Valor Immo.",
}

export default function ActualitesPage() {
  return (
    <>
      <PageHero
        eyebrow="Actualités"
        title={
          <>
            Analyses & <span className="text-gold">transactions.</span>
          </>
        }
        subtitle="Nos analyses du marché commercial parisien, et une sélection d'opérations récentes."
        backgroundImage="/images/categories/bureaux.jpg"
      />

      {/* Analyses du marché */}
      <section className="bg-cream-soft py-20 md:py-28">
        <Container>
          <div className="mb-10 md:mb-12">
            <Eyebrow className="text-gold-deep">Analyses du marché</Eyebrow>
            <h2 className="font-display mt-3 text-[clamp(1.75rem,4.5vw,3.5rem)] uppercase leading-[0.95] tracking-tight text-fir-dark">
              Lectures du moment.
            </h2>
          </div>
          <RevealStagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ARTICLES.map((a) => (
              <RevealItem key={a.slug}>
                <ArticleCard article={a} />
              </RevealItem>
            ))}
          </RevealStagger>
        </Container>
      </section>

      {/* Transactions récentes */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="mb-10 md:mb-12">
            <Eyebrow className="text-gold-deep">Transactions récentes</Eyebrow>
            <h2 className="font-display mt-3 text-[clamp(1.75rem,4.5vw,3.5rem)] uppercase leading-[0.95] tracking-tight text-fir-dark">
              Sélection d&apos;opérations.
            </h2>
          </div>
          <RevealStagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TRANSACTIONS.map((t) => (
              <RevealItem key={`${t.libelle}-${t.adresse}`}>
                <TransactionCard tx={t} />
              </RevealItem>
            ))}
          </RevealStagger>
        </Container>
      </section>

      <CallbackSection />
    </>
  )
}

/**
 * Carte article — Link complet vers /actualites/[slug].
 * Tokens alignés sur TransactionCard pour cohérence visuelle des 2 grilles.
 */
function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/actualites/${article.slug}`}
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border border-gold/40 bg-fir-dark p-7 md:p-8",
        "shadow-[0_1px_2px_rgba(10,45,34,0.04),0_12px_28px_-16px_rgba(10,45,34,0.15)]",
        "transition-[transform,box-shadow,border-color] duration-500 ease-out-expo",
        "motion-safe:hover:-translate-y-1",
        "hover:border-gold",
        "hover:shadow-[0_2px_4px_rgba(10,45,34,0.06),0_28px_60px_-24px_rgba(10,45,34,0.25)]",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span aria-hidden className="block h-px w-10 bg-gold/40 transition-[width,background-color] duration-500 ease-out-expo group-hover:w-16 group-hover:bg-gold" />
        <ArrowUpRight
          aria-hidden
          className="h-5 w-5 text-cream/40 transition-[transform,color] duration-500 ease-out-expo motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5 group-hover:text-gold"
        />
      </div>
      <p className="eyebrow mt-7 text-gold">{article.datePublication}</p>
      <h3 className="font-display mt-4 text-xl uppercase leading-tight tracking-tight text-cream md:text-2xl">
        {article.titre}
      </h3>
      <p className="mt-5 text-[15px] leading-[1.7] text-cream/80">
        {article.metaDescription}
      </p>
    </Link>
  )
}

/**
 * Vignette transaction — rounded-2xl, border-fir-dark/10, bg-white,
 * ombres multi-couches, lift au hover. Si `image` est fournie, zone
 * image en haut (aspect 16/10) ; sinon la carte est texte seul, sans
 * cadre vide.
 */
function TransactionCard({ tx }: { tx: Transaction }) {
  const hasImage = Boolean(tx.image)
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-fir-dark/10 bg-white",
        "shadow-[0_1px_2px_rgba(10,45,34,0.04),0_12px_28px_-16px_rgba(10,45,34,0.15)]",
        "transition-[transform,box-shadow,border-color] duration-500 ease-out-expo",
        "motion-safe:hover:-translate-y-1",
        "hover:border-fir-dark/20",
        "hover:shadow-[0_2px_4px_rgba(10,45,34,0.06),0_28px_60px_-24px_rgba(10,45,34,0.25)]",
      )}
    >
      {hasImage && (
        <div className="relative aspect-[16/10] overflow-hidden bg-fir-dark">
          <Image
            src={tx.image as string}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-700 ease-out-expo group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex h-full flex-col p-7 md:p-8">
        <span aria-hidden className="block h-px w-10 bg-gold/40" />
        {/* Cormorant volontaire, carte signature, ne pas migrer (DA 10/06/2026). */}
        <h2 className="font-accent mt-7 text-2xl font-bold leading-[1.1] tracking-[0.06em] text-fir-dark [font-variant-caps:all-small-caps] md:text-3xl">
          {tx.libelle.toLowerCase()}
        </h2>
        <p className="mt-5 flex items-start gap-2 text-[15px] leading-[1.7] text-ink/75">
          <MapPin
            aria-hidden
            className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep"
            strokeWidth={1.6}
          />
          <span>
            {tx.adresse}
            <br />
            {tx.arrondissement} Paris
          </span>
        </p>
      </div>
    </article>
  )
}
