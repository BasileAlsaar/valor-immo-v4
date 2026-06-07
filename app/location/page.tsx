import type { Metadata } from "next"
import { PageHero } from "@/components/sections/page-hero"
import { CallbackSection } from "@/components/sections/callback-section"
import { OpportunitiesPreview } from "@/components/home/opportunities-preview"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { SectionCard } from "@/components/ui/section-card"
import { RevealStagger, RevealItem } from "@/components/motion/reveal"

export const metadata: Metadata = {
  title: "Location — Immobilier commercial Paris",
  description:
    "Location de locaux commerciaux, plateaux de bureaux, entrepôts et murs d'exploitation. Baux 3/6/9 tertiaires et commerciaux à Paris.",
}

const CIBLES = [
  {
    titre: "Une boutique",
    text: "Emplacement n°1 à 2, avec ou sans extraction, façade d'angle.",
  },
  {
    titre: "Un restaurant",
    text: "Locaux avec extraction, conformité, terrasse le cas échéant.",
  },
  {
    titre: "Des bureaux",
    text: "Du poste isolé au plateau, haussmannien ou récent.",
  },
  {
    titre: "Un local d'activité",
    text: "Artisanat, atelier, petite production.",
  },
  {
    titre: "Un actif logistique",
    text: "Stockage, dernier kilomètre, Île-de-France.",
  },
] as const

export default function LocationPage() {
  return (
    <>
      <PageHero
        eyebrow="Location"
        title={
          <>
            Trouver l'emplacement <span className="text-gold">qui fait la signature.</span>
          </>
        }
        subtitle="Baux commerciaux 3/6/9, baux tertiaires, prises à bail flagship. Nous négocions chaque clause — franchise, paliers, déspécialisation, autorisations — pour ancrer durablement votre activité."
        backgroundImage="/images/categories/locaux-commerciaux.jpg"
      />

      <section className="bg-cream py-24 md:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[2fr_3fr]">
            <div className="lg:sticky lg:top-[120px] lg:self-start">
              <Eyebrow className="text-gold-deep">Cibles</Eyebrow>
              <h3 className="font-accent mt-4 text-[clamp(2rem,3vw,2.75rem)] italic leading-[1.05] text-fir-dark">
                Ce que nous vous aidons à trouver.
              </h3>
              <div aria-hidden className="my-6 h-px w-12 bg-gold" />
              <p className="max-w-[36ch] text-[15px] leading-relaxed text-fir-dark/70 md:text-base">
                Vous cherchez un emplacement. Nous le cadrons avec vous, puis
                nous ne vous montrons que des biens en cible — pas de visite
                hors sujet.
              </p>
            </div>
            <RevealStagger className="grid gap-6 md:grid-cols-2">
              {CIBLES.map((c) => (
                <RevealItem key={c.titre}>
                  <SectionCard title={c.titre} description={c.text} />
                </RevealItem>
              ))}
            </RevealStagger>
          </div>
        </Container>
      </section>

      <section className="bg-white py-24 md:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[2fr_3fr] lg:items-start">
            <div>
              <Eyebrow className="text-gold-deep">Accompagnement</Eyebrow>
              <h3 className="font-accent mt-4 text-[clamp(2rem,3vw,2.75rem)] italic leading-[1.05] text-fir-dark">
                Du brief à la prise de possession.
              </h3>
              <div aria-hidden className="my-6 h-px w-12 bg-gold" />
            </div>
            <div>
              <p className="max-w-2xl text-base leading-relaxed text-ink/80 md:text-lg">
                Définition du besoin, sélection sur cible, visites, négociation
                du bail et des conditions, jusqu'à la prise de possession. Un
                interlocuteur unique, confirmé, du brief à la signature.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <OpportunitiesPreview />
      <CallbackSection />
    </>
  )
}
