import type { Metadata } from "next"
import { Mail } from "lucide-react"

import { CallbackSection } from "@/components/sections/callback-section"
import { PageHero } from "@/components/sections/page-hero"
import { CommerceCard } from "@/components/commerces/commerce-card"
import { Container } from "@/components/ui/container"
import { CtaPill } from "@/components/ui/cta-pill"
import { Eyebrow } from "@/components/ui/eyebrow"
import { listPubliableProperties } from "@/lib/apimo"

// Revalidation ISR : le flux Apimo est mis à jour une à quelques fois par
// jour côté agence. 1h est un compromis entre fraîcheur et charge sur l'API
// Apimo (rate-limitée). À réduire si un besoin de temps réel apparaît.
export const revalidate = 3600

export const metadata: Metadata = {
  title: "Commerces à louer et à céder",
  description:
    "Sélection de locaux commerciaux, fonds de commerce et droits au bail. Location et cession, mise à jour toutes les heures.",
}

export default async function CommercesPage() {
  const { publishable } = await listPubliableProperties()

  return (
    <>
      <PageHero
        eyebrow="Commerces"
        title={
          <>
            Locaux et fonds <span className="text-gold">disponibles.</span>
          </>
        }
        backgroundImage="/images/categories/locaux-commerciaux.jpg"
      />

      <section
        id="resultats"
        className="scroll-mt-24 bg-cream py-12 md:py-16"
      >
        <Container>
          <div className="mb-8">
            <Eyebrow className="text-gold-deep">Sélection en cours</Eyebrow>
            <p className="mt-2 text-sm text-ink/60">
              {publishable.length === 0
                ? "Aucun bien publié pour le moment."
                : `${publishable.length} bien${publishable.length > 1 ? "s" : ""} · flux mis à jour toutes les heures.`}
            </p>
          </div>

          {publishable.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {publishable.map((p, i) => (
                <CommerceCard key={p.id} property={p} priority={i < 3} />
              ))}
            </div>
          )}
        </Container>
      </section>

      <CallbackSection />
    </>
  )
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-fir-dark/10 bg-white p-12 text-center shadow-[0_8px_28px_-12px_rgba(15,61,46,0.10)]">
      <Eyebrow className="text-gold-deep">Aucun bien publié</Eyebrow>
      <h2 className="font-display mt-4 text-2xl uppercase leading-tight tracking-tight text-fir-dark md:text-3xl">
        Le catalogue est temporairement vide.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm text-ink/70">
        De nouvelles opportunités sont ajoutées régulièrement. Contactez notre
        équipe pour être informé en priorité des prochaines mises en location
        ou en cession.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <CtaPill href="/contact" variant="fir" size="md">
          <Mail className="h-4 w-4" /> Nous contacter
        </CtaPill>
      </div>
    </div>
  )
}
