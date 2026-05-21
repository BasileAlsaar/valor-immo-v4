import { Clock, MapPin, Award } from "lucide-react"

import { Container } from "@/components/ui/container"
import { CtaPill } from "@/components/ui/cta-pill"

const ITEMS = [
  {
    icon: Clock,
    titre: "Réponse sous 24h ouvrées",
    sub: "Pas de mise en attente, pas de centre d'appels.",
  },
  {
    icon: MapPin,
    titre: "100 % Paris + petite couronne",
    sub: "Connaissance fine du marché parisien.",
  },
  {
    icon: Award,
    titre: "Carte Hoguet T",
    sub: "[CARTE T À FOURNIR] — réglementation Hoguet.",
  },
] as const

export function ReassuranceBar() {
  return (
    <section className="bg-white py-20 md:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[2fr_1fr]">
          <ul className="grid gap-10 md:grid-cols-3">
            {ITEMS.map((it) => (
              <li key={it.titre} className="flex items-start gap-4">
                <span className="mt-1 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                  <it.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-base font-medium text-ink">{it.titre}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-muted">{it.sub}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-start gap-3 lg:items-end lg:text-right">
            <p className="eyebrow text-gold-deep">Démarrons</p>
            <CtaPill href="/contact" variant="fir" size="lg">
              Discuter de mon projet
            </CtaPill>
          </div>
        </div>
      </Container>
    </section>
  )
}
