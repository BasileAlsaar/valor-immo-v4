import type { Metadata } from "next"
import { Clock, Mail, MapPin, Phone } from "lucide-react"

import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { ContactForm } from "@/components/contact-form/ContactForm"
import { ContactMap } from "@/components/contact/contact-map"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Valor Immo · 96 Rue Boileau 75016 Paris · 07 67 86 34 61. Brief en 3 étapes, réponse sous 24h ouvrées.",
}

const POURQUOI_NOUS = [
  "Réponse sous 24h ouvrées, par un interlocuteur unique.",
  "Équipe 100 % parisienne, connaissance fine du marché Paris + petite couronne.",
  "Carte T en cours d'obtention — délivrée par la CCI Paris Île-de-France.",
] as const

export default function ContactPage() {
  return (
    <>
      {/* Hero compact ≤ 40vh */}
      <section className="relative isolate flex min-h-[40vh] items-end overflow-hidden bg-fir-dark pt-32 pb-12 text-cream">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url(/images/categories/bureaux.jpg)" }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-fir-dark/85 via-fir-dark/85 to-fir-darker" aria-hidden />
        <Container>
          <Eyebrow className="text-gold">Contact</Eyebrow>
          <h1 className="font-display mt-3 text-[clamp(2rem,5vw,4.5rem)] uppercase leading-[1] tracking-tight">
            Discutons de votre projet.
          </h1>
          <p className="mt-4 max-w-xl text-base opacity-85">
            Un interlocuteur unique, réponse sous 24h ouvrées.
          </p>
        </Container>
      </section>

      {/* Layout 60/40 desktop, stack mobile */}
      <section className="bg-cream-soft py-16 md:py-20 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
            <div className="rounded-3xl bg-white p-8 shadow-[0_8px_28px_-12px_rgba(15,61,46,0.18)] md:p-10 lg:p-12">
              <Eyebrow className="text-gold-deep">Brief en 3 étapes</Eyebrow>
              <h2 className="font-display mt-3 text-3xl uppercase leading-tight tracking-tight text-fir-dark">
                Décrivez votre projet
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/60">
                Surface, emplacement, activité, budget, échéance. Plus le brief est
                précis, plus la réponse est rapide.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl bg-fir-dark p-8 text-cream">
                <Eyebrow className="text-gold">Coordonnées</Eyebrow>
                <ul className="mt-6 space-y-5">
                  <CoordItem icon={MapPin} label="Adresse">
                    {SITE.address.line1}
                    <br />
                    {SITE.address.line2}
                  </CoordItem>
                  <CoordItem icon={Phone} label="Téléphone">
                    <a href={`tel:${SITE.telephoneTel}`} className="hover:text-gold">
                      {SITE.telephoneDisplay}
                    </a>
                  </CoordItem>
                  <CoordItem icon={Mail} label="Email">
                    <a href={`mailto:${SITE.email}`} className="hover:text-gold">
                      {SITE.email}
                    </a>
                  </CoordItem>
                  <CoordItem icon={Clock} label="Horaires">
                    <span className="text-sm opacity-90">{SITE.hours.full}</span>
                  </CoordItem>
                </ul>
              </div>

              <div className="overflow-hidden rounded-3xl">
                <ContactMap />
              </div>

              <div className="rounded-3xl bg-white p-8 shadow-[0_8px_28px_-12px_rgba(15,61,46,0.10)]">
                <Eyebrow className="text-gold-deep">Pourquoi nous</Eyebrow>
                <ul className="mt-5 space-y-3 text-sm leading-relaxed text-ink/80">
                  {POURQUOI_NOUS.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  )
}

function CoordItem({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin
  label: string
  children: React.ReactNode
}) {
  return (
    <li className="flex items-start gap-4">
      <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-xs uppercase tracking-wider opacity-60">{label}</p>
        <div className="mt-1 text-base">{children}</div>
      </div>
    </li>
  )
}
