import type { Metadata } from "next"
import { ClassActifPage } from "@/components/sections/class-actif-page"

export const metadata: Metadata = {
  title: "Hôtellerie — Paris",
  description:
    "Murs et fonds d'hôtels parisiens : transmission, valorisation, repositionnement. Boutique-hôtels et hôtels indépendants sur emplacements premium intra-muros.",
}

export default function Page() {
  return (
    <ClassActifPage
      category="hotellerie"
      eyebrow="Classes d'actifs · 03"
      title={
        <>
          <span className="text-gold">Hôtellerie.</span>
        </>
      }
      subtitle="Murs et fonds d'hôtels indépendants, boutique-hôtels et résidences urbaines parisiennes. Transmission, valorisation patrimoniale, repositionnement opérationnel."
      backgroundImage="/images/categories/hotellerie.jpg"
      vocab={[
        { label: "Classement étoiles", value: "Référentiel ATOUT France 1 à 5 étoiles, plus distinction Palace — critères confort, services, équipements ; déterminant pour le positionnement tarifaire et la valorisation patrimoniale." },
        { label: "RevPAR", value: "Revenue Per Available Room — indicateur clé de performance hôtelière (taux d'occupation × prix moyen). Base de la valorisation économique d'un fonds." },
        { label: "Multiple d'EBE hospitality", value: "Méthode de valorisation des fonds : prix de cession = N × EBE, avec N typiquement entre 6 et 12× selon classement, emplacement et qualité opérationnelle." },
        { label: "Murs / Fonds / Mixte", value: "Distinction patrimoniale fondamentale — cession des murs seuls (immobilier nu), du fonds seul (exploitation), ou des deux (cession totale). Structuration fiscale différente." },
      ]}
      vocabIntro="Quatre repères structurent la lecture d'un actif hôtelier — classification réglementaire, performance opérationnelle, méthode de valorisation et structuration patrimoniale. Aucun ne s'examine seul."
      quartiers={[
        "Le Marais (3ᵉ-4ᵉ) — boutique-hôtels",
        "Saint-Germain-des-Prés (6ᵉ) — hôtels indépendants haut de gamme",
        "Triangle d'or (8ᵉ) — palaces et 5★",
        "Pigalle · SoPi (9ᵉ) — nouveaux concepts hospitality",
        "Opéra (1ᵉʳ-2ᵉ-9ᵉ) — hôtels affaires",
      ]}
      clientele={[
        "Groupes hôteliers indépendants et boutique-hôtels",
        "Investisseurs hospitality (LBO, family office)",
        "Asset managers spécialisés hospitalité",
        "Foncières spécialisées hospitality",
      ]}
    />
  )
}
