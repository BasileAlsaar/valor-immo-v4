import type { Metadata } from "next"
import { ClassActifPage } from "@/components/sections/class-actif-page"

export const metadata: Metadata = {
  title: "Locaux commerciaux — Paris",
  description:
    "Boutiques pied d'immeuble, restauration, services, concept stores. Baux 3/6/9 et cessions de fonds sur les emplacements n°1 à 2 de Paris intra-muros.",
}

export default function Page() {
  return (
    <ClassActifPage
      category="locaux-commerciaux"
      eyebrow="Classes d'actifs · 01"
      title={
        <>
          Locaux commerciaux <span className="text-gold">pied d'immeuble.</span>
        </>
      }
      subtitle="Boutiques, restauration, services, concept stores. Bail commercial 3/6/9, cession de droit au bail, négociation au facial et à l'économique : nous traitons chaque opération avec la connaissance fine des axes commerçants parisiens."
      backgroundImage="/images/categories/locaux-commerciaux.jpg"
      vocab={[
        { label: "ILC", value: "Indice des Loyers Commerciaux : indice INSEE de référence pour la révision triennale des baux commerciaux." },
        { label: "Pas-de-porte", value: "Somme versée par le preneur au bailleur ou cédant pour entrer dans les lieux, distincte du loyer." },
        { label: "Déspécialisation", value: "Modification du champ d'activité autorisée par le bail, partielle ou plénière, soumise à autorisation du bailleur." },
        { label: "Emplacement n°1 / n°2", value: "Classification des emplacements selon le flux piétonnier et la notoriété commerciale de l'axe." },
      ]}
      quartiers={[
        "Triangle d'or (8ᵉ) — Champs-Élysées, Faubourg Saint-Honoré, Avenue Montaigne",
        "Saint-Germain-des-Prés (6ᵉ) — Bonaparte, Bac, Cherche-Midi",
        "Le Marais (3ᵉ-4ᵉ) — Francs-Bourgeois, Vieille du Temple, Bretagne",
        "Châtelet · Les Halles (1ᵉʳ) — Rivoli, Saint-Denis, Montmartre",
        "Passy · Auteuil (16ᵉ) — Passy, Auteuil, Pompe",
      ]}
      clientele={[
        "Enseignes mode haut de gamme et lifestyle européennes et internationales",
        "Restauration gastronomique, brasseries et concept food",
        "Maisons de joaillerie, horlogerie, beauté",
        "Investisseurs en pied d'immeuble (family offices, foncières)",
      ]}
    />
  )
}
