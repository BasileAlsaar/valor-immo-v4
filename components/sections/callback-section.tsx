import { Clock, Mail, MapPin, Phone } from "lucide-react"

import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { CtaPill } from "@/components/ui/cta-pill"
import { SITE } from "@/lib/site"

export function CallbackSection() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <Container>
        <div className="grid items-center gap-10 rounded-3xl bg-white p-10 shadow-[0_20px_60px_-20px_rgba(15,61,46,0.18)] md:grid-cols-[1.4fr_1fr] md:p-16">
          <div>
            <Eyebrow className="text-gold-deep">Vous avez un projet</Eyebrow>
            <h2 className="font-display mt-6 text-[clamp(2rem,5.5vw,4.5rem)] uppercase leading-[0.95] tracking-tight text-fir-dark">
              Discutons-en<br />
              <span className="text-gold-deep">en 24 heures.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-5">
            <ul className="space-y-3 text-sm leading-[1.5] text-fir-dark">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden />
                <span>
                  {SITE.address.line1}, {SITE.address.line2}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gold-deep" aria-hidden />
                <a href={`tel:${SITE.telephoneTel}`} className="hover:text-gold-deep">
                  {SITE.telephoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-gold-deep" aria-hidden />
                <a href={`mailto:${SITE.email}`} className="hover:text-gold-deep">
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden />
                <span className="text-ink/70">{SITE.hours.full}</span>
              </li>
            </ul>
            <p className="mt-2 text-center text-base leading-relaxed text-ink/70">
              Un brief précis, une réponse sous 24h ouvrées, un interlocuteur
              unique du premier appel à la signature.
            </p>
            <CtaPill href="/contact" variant="fir" size="lg">
              Demander à être rappelé
            </CtaPill>
          </div>
        </div>
      </Container>
    </section>
  )
}
