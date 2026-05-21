import type { Metadata } from "next"
import { ClassActifPage } from "@/components/sections/class-actif-page"

export const metadata: Metadata = {
  title: "Immeubles — Paris",
  description:
    "Immeubles mixtes commerce-habitation, monopropriétés haussmanniennes, lots de copropriété. Investissement patrimonial et marchand de biens sur Paris intra-muros.",
}

export default function Page() {
  return (
    <ClassActifPage
      category="immeubles"
      eyebrow="Classes d'actifs · 04"
      title={
        <>
          Immeubles et <span className="text-gold">monopropriétés.</span>
        </>
      }
      subtitle="Immeubles mixtes commerce-habitation, monopropriétés haussmanniennes, lots de copropriété stratégiques. Approche patrimoniale et investissement marchand de biens."
      backgroundImage="/images/categories/immeubles.jpg"
      vocab={[
        { label: "Rapport locatif brut", value: "Total des loyers annuels HC perçus, exprimé en € ou en % du prix d'acquisition (yield brut)." },
        { label: "Yield net", value: "Rendement après charges non récupérables, taxe foncière et provision travaux — indicateur clé pour comparer les actifs." },
        { label: "Ravalement décennal", value: "Obligation municipale de ravalement de façade tous les 10 ans à Paris — incidence forte sur les charges et la valorisation." },
        { label: "Loi Carrez", value: "Mesure de la surface privative des lots en copropriété, opposable en cas de cession (tolérance 5 % d'écart)." },
      ]}
      quartiers={[
        "Grands Boulevards (2ᵉ-9ᵉ) — immeubles mixtes haussmanniens",
        "Le Marais (3ᵉ-4ᵉ) — monopropriétés et hôtels particuliers",
        "16ᵉ — immeubles haussmanniens résidentiels avec pied d'immeuble",
        "17ᵉ — Plaine Monceau, Batignolles",
        "11ᵉ · 12ᵉ — immeubles mixtes en revalorisation",
      ]}
      clientele={[
        "Family offices et investisseurs patrimoniaux",
        "Marchands de biens et opérateurs valorisation",
        "Foncières et SCPI à dominante résidentielle",
        "Investisseurs institutionnels SCI/OPCI",
      ]}
    />
  )
}
