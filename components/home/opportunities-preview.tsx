import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { RevealStagger, RevealItem } from "@/components/motion/reveal"
import { properties, STATUT_LABEL, TYPE_LABEL } from "@/lib/data/properties"
import { cn } from "@/lib/utils"

const SELECTION = ["MZ1-2026", "MZ2-2026", "MZ3-2026", "MZ5-2026"]

function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value)
}

export function OpportunitiesPreview() {
  const featured = SELECTION.map((ref) => properties.find((p) => p.ref === ref)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  )

  return (
    <section className="bg-white py-32 md:py-44 lg:py-56">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <Eyebrow className="text-gold-deep">Opportunités</Eyebrow>
            <h2 className="font-display mt-6 text-[clamp(2.25rem,6.5vw,6rem)] uppercase leading-[0.92] tracking-tight text-fir-dark">
              Nos dernières<br />
              <span className="text-gold-deep">opportunités.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70 md:text-lg">
              Sélection de biens disponibles à la location, à l'acquisition,
              ou en cession de fonds. Mise à jour hebdomadaire.
            </p>
          </div>
          <Link
            href="/opportunites"
            className="group inline-flex items-center gap-2 text-sm uppercase tracking-wider text-gold-deep hover:text-fir-dark"
          >
            Voir tout le catalogue
            <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <RevealStagger className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((p) => (
            <RevealItem key={p.ref}>
              <Link
                href={`/opportunites/${p.slug}`}
                className="group block h-full overflow-hidden rounded-2xl bg-cream transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgba(15,61,46,0.25)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-fir-dark">
                  <Image
                    src={`/images/properties/${p.slug}.jpg`}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-700 ease-out-expo group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-fir-dark/40 to-transparent" />
                  <span
                    className={cn(
                      "absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider",
                      p.statut === "vente" && "bg-gold text-ink",
                      p.statut === "location" && "bg-white text-fir-dark",
                      p.statut === "murs-libres" && "bg-fir-darker text-gold",
                    )}
                  >
                    {STATUT_LABEL[p.statut]}
                  </span>
                  <span className="absolute right-4 top-4 text-xs uppercase tracking-wider text-white/80">
                    {p.ref}
                  </span>
                  <span className="absolute bottom-3 right-3 rounded bg-black/40 px-2 py-1 text-[10px] uppercase tracking-wider text-white/80 backdrop-blur-sm">
                    Photo d'illustration
                  </span>
                </div>
                <div className="p-6">
                  <p className="eyebrow text-gold-deep">{TYPE_LABEL[p.type]}</p>
                  <h3 className="mt-3 text-lg font-medium leading-tight text-fir-dark">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink/60">
                    {p.quartier} · {p.surface} m²
                  </p>
                  <p className="mt-5 font-display text-3xl uppercase tracking-tight text-fir-dark">
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
  )
}
