import type { Metadata } from "next"
import { PageHero } from "@/components/sections/page-hero"
import { CallbackSection } from "@/components/sections/callback-section"
import { OpportunitiesPreview } from "@/components/home/opportunities-preview"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { CtaPill } from "@/components/ui/cta-pill"
import { RevealStagger, RevealItem } from "@/components/motion/reveal"

export const metadata: Metadata = {
  title: "Vente — Immobilier commercial Paris",
  description:
    "Vente de boutiques, immeubles, bureaux, hôtels et fonds de commerce à Paris. Accompagnement complet du brief à la signature notariée.",
}

const CATEGORIES = [
  {
    titre: "Murs commerciaux libres",
    text: "Le local est vendu sans locataire en place. L'acquéreur récupère la pleine jouissance du bien : exploitation directe ou nouvelle mise en location.",
  },
  {
    titre: "Murs commerciaux occupés",
    text: "Le local est vendu avec son bail en cours. L'acquéreur perçoit immédiatement un loyer ; la valeur se lit au rendement et à la qualité du locataire.",
  },
  {
    titre: "Immeubles",
    text: "Monopropriétés, immeubles mixtes commerce/habitation, lots de copropriété. Logique d'investissement patrimonial et de rendement global.",
  },
  {
    titre: "Hôtels",
    text: "Murs et fonds d'hôtels indépendants, boutique-hôtels, résidences urbaines. Transmission, valorisation patrimoniale ou repositionnement.",
  },
  {
    titre: "Bureaux",
    text: "Plateaux, sièges sociaux, surfaces divisibles. Acquisition pour occupation propre ou placement.",
  },
  {
    titre: "Actifs logistiques",
    text: "Entrepôts, locaux d'activité, stockage urbain et dernier kilomètre. Marché tendu, rendements stables.",
  },
] as const

export default function VentePage() {
  return (
    <>
      <PageHero
        eyebrow="Vente"
        title={
          <>
            Cession et acquisition <span className="text-gold">d'actifs commerciaux.</span>
          </>
        }
        subtitle="Boutiques pied d'immeuble, immeubles mixtes, fonds de commerce CHR, plateaux de bureaux : nous accompagnons cédants et acquéreurs sur tout le cycle, depuis le brief jusqu'à la signature notariée."
        backgroundImage="/images/categories/immeubles.jpg"
      />

      <section className="bg-cream py-24 md:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[2fr_3fr]">
            <div className="lg:sticky lg:top-[120px] lg:self-start">
              <Eyebrow className="text-gold-deep">Périmètre</Eyebrow>
              <h3 className="font-accent mt-4 text-[clamp(2rem,3vw,2.75rem)] italic leading-[1.05] text-fir-dark">
                Six catégories, six logiques de valeur.
              </h3>
              <div aria-hidden className="my-6 h-px w-12 bg-gold" />
              <p className="max-w-[36ch] text-[15px] leading-relaxed text-fir-dark/70 md:text-base">
                Valor Immo intervient sur l'ensemble des actifs commerciaux et
                professionnels, à la vente comme à l'acquisition. Chaque
                catégorie répond à une logique de valeur et de marché distincte
                — voici ce que nous traitons.
              </p>
              <div className="mt-8">
                <CtaPill href="/contact" variant="fir" size="md">
                  Démarrer mon projet
                </CtaPill>
              </div>
            </div>
            <RevealStagger className="grid gap-6 md:grid-cols-2">
              {CATEGORIES.map((c) => (
                <RevealItem key={c.titre}>
                  <div className="h-full rounded-2xl border border-fir-dark/10 bg-white p-6 md:p-7">
                    <h4 className="text-base font-medium uppercase tracking-tight text-fir-dark md:text-lg">
                      {c.titre}
                    </h4>
                    <p className="mt-3 text-sm leading-relaxed text-ink/75">{c.text}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealStagger>
          </div>
        </Container>
      </section>

      <OpportunitiesPreview />
      <CallbackSection />
    </>
  )
}
