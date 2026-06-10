import type { Metadata } from "next"
import { PageHero } from "@/components/sections/page-hero"
import { CallbackSection } from "@/components/sections/callback-section"
import { OpportunitiesPreview } from "@/components/home/opportunities-preview"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { SectionCard } from "@/components/ui/section-card"
import { SectionTitle } from "@/components/ui/section-title"
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
              <SectionTitle as="h3" size="md" className="mt-4">
                Ce que nous vous aidons à trouver.
              </SectionTitle>
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

      <section className="bg-cream-soft py-20 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[2fr_3fr] lg:items-start">
            <div>
              <Eyebrow className="text-gold-deep">Accompagnement</Eyebrow>
              <SectionTitle as="h3" size="md" className="mt-4">
                Du brief à la prise de possession.
              </SectionTitle>
              <div aria-hidden className="my-6 h-px w-12 bg-gold" />
            </div>
            <RevealStagger className="grid gap-8 sm:grid-cols-2 sm:gap-x-10">
              {[
                {
                  num: "01",
                  titre: "Brief",
                  text: "Surface, emplacement, activité, budget. Cadrage précis.",
                },
                {
                  num: "02",
                  titre: "Sélection",
                  text: "Biens en cible uniquement, pas de visite hors sujet.",
                },
                {
                  num: "03",
                  titre: "Visites & négociation",
                  text: "Sur les biens validés, conditions et bail négociés.",
                },
                {
                  num: "04",
                  titre: "Signature",
                  text: "Jusqu'à la prise de possession, interlocuteur unique.",
                },
              ].map((step) => (
                <RevealItem key={step.num}>
                  <div className="border-t-2 border-gold/30 pt-5">
                    <p className="font-display text-[clamp(2.25rem,4vw,3.5rem)] leading-[0.85] text-gold">
                      {step.num}
                    </p>
                    <h4 className="mt-3 text-sm font-medium uppercase tracking-tight text-fir-dark md:text-base">
                      {step.titre}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-ink/75">
                      {step.text}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealStagger>
          </div>
          <div aria-hidden className="mx-auto mt-16 h-px w-16 bg-gold/40 md:mt-20" />
        </Container>
      </section>

      <OpportunitiesPreview />
      <CallbackSection />
    </>
  )
}
