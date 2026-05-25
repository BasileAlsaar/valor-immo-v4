import type { Metadata } from "next"
import { ClassActifPage } from "@/components/sections/class-actif-page"

export const metadata: Metadata = {
  title: "Bureaux — Paris",
  description:
    "Plateaux tertiaires haussmanniens, sièges sociaux, espaces flex et certifiés BREEAM/HQE. QCA, 9ᵉ Haussmann et nouveaux quartiers d'affaires.",
}

export default function Page() {
  return (
    <ClassActifPage
      category="bureaux"
      eyebrow="Classes d'actifs · 02"
      title={
        <>
          Plateaux et sièges <span className="text-gold">tertiaires.</span>
        </>
      }
      subtitle="Bail tertiaire 3/6/9, plateaux haussmanniens divisibles, sièges sociaux certifiés. Conseil sur l'arbitrage QCA / 9ᵉ Haussmann et lecture précise du loyer économique."
      backgroundImage="/images/categories/bureaux.jpg"
      vocab={[
        { label: "ILAT", value: "Indice des Loyers des Activités Tertiaires : indice INSEE de référence pour la révision des baux tertiaires." },
        { label: "Loyer économique", value: "Loyer facial corrigé des mesures incitatives (franchises, paliers, travaux preneur). Indicateur clé du coût réel sur 9 ans." },
        { label: "Bail tertiaire 3/6/9", value: "Bail commercial à durée de 9 ans avec faculté de sortie triennale pour le preneur — adapté aux activités de bureau." },
        { label: "Grade A / B", value: "Classification qualitative des immeubles tertiaires : Grade A = neuf ou rénové dernière génération avec certifications, Grade B = qualité intermédiaire." },
      ]}
      vocabIntro="Quatre notions structurent la lecture d'un actif tertiaire — indice de révision, loyer effectif, architecture de bail et qualité d'immeuble. C'est leur articulation qui fonde la valorisation."
      quartiers={[
        "QCA Triangle d'or (8ᵉ) — Étoile, Champs-Élysées, Boétie",
        "9ᵉ Haussmann (9ᵉ) — Opéra, Auber, Trinité, Cadet",
        "1ᵉʳ / 2ᵉ — Bourse, Vendôme, Sentier",
        "16ᵉ — Trocadéro, Iéna, Victor Hugo",
        "Quartier La Défense (Hauts-de-Seine)",
      ]}
      clientele={[
        "Sociétés de conseil et boutique firms financières",
        "Cabinets d'avocats mid-cap et big four",
        "Sièges de scale-ups tech, médias, éditeurs",
        "Investisseurs institutionnels SCPI, OPCI, family offices",
      ]}
    />
  )
}
