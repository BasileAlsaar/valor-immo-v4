import type { Metadata } from "next"

import { PageHero } from "@/components/sections/page-hero"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactMap } from "@/components/contact/contact-map"
import { SITE } from "@/lib/site"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Valor Immo · 96 Rue Boileau 75016 Paris · 07 67 86 34 61 · contact1valorimmo@gmail.com. Réponse sous 24h ouvrées.",
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Parlons de votre <span className="text-gold">projet.</span>
          </>
        }
        subtitle="Réponse sous 24h ouvrées. Un interlocuteur unique, du premier appel à la signature. Pas de mise en attente, pas de centre d'appels."
        backgroundImage="/images/categories/bureaux.jpg"
      />

      <section className="py-24 md:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-3xl bg-white p-8 shadow-[0_8px_28px_-12px_rgba(15,61,46,0.18)] md:p-12">
              <Eyebrow className="text-gold-deep">Formulaire</Eyebrow>
              <h2 className="font-display mt-4 text-3xl uppercase leading-tight tracking-tight text-fir-dark">
                Décrivez votre projet
              </h2>
              <p className="mt-3 text-sm text-ink/60">
                Surface, emplacement, activité, budget, échéance. Plus le brief est
                précis, plus la réponse est rapide.
              </p>
              <ContactForm className="mt-8" />
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl bg-fir-dark p-8 text-white">
                <Eyebrow className="text-gold">Coordonnées</Eyebrow>
                <ul className="mt-8 space-y-5">
                  <li className="flex items-start gap-4">
                    <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wider opacity-60">Adresse</p>
                      <p className="mt-1">
                        {SITE.address.line1}
                        <br />
                        {SITE.address.line2}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                      <Phone className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wider opacity-60">Téléphone</p>
                      <a href={`tel:${SITE.telephoneTel}`} className="mt-1 inline-block hover:text-gold">
                        {SITE.telephoneDisplay}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wider opacity-60">Email</p>
                      <a href={`mailto:${SITE.email}`} className="mt-1 inline-block hover:text-gold">
                        {SITE.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                      <Clock className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wider opacity-60">Horaires</p>
                      <p className="mt-1 text-sm opacity-90">{SITE.hours.full}</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="overflow-hidden rounded-3xl">
                <ContactMap />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
