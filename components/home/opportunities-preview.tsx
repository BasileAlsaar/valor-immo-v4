import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Badge } from "@/components/ui/badge"
import { RevealStagger, RevealItem } from "@/components/motion/reveal"
import { PropertyCarousel } from "@/components/ui/property-carousel"
import { listPubliableProperties } from "@/lib/apimo"
import { toDisplayProperty, type DisplayProperty } from "@/lib/apimo/to-display"
import { STATUT_LABEL, TYPE_LABEL } from "@/lib/property-labels"

// Nombre maximal de biens montrés dans le carousel marquee. Design
// inchangé (marquee défile en boucle). Si < FEATURE_COUNT biens
// disponibles, le carousel se contente d'afficher ceux qui sont là.
const FEATURE_COUNT = 4

const NF = new Intl.NumberFormat("fr-FR")

function formatDisplayPrice(p: DisplayProperty): string {
  if (p.loyerMensuel != null) {
    const suffix = p.period ? `/${p.period.toLowerCase()}` : ""
    return `${NF.format(p.loyerMensuel)} €${suffix}`
  }
  if (p.prix != null) return `${NF.format(p.prix)} €`
  return "Sur demande"
}

export async function OpportunitiesPreview() {
  const { publishable } = await listPubliableProperties()
  const featured = publishable.slice(0, FEATURE_COUNT).map(toDisplayProperty)

  // Aucun bien publiable → on ne rend PAS la section (pas de placeholder
  // qui ferait tache sur la home). L'espace suivant (IntentionBlock)
  // prend le relai naturellement.
  if (featured.length === 0) return null

  return (
    <section
      id="opportunites"
      className="scroll-mt-[calc(var(--header-offset)+1.5rem)] bg-white pt-8 pb-24 md:pt-10 md:pb-32 lg:pt-10 lg:pb-40"
    >
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

        <RevealStagger className="mt-16">
          <RevealItem>
            <PropertyCarousel
              ariaLabel="Sélection d'opportunités à la une"
              itemClassName="w-80 md:w-[320px]"
            >
              {featured.map((p) => {
                const photo = p.photos?.[0]
                const statusTone: "gold" | "neutral" | "green" =
                  p.statut === "vente"
                    ? "gold"
                    : p.statut === "murs-libres"
                      ? "green"
                      : "neutral"
                return (
                  <Link
                    key={p.ref}
                    href={`/commerces/${p.slug}`}
                    className="group flex flex-col h-full overflow-hidden rounded-2xl bg-cream transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgba(15,61,46,0.25)]"
                  >
                    <div className="relative aspect-[4/5] md:aspect-[4/3] overflow-hidden bg-fir-dark">
                      {photo ? (
                        <Image
                          src={photo}
                          alt=""
                          fill
                          sizes="320px"
                          className="object-cover transition duration-700 ease-out-expo group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white/60">
                          <span className="eyebrow">Photo à venir</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-fir-dark/40 to-transparent" />
                      <Badge
                        variant="status"
                        tone={statusTone}
                        className="absolute left-4 top-4"
                      >
                        {STATUT_LABEL[p.statut]}
                      </Badge>
                      <Badge variant="ref" tone="dark" className="absolute right-4 top-4">
                        {p.ref}
                      </Badge>
                    </div>
                    <div className="p-4 md:p-6 flex flex-1 flex-col">
                      <p className="eyebrow text-gold-deep">{TYPE_LABEL[p.type]}</p>
                      <h3 className="mt-3 text-lg font-medium leading-tight text-fir-dark">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-sm text-ink/60">
                        {p.quartier && p.quartier !== p.ville
                          ? `${p.quartier} · ${p.surface} m²`
                          : `${p.ville} · ${p.surface} m²`}
                      </p>
                      <p className="mt-4 md:mt-auto md:pt-5 font-display text-3xl uppercase tracking-tight text-fir-dark">
                        {formatDisplayPrice(p)}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </PropertyCarousel>
          </RevealItem>
        </RevealStagger>
      </Container>
    </section>
  )
}
