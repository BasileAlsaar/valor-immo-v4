import { notFound } from "next/navigation"

import { SuccessScreen } from "@/components/contact-form/SuccessScreen"
import type { ContactFormValues } from "@/lib/validations/contact"

/**
 * Route de démo utilisée uniquement pour produire des captures Playwright
 * du `SuccessScreen` (livrable sprint 2 §284 : « simuler succès via state
 * mock »). Désactivée en production via `NODE_ENV !== "production"`.
 */

const MOCK_LEAD: ContactFormValues = {
  typologie: "locaux-commerciaux",
  transaction: "location",
  budgetMin: 3000,
  budgetMax: 8000,
  deadline: "court-terme",
  financement: "pret-en-cours",
  secteur: "restauration",
  zones: ["paris-1", "paris-2"],
  nom: "Émilie Bernard",
  societe: "Maison Bernard SARL",
  email: "emilie@example.fr",
  telephone: "06 12 34 56 89",
  source: "recommandation",
  message: "Recherche flagship rue Saint-Honoré, ouverture printemps.",
  consentement: true,
  website: "",
}

export default function SuccessDemoPage() {
  if (process.env.NODE_ENV === "production") notFound()
  return (
    <section className="bg-cream-soft py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <SuccessScreen lead={MOCK_LEAD} />
      </div>
    </section>
  )
}
