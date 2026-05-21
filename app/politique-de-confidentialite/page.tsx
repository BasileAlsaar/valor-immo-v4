import type { Metadata } from "next"
import { PageHero } from "@/components/sections/page-hero"
import { Container } from "@/components/ui/container"

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité — Valor Immo.",
}

export default function ConfidentialitePage() {
  return (
    <>
      <PageHero
        eyebrow="Légal"
        title={<>Politique de <span className="text-gold">confidentialité.</span></>}
      />
      <section className="py-24">
        <Container>
          <div className="prose-editorial mx-auto max-w-3xl">
            <h2 className="font-display mt-0 text-3xl uppercase tracking-tight text-fir-dark">Responsable du traitement</h2>
            <p>
              Valor Immo, 96 Rue Boileau, 75016 Paris, agit en tant que responsable du
              traitement des données personnelles collectées via ce site.
            </p>
            <h2 className="font-display text-3xl uppercase tracking-tight text-fir-dark">Données collectées</h2>
            <p>
              Les données collectées via le formulaire de contact (nom, email, téléphone,
              message) sont utilisées exclusivement pour répondre à votre demande, dans
              le cadre de l'exécution de mesures précontractuelles à votre initiative.
            </p>
            <h2 className="font-display text-3xl uppercase tracking-tight text-fir-dark">Durée de conservation</h2>
            <p>
              Les données sont conservées pendant la durée nécessaire au traitement de
              votre demande, augmentée de la durée légale de prescription applicable
              (5 ans pour les actions commerciales).
            </p>
            <h2 className="font-display text-3xl uppercase tracking-tight text-fir-dark">Vos droits</h2>
            <p>
              Conformément au RGPD, vous disposez d'un droit d'accès, de rectification,
              d'effacement, de portabilité et d'opposition. Pour exercer ces droits,
              écrivez à contact1valorimmo@gmail.com.
            </p>
            <p>
              Vous pouvez également introduire une réclamation auprès de la CNIL
              (cnil.fr).
            </p>
            <h2 className="font-display text-3xl uppercase tracking-tight text-fir-dark">Cookies</h2>
            <p>
              Voir notre <a href="/gestion-des-cookies" className="text-gold-deep underline">page dédiée à la gestion des cookies</a>.
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}
