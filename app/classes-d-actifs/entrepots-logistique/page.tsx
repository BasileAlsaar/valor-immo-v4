import type { Metadata } from "next"
import { ClassActifPage } from "@/components/sections/class-actif-page"

export const metadata: Metadata = {
  title: "Entrepôts & Logistique — Paris",
  description:
    "Stockage urbain, dernier kilomètre, locaux d'activité, plateformes logistiques. Solutions pour les opérateurs e-commerce et messagerie sur Paris et Île-de-France.",
}

export default function Page() {
  return (
    <ClassActifPage
      category="entrepots-logistique"
      eyebrow="Classes d'actifs · 05"
      title={
        <>
          Entrepôts et <span className="text-gold">logistique urbaine.</span>
        </>
      }
      subtitle="Stockage, dernier kilomètre, locaux d'activité, plateformes logistiques. Recherche fine sur Paris intra-muros et Île-de-France pour les opérateurs e-commerce, messagerie et ateliers urbains."
      backgroundImage="/images/categories/entrepots-logistique.jpg"
      vocab={[
        { label: "Surface utile (SU)", value: "Surface exploitable au sol, hors gaines techniques et circulations verticales — indicateur principal pour la logistique." },
        { label: "Hauteur libre", value: "Hauteur sous plafond effective sous la sous-face des poutres ou de la dalle haute — détermine la possibilité de rayonnages et mezzanines." },
        { label: "Plancher (kg/m²)", value: "Charge admissible au sol, exprimée en kg ou tonne par m². Critère essentiel pour les activités de stockage lourd ou industriel léger." },
        { label: "Quai de déchargement", value: "Aire dédiée à l'accostage des poids lourds, équipée ou non d'un niveleur de quai — indispensable pour la messagerie." },
      ]}
      vocabIntro="Quatre indicateurs déterminent la valeur et l'usage d'un actif logistique. Aucun ne se lit isolément : c'est leur combinaison qui éclaire la décision."
      quartiers={[
        "18ᵉ — Pajol, La Chapelle (logistique urbaine)",
        "19ᵉ — Bassin de la Villette, Aubervilliers porte (dernier km)",
        "13ᵉ — Bercy, Tolbiac",
        "Île-de-France — Aubervilliers, Saint-Ouen, Pantin, Ivry",
        "Plateformes XPO/Geodis hors Paris",
      ]}
      clientele={[
        "Opérateurs e-commerce et marketplaces",
        "Messagerie dernier kilomètre",
        "Ateliers urbains et fabricants locaux",
        "Acteurs de la dark kitchen et logistique food",
      ]}
    />
  )
}
