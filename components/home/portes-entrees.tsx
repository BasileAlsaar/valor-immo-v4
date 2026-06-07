import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { SectionCard } from "@/components/ui/section-card"
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
          {PORTES.map((p) => (
            <RevealItem key={p.ariaLabel}>
              <SectionCard
                href={p.href}
                eyebrow={p.amorce}
                title={p.cible}
                description={p.sousTitre}
                ariaLabel={p.ariaLabel}
              />
            </RevealItem>
          ))}
        </RevealStagger>
      </Container>
    </section>
  )
}
