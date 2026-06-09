import type { Metadata } from "next"
import Image from "next/image"
import { MapPin } from "lucide-react"

import { PageHero } from "@/components/sections/page-hero"
import { Container } from "@/components/ui/container"
import { CallbackSection } from "@/components/sections/callback-section"
import { RevealStagger, RevealItem } from "@/components/motion/reveal"
import { TRANSACTIONS, type Transaction } from "@/lib/data/transactions"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Transactions récentes Valor Immo — immobilier commercial et professionnel parisien.",
}

export default function ActualitesPage() {
  return (
    <>
      <PageHero
        eyebrow="Actualités"
        title={
          <>
            Transactions <span className="text-gold">récentes.</span>
          </>
        }
        subtitle="Une sélection d'opérations à Paris."
        backgroundImage="/images/categories/bureaux.jpg"
      />

      <section className="py-24 md:py-32">
        <Container>
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
 * Carte transaction — tokens alignés sur SectionCard (rounded-2xl,
 * border-fir-dark/10, bg-white, ombres multi-couches, lift au hover).
 * Si `image` est fournie, zone image en haut (aspect 16/10) ; sinon
 * la carte est texte seul, sans cadre vide.
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
