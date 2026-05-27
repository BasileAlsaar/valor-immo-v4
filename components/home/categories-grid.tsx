import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { RevealStagger, RevealItem } from "@/components/motion/reveal"
import { cn } from "@/lib/utils"
import { CATEGORIES } from "@/lib/data/categories"

const DESCRIPTIONS: Record<string, string> = {
  "locaux-commerciaux":
    "Boutiques, restauration, services. Emplacements n°1 à 2, baux 3/6/9 ou cessions de fonds.",
  bureaux:
    "Plateaux haussmanniens divisibles, sièges sociaux, certifications BREEAM. QCA et 9ᵉ Haussmann.",
  "hotellerie-restauration":
    "Murs et fonds d'hôtels, brasseries, restaurants gastronomiques. Licence IV, extraction.",
  immeubles:
    "Mixtes commerce/habitation, monopropriétés, lots de copropriété. Investissement patrimonial.",
  "entrepots-logistique":
    "Stockage urbain, dernier kilomètre, locaux d'activité. Île-de-France.",
  "cession-droit-au-bail":
    "Reprise de bail, cession de fonds CHR. Optimisation fiscale et négociation bailleur.",
}

export function CategoriesGrid() {
  return (
    <section id="categories" className="relative bg-cream py-16 md:py-20 lg:py-24">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow className="text-gold-deep">Nos commerces disponibles</Eyebrow>
            <h2 className="font-display mt-3 text-[clamp(1.75rem,4.5vw,4rem)] uppercase leading-[0.95] tracking-tight text-fir-dark">
              Explorez par typologie d'actif
            </h2>
          </div>
          <Link
            href="/opportunites"
            className="group inline-flex items-center gap-2 text-sm uppercase tracking-wider text-gold-deep hover:text-fir-dark"
          >
            Voir tout le catalogue
            <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <RevealStagger className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <RevealItem key={cat.slug}>
              <Link
                href={cat.href}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-fir-dark"
              >
                {/* Image placeholder — fallback fir + overlay. À remplacer par Pexels. */}
                <Image
                  src={`/images/categories/${cat.slug}.jpg`}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-700 ease-out-expo group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-fir-darker/95 via-fir-dark/55 to-fir-dark/15 transition group-hover:from-fir-darker/90" />

                <div className="absolute inset-0 flex flex-col justify-between p-7 text-white md:p-9">
                  <span className="eyebrow text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] uppercase leading-[0.95] tracking-tight">
                      {cat.label}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed opacity-85">
                      {DESCRIPTIONS[cat.slug] ?? cat.accroche}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-gold">
                      Découvrir
                      <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>
      </Container>
    </section>
  )
}
