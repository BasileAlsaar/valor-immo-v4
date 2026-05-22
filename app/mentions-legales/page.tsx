import type { Metadata } from "next"
import { PageHero } from "@/components/sections/page-hero"
import { Container } from "@/components/ui/container"

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales — Valor Immo.",
}

export default function MentionsLegalesPage() {
  return (
    <>
      <PageHero
        eyebrow="Légal"
        title={<>Mentions <span className="text-gold">légales.</span></>}
      />
      <section className="py-24">
        <Container>
          <div className="prose-editorial mx-auto max-w-3xl">
            <h2 className="font-display mt-0 text-3xl uppercase tracking-tight text-fir-dark">Éditeur du site</h2>
            <p>
              Valor Immo<br />
              96 Rue Boileau, 75016 Paris<br />
              Téléphone : 07 67 86 34 61<br />
              Email : contact1valorimmo@gmail.com
            </p>
            <p className="text-sm text-ink/60">
              [SIRET / RCS / Capital social — À FOURNIR]
            </p>
            <h2 className="font-display text-3xl uppercase tracking-tight text-fir-dark">Carte professionnelle Hoguet</h2>
            <p>
              Carte T en cours d'obtention — délivrée par la CCI Paris Île-de-France<br />
              Garantie financière : en cours de souscription
            </p>
            <h2 className="font-display text-3xl uppercase tracking-tight text-fir-dark">Directeur de publication</h2>
            <p>[Nom et qualité — À FOURNIR]</p>
            <h2 className="font-display text-3xl uppercase tracking-tight text-fir-dark">Hébergement</h2>
            <p>
              Vercel Inc.<br />
              340 S Lemon Ave #4133, Walnut, CA 91789, USA
            </p>
            <h2 className="font-display text-3xl uppercase tracking-tight text-fir-dark">Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu présent sur ce site (textes, logos, images, vidéos)
              est protégé par le droit d'auteur. Toute reproduction, totale ou partielle,
              est interdite sans autorisation préalable écrite.
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}
