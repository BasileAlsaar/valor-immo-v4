import type { Metadata } from "next"
import { ClassActifPage } from "@/components/sections/class-actif-page"

export const metadata: Metadata = {
  title: "Hôtellerie & Restauration — Paris",
  description:
    "Murs et fonds d'hôtels, brasseries, restaurants gastronomiques. Licence IV, extraction certifiée, transmission CHR sur les emplacements premium parisiens.",
}

export default function Page() {
  return (
    <ClassActifPage
      category="hotellerie-restauration"
      eyebrow="Classes d'actifs · 03"
      title={
        <>
          Hôtellerie & <span className="text-gold">Restauration.</span>
        </>
      }
      subtitle="Murs et fonds d'hôtels indépendants, brasseries historiques, restaurants gastronomiques, bars à concept. Licence IV, extraction certifiée, transmission d'établissements emblématiques."
      backgroundImage="/images/categories/hotellerie-restauration.jpg"
      vocab={[
        { label: "Licence IV", value: "Licence de débit de boissons permettant la vente de toutes catégories d'alcool. Transférable sous conditions strictes, valeur patrimoniale autonome." },
        { label: "Extraction certifiée", value: "Système d'évacuation des fumées de cuisine conforme aux normes ERP — condition impérative pour exploiter en restauration avec cuisson." },
        { label: "Multiple d'EBE", value: "Méthode de valorisation des fonds CHR : prix de cession = N × EBE, avec N typiquement entre 4 et 10× selon classement et emplacement." },
        { label: "ICR / ERP", value: "Classement de l'établissement recevant du public (catégorie 5 pour < 300 pers., catégorie 4 pour 300-700, etc.) — incidence sur les obligations sécurité incendie." },
      ]}
      vocabIntro="Quatre éléments font la valeur d'un actif CHR — autorisation administrative, équipement technique, performance économique et classification réglementaire. Aucun ne s'examine seul."
      quartiers={[
        "Saint-Germain-des-Prés (6ᵉ) — restauration gastronomique",
        "Le Marais (3ᵉ-4ᵉ) — boutique-hôtels et bistronomie",
        "Triangle d'or (8ᵉ) — palaces et restaurants étoilés",
        "Opéra · Bourse (1ᵉʳ-2ᵉ) — brasseries historiques",
        "Bastille · Canal Saint-Martin (11ᵉ-10ᵉ) — concept food",
      ]}
      clientele={[
        "Groupes hôteliers indépendants et boutique-hôtels",
        "Chefs étoilés et restaurateurs en transmission",
        "Repreneurs CHR (LBO, family office)",
        "Foncières spécialisées hospitality",
      ]}
    />
  )
}
