import type { Metadata } from "next"
import { ClassActifPage } from "@/components/sections/class-actif-page"

export const metadata: Metadata = {
  title: "Cession de droit au bail — Paris",
  description:
    "Reprise de bail commercial, cession de fonds CHR, négociation déspécialisation. Accompagnement fiscal et juridique du cédant comme du repreneur.",
}

export default function Page() {
  return (
    <ClassActifPage
      category="cession-droit-au-bail"
      eyebrow="Classes d'actifs · 06"
      title={
        <>
          Cession de <span className="text-gold">droit au bail.</span>
        </>
      }
      subtitle="Reprise de bail commercial, cession de fonds CHR, transmission d'établissement. Conseil sur l'arbitrage cession de fonds vs cession de bail, optimisation fiscale du cédant, négociation déspécialisation."
      backgroundImage="/images/categories/cession-droit-au-bail.jpg"
      vocab={[
        { label: "Cession de fonds", value: "Cession d'ensemble incluant clientèle, matériel, stock, contrats et droit au bail. Plus-value professionnelle au cédant, droits d'enregistrement au cessionnaire." },
        { label: "Cession de droit au bail", value: "Cession du seul droit d'occupation pour la durée résiduelle du bail. Pas de clientèle ni matériel — fiscalité simplifiée." },
        { label: "Pas-de-porte", value: "Somme versée par le preneur au bailleur pour entrer dans les lieux, distincte du loyer et du droit au bail." },
        { label: "Déspécialisation plénière", value: "Modification totale du champ d'activité autorisée par le bail, soumise à autorisation du bailleur et compensation éventuelle." },
      ]}
      quartiers={[
        "Triangle d'or (8ᵉ) — cession boutiques luxe",
        "Saint-Germain (6ᵉ) — cession restaurants",
        "Le Marais (3ᵉ-4ᵉ) — cession concept stores",
        "Châtelet · Les Halles (1ᵉʳ) — cession restauration et services",
        "Bastille · République (11ᵉ) — cession CHR tendance",
      ]}
      clientele={[
        "Cédants restaurateurs en transmission",
        "Repreneurs CHR multi-établissements",
        "Enseignes en repositionnement (changement d'emplacement)",
        "Concept stores en arbitrage de pas",
      ]}
    />
  )
}
