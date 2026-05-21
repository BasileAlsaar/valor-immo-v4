import type { Metadata } from "next"
import { PageHero } from "@/components/sections/page-hero"
import { Container } from "@/components/ui/container"

export const metadata: Metadata = {
  title: "Gestion des cookies",
  description: "Gestion des cookies — Valor Immo.",
}

export default function CookiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Légal"
        title={<>Gestion des <span className="text-gold">cookies.</span></>}
      />
      <section className="py-24">
        <Container>
          <div className="prose-editorial mx-auto max-w-3xl">
            <h2 className="font-display mt-0 text-3xl uppercase tracking-tight text-fir-dark">À propos des cookies</h2>
            <p>
              Notre site utilise des cookies pour assurer son bon fonctionnement
              technique. À ce stade, aucun cookie de mesure d'audience, de marketing
              ou de tiers n'est déposé sans votre consentement.
            </p>
            <h2 className="font-display text-3xl uppercase tracking-tight text-fir-dark">Cookies techniques (obligatoires)</h2>
            <p>
              Ces cookies sont strictement nécessaires au fonctionnement du site
              (préférences d'affichage, validation de formulaire). Ils ne contiennent
              aucune donnée à caractère personnel.
            </p>
            <h2 className="font-display text-3xl uppercase tracking-tight text-fir-dark">Cookies d'analyse (optionnels)</h2>
            <p>
              Si nous activons à l'avenir des cookies de mesure d'audience (type Plausible,
              Matomo ou Google Analytics), votre consentement explicite sera recueilli via
              un bandeau de consentement conforme à la délibération CNIL n° 2020-091.
            </p>
            <h2 className="font-display text-3xl uppercase tracking-tight text-fir-dark">Modifier vos préférences</h2>
            <p>
              Vous pourrez à tout moment modifier ou retirer votre consentement en
              utilisant les paramètres de cookies de votre navigateur.
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}
