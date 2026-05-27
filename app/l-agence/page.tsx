import type { Metadata } from "next"

import { PageHero } from "@/components/sections/page-hero"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { CallbackSection } from "@/components/sections/callback-section"
import { MethodSection } from "@/components/home/method-section"
import { RevealStagger, RevealItem } from "@/components/motion/reveal"
import { team } from "@/lib/data/team"

export const metadata: Metadata = {
  title: "L'agence",
  description:
    "Valor Immo, agence indépendante d'immobilier commercial parisien. 96 Rue Boileau 75016 Paris.",
}

export default function AgencePage() {
  return (
    <>
      <PageHero
        eyebrow="L'agence"
        title={
          <>
            Une équipe parisienne, <span className="text-gold">un interlocuteur confirmé.</span>
          </>
        }
        subtitle="Valor Immo est une agence indépendante d'immobilier commercial parisien. Modèle resserré : chaque dossier est traité sans relais ni apporteur intermédiaire."
        backgroundImage="/images/categories/bureaux.jpg"
      />

      <section className="py-24 md:py-32">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-12">
            <div>
              <Eyebrow className="text-gold-deep">Qui sommes-nous ?</Eyebrow>
              <h3 className="font-accent mt-4 text-[clamp(2rem,3vw,2.75rem)] italic leading-[1.05] text-fir-dark">
                Une équipe resserrée, deux interlocuteurs confirmés.
              </h3>
              <div aria-hidden className="my-6 h-px w-12 bg-gold" />
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-ink/85">
              <p>
                Valor Immo accompagne opérateurs commerciaux, restaurateurs,
                investisseurs patrimoniaux et family offices sur l'ensemble du marché
                parisien et d'Île-de-France : boutiques pied d'immeuble, bureaux
                haussmanniens, hôtellerie-restauration, immeubles mixtes, logistique
                urbaine, transmission d'établissements.
              </p>
              <p>
                Notre modèle est délibérément resserré : un interlocuteur confirmé
                par dossier, du premier appel à la signature notariée. Pas de
                sous-traitance, pas de centre d'appels, pas de relais.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-cream py-24 md:py-32">
        <Container>
          <Eyebrow className="text-gold-deep">Direction</Eyebrow>
          <h2 className="font-display mt-6 text-[clamp(2rem,5.5vw,4.5rem)] uppercase leading-[0.95] tracking-tight text-fir-dark">
            Deux interlocuteurs<br />
            <span className="text-gold-deep">confirmés.</span>
          </h2>

          <RevealStagger className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2">
            {team.map((m) => (
              <RevealItem key={m.name}>
                <article className="group h-full overflow-hidden rounded-2xl bg-white shadow-[0_8px_28px_-12px_rgba(15,61,46,0.18)]">
                  <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-fir-dark">
                    <span
                      aria-hidden
                      className="font-display text-[clamp(4rem,10vw,8rem)] uppercase leading-none tracking-tight text-gold/80"
                    >
                      {m.initials}
                    </span>
                  </div>
                  <div className="p-8">
                    <p className="eyebrow text-gold-deep">{m.role}</p>
                    <h3 className="mt-3 font-display text-2xl uppercase leading-tight tracking-tight text-fir-dark md:text-3xl">
                      {m.name}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-ink/70 md:text-base">{m.expertise}</p>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealStagger>
        </Container>
      </section>

      <MethodSection />

      <section className="bg-white py-24 md:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow className="text-gold-deep">Carte professionnelle</Eyebrow>
              <h2 className="font-display mt-4 text-3xl uppercase leading-tight tracking-tight text-fir-dark">
                Conformité loi Hoguet
              </h2>
              <p className="mt-6 leading-relaxed text-ink/80">
                Valor Immo est titulaire de la carte professionnelle Transaction (T)
                délivrée par la CCI de Paris Île-de-France, en application de la loi
                Hoguet du 2 janvier 1970. L'activité de location et transaction sur
                immeubles et fonds de commerce est exercée sous garantie financière.
              </p>
              <p className="mt-4 text-sm text-ink/60">
                Carte T en cours d'obtention — délivrée par la CCI Paris Île-de-France
                <br />
                Garantie financière : en cours de souscription
              </p>
            </div>
            <div className="rounded-3xl bg-cream p-10">
              <Eyebrow className="text-gold-deep">Coordonnées</Eyebrow>
              <dl className="mt-8 space-y-5">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-ink/50">Adresse</dt>
                  <dd className="mt-1 text-lg text-fir-dark">96 Rue Boileau, 75016 Paris</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-ink/50">Téléphone</dt>
                  <dd className="mt-1 text-lg text-fir-dark">07 67 86 34 61</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-ink/50">Email</dt>
                  <dd className="mt-1 text-lg text-fir-dark">contact1valorimmo@gmail.com</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-ink/50">Horaires</dt>
                  <dd className="mt-1 text-sm text-ink/70">Lun-Ven 09:00 – 19:00 · Sam : Fermé · Dim : Fermé</dd>
                </div>
              </dl>
            </div>
          </div>
        </Container>
      </section>

      <CallbackSection />
    </>
  )
}
