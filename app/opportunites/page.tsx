import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

import { PageHero } from "@/components/sections/page-hero"
import { CallbackSection } from "@/components/sections/callback-section"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import {
  properties,
  STATUT_LABEL,
  TYPE_LABEL,
} from "@/lib/data/properties"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Opportunités — Catalogue",
  description:
    "Catalogue des biens commerciaux disponibles à la location, à l'acquisition ou en cession de fonds à Paris.",
}

function formatPrice(v: number) {
  return new Intl.NumberFormat("fr-FR").format(v)
}

export default function OpportunitesPage() {
  return (
    <>
      <PageHero
        eyebrow="Opportunités"
        title={
          <>
            Catalogue des biens <span className="text-gold">disponibles.</span>
          </>
        }
        subtitle="Mise à jour hebdomadaire. Chaque opportunité est validée avant publication, avec accès direct à la pièce maîtresse : bail, plan, baux comparables, simulation."
        backgroundImage="/images/categories/locaux-commerciaux.jpg"
      />

      <section className="py-20 md:py-28">
        <Container>
          <div className="flex flex-wrap items-baseline gap-6">
            <Eyebrow className="text-gold-deep">{properties.length} biens disponibles</Eyebrow>
            <p className="text-sm text-ink/60">Photos d'illustration — consultable sur rendez-vous.</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <Link
                key={p.ref}
                href={`/opportunites/${p.slug}`}
                className="group block h-full overflow-hidden rounded-2xl bg-white shadow-[0_8px_28px_-12px_rgba(15,61,46,0.18)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgba(15,61,46,0.25)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-fir-dark">
                  <Image
                    src={`/images/properties/${p.slug}.jpg`}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-700 ease-out-expo group-hover:scale-105"
                  />
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
                  <h2 className="mt-3 text-lg font-medium leading-tight text-fir-dark">{p.title}</h2>
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
            ))}
          </div>
        </Container>
      </section>

      <CallbackSection />
    </>
  )
}
