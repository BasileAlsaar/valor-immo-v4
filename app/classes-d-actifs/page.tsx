import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

import { PageHero } from "@/components/sections/page-hero"
import { Container } from "@/components/ui/container"
import { CallbackSection } from "@/components/sections/callback-section"
import { RevealStagger, RevealItem } from "@/components/motion/reveal"
import { CATEGORIES } from "@/lib/data/categories"

export const metadata: Metadata = {
  title: "Classes d'actifs — Immobilier commercial Paris",
  description:
    "Locaux commerciaux, bureaux, hôtellerie & restauration, immeubles, entrepôts, cession de droit au bail. Six expertises sectorielles pour traiter chaque typologie d'actif.",
}

const DESCRIPTIONS: Record<string, string> = {
  "locaux-commerciaux":
    "Boutiques pied d'immeuble, restauration, services, concept stores — emplacements n°1 à 2 sur les axes commerçants parisiens et baux 3/6/9 négociés au facial et à l'économique.",
  bureaux:
    "Plateaux haussmanniens divisibles, sièges sociaux, espaces flex tertiaires, certifications environnementales — QCA, 9ᵉ Haussmann et nouveaux quartiers d'affaires.",
  "hotellerie-restauration":
    "Murs et fonds d'hôtels, brasseries, restaurants gastronomiques, bars à concept — licence IV, extraction certifiée, autorisation d'occupation du domaine public.",
  immeubles:
    "Immeubles mixtes commerce-habitation, monopropriétés haussmanniennes, lots de copropriété — investissement patrimonial, marchand de biens, foncière.",
  "entrepots-logistique":
    "Stockage urbain, dernier kilomètre, locaux d'activité, plateformes logistiques — Paris intra-muros et Île-de-France pour les opérateurs e-commerce et messagerie.",
  "cession-droit-au-bail":
    "Reprise de bail commercial, cession de fonds CHR, négociation déspécialisation — accompagnement fiscal et juridique du cédant comme du repreneur.",
}

export default function ClassesActifsPage() {
  return (
    <>
      <PageHero
        eyebrow="Classes d'actifs"
        title={
          <>
            Six typologies, <span className="text-gold">une seule discipline.</span>
          </>
        }
        subtitle="Chaque classe d'actif a son vocabulaire, sa fiscalité et son réseau d'acteurs. Nos interlocuteurs confirmés couvrent les six segments du marché commercial parisien sans relais."
        backgroundImage="/images/categories/locaux-commerciaux.jpg"
      />

      <section className="py-32 md:py-44">
        <Container>
          <RevealStagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat, i) => (
              <RevealItem key={cat.slug}>
                <Link
                  href={cat.href}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-fir-dark"
                >
                  <Image
                    src={`/images/categories/${cat.slug}.jpg`}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-700 ease-out-expo group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-fir-darker/95 via-fir-dark/55 to-fir-dark/15" />
                  <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
                    <span className="eyebrow text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h2 className="font-display text-3xl uppercase leading-tight tracking-tight md:text-4xl">
                        {cat.label}
                      </h2>
                      <p className="mt-4 text-sm leading-relaxed opacity-85">
                        {DESCRIPTIONS[cat.slug]}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-gold">
                        Découvrir
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
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
