import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { RevealStagger, RevealItem } from "@/components/motion/reveal"

type Porte = {
  amorce: string
  cible: string
  sousTitre: string
  href: string
  ariaLabel: string
}

const PORTES: Porte[] = [
  {
    amorce: "Je cherche",
    cible: "un local",
    sousTitre: "Boutiques, restauration, services.",
    href: "/location",
    ariaLabel: "Je cherche un local",
  },
  {
    amorce: "Je cherche",
    cible: "des bureaux",
    sousTitre: "Du poste isolé au plateau, haussmannien ou récent.",
    href: "/location",
    ariaLabel: "Je cherche des bureaux",
  },
  {
    amorce: "Je cherche",
    cible: "un actif logistique",
    sousTitre: "Stockage, dernier kilomètre, Île-de-France.",
    href: "/classes-d-actifs/entrepots-logistique",
    ariaLabel: "Je cherche un actif logistique",
  },
  {
    amorce: "Je cherche",
    cible: "un hôtel",
    sousTitre: "Murs et fonds, indépendants et boutique-hôtels.",
    href: "/classes-d-actifs/hotellerie",
    ariaLabel: "Je cherche un hôtel",
  },
  {
    // LOT2: remplacer href par funnel propriétaire §3
    amorce: "Je suis",
    cible: "propriétaire",
    sousTitre: "Vente, location, gestion d'un actif détenu.",
    href: "/contact",
    ariaLabel: "Je suis propriétaire",
  },
  {
    // LOT2: remplacer href par funnel investisseur §4
    amorce: "Je cherche",
    cible: "à investir",
    sousTitre: "Murs occupés, immeubles de rendement, hôtellerie.",
    href: "/contact",
    ariaLabel: "Je cherche à investir",
  },
]

export function PortesEntrees() {
  return (
    <section className="bg-cream py-20 md:py-24 lg:py-28">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow className="text-gold-deep">Par où commencer</Eyebrow>
            <h2 className="font-display mt-3 text-[clamp(1.75rem,4.5vw,4rem)] uppercase leading-[0.95] tracking-tight text-fir-dark">
              Qu&apos;est-ce qui vous amène&nbsp;?
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-ink/70 md:text-right">
            Six portes d&apos;entrée. Choisissez la vôtre — nous prenons la
            suite dans la journée.
          </p>
        </div>

        <RevealStagger className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PORTES.map((p, i) => (
            <RevealItem key={p.ariaLabel}>
              <Link
                href={p.href}
                aria-label={p.ariaLabel}
                className="group relative flex h-full flex-col justify-between gap-8 rounded-2xl border border-fir-dark/10 bg-white p-7 transition-colors duration-300 ease-out-expo hover:border-gold md:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="eyebrow text-gold-deep">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 text-fir-dark/40 transition-all duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
                    aria-hidden
                  />
                </div>

                <div>
                  <p className="eyebrow text-ink/55">{p.amorce}</p>
                  <p className="font-display mt-2 text-[clamp(1.75rem,2.5vw,2.5rem)] uppercase leading-[0.95] tracking-tight text-fir-dark">
                    {p.cible}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-ink/70">
                    {p.sousTitre}
                  </p>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>
      </Container>
    </section>
  )
}
