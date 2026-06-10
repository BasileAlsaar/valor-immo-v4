import type { Metadata } from "next"

import { PageHero } from "@/components/sections/page-hero"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { HoursBlock } from "@/components/ui/hours-block"
import { SectionTitle } from "@/components/ui/section-title"
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
            Une équipe parisienne, <span className="text-gold">des interlocuteurs confirmés.</span>
          </>
        }
        subtitle="Valor Immo est une agence indépendante d'immobilier commercial parisien. Modèle resserré : chaque dossier est traité sans relais ni apporteur intermédiaire."
        backgroundImage="/images/categories/bureaux.jpg"
      />

      <section className="bg-cream py-16 md:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-12">
            <div>
              <Eyebrow className="text-gold-deep">Pourquoi Valor Immo</Eyebrow>
              <SectionTitle as="h3" size="lg" className="mt-4">
                Un périmètre clair, sur Paris.
              </SectionTitle>
              <div aria-hidden className="my-5 h-px w-12 bg-gold" />
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-ink/85">
              <p>
                Valor Immo est une agence parisienne spécialisée sur
                l'immobilier commercial et professionnel. Un périmètre clair :
                transaction, location, gestion — sur boutiques, bureaux,
                immeubles, hôtellerie et logistique.
              </p>
            </div>
          </div>
          <div aria-hidden className="mx-auto mt-10 h-px w-16 bg-gold/40 md:mt-12" />
        </Container>
      </section>

      <section className="bg-white py-24 md:py-32">
        <Container>
          <RevealStagger className="grid gap-6 md:grid-cols-2">
            <RevealItem>
              <article className="h-full rounded-2xl border border-fir-dark/10 bg-cream p-8 md:p-10">
                <Eyebrow className="text-gold-deep">Spécialisation</Eyebrow>
                <SectionTitle as="h3" size="md" className="mt-4">
                  Une spécialisation, pas un catalogue.
                </SectionTitle>
                <div aria-hidden className="my-5 h-px w-10 bg-gold" />
                <p className="text-base leading-relaxed text-ink/80">
                  Nous ne faisons pas de résidentiel. Cette concentration est un
                  choix : elle nous donne une lecture fine du marché commercial
                  parisien et des interlocuteurs qui connaissent réellement
                  leurs typologies.
                </p>
              </article>
            </RevealItem>
            <RevealItem>
              <article className="h-full rounded-2xl border border-fir-dark/10 bg-cream p-8 md:p-10">
                <Eyebrow className="text-gold-deep">Approche</Eyebrow>
                <SectionTitle as="h3" size="md" className="mt-4">
                  Notre approche.
                </SectionTitle>
                <div aria-hidden className="my-5 h-px w-10 bg-gold" />
                <p className="text-base leading-relaxed text-ink/80">
                  Un brief précis, des biens en cible, une négociation conduite
                  sans relais. Vous parlez à la personne qui traite votre
                  dossier, du premier échange à la signature.
                </p>
              </article>
            </RevealItem>
            <RevealItem>
              <article className="h-full rounded-2xl border border-fir-dark/10 bg-cream p-8 md:p-10">
                <Eyebrow className="text-gold-deep">Réactivité</Eyebrow>
                <SectionTitle as="h3" size="md" className="mt-4">
                  Réactivité.
                </SectionTitle>
                <div aria-hidden className="my-5 h-px w-10 bg-gold" />
                <p className="text-base leading-relaxed text-ink/80">
                  Brief sous 24h ouvrées, première visite sous 48h sur les biens
                  validés ensemble. La vitesse fait partie de la valeur sur ce
                  marché.
                </p>
              </article>
            </RevealItem>
            <RevealItem>
              <article className="h-full rounded-2xl border border-fir-dark/10 bg-cream p-8 md:p-10">
                <Eyebrow className="text-gold-deep">Proximité</Eyebrow>
                <SectionTitle as="h3" size="md" className="mt-4">
                  Proximité.
                </SectionTitle>
                <div aria-hidden className="my-5 h-px w-10 bg-gold" />
                <p className="text-base leading-relaxed text-ink/80">
                  Nous assumons notre format : une agence jeune, resserrée,
                  joignable. Pas une structure de cent personnes où votre
                  dossier change de mains trois fois — un interlocuteur qui vous
                  suit.
                </p>
              </article>
            </RevealItem>
          </RevealStagger>
        </Container>
      </section>

      <section className="bg-cream py-24 md:py-32">
        <Container>
          <Eyebrow className="text-gold-deep">Direction</Eyebrow>
          <h2 className="font-display mt-6 text-[clamp(2rem,5.5vw,4.5rem)] uppercase leading-[0.95] tracking-tight text-fir-dark">
            Des interlocuteurs<br />
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
                  <dd className="mt-2">
                    <HoursBlock valueClassName="text-fir-dark" labelClassName="text-ink/55" />
                  </dd>
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
