import type { Metadata } from "next"

import { ContactPageBody } from "@/components/contact/contact-page-body"
import type { BienPrefill } from "@/components/contact-form/ContactForm"
import { listPubliableProperties } from "@/lib/apimo"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contact",
  description: `Valor Immo · ${SITE.address.line1} ${SITE.address.line2} · ${SITE.telephoneDisplay}. Brief en 3 étapes, réponse sous 24h ouvrées.`,
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

/**
 * Résout `?bien={reference}` en `BienPrefill` côté serveur.
 * - Silencieux si le paramètre est absent, malformé, ou pointe vers un bien
 *   non publiable / introuvable : le formulaire fonctionne alors normalement,
 *   sans régression /contact.
 * - On ne fait CONFIANCE qu'à `listPubliableProperties()` : un lead ne peut
 *   pas être attaché à un bien que le site n'expose pas.
 */
async function resolveBienPrefill(
  raw: string | string[] | undefined
): Promise<BienPrefill | undefined> {
  if (typeof raw !== "string") return undefined
  const ref = raw.trim().toUpperCase()
  if (!/^[A-Z0-9-]{2,20}$/.test(ref)) return undefined
  try {
    const { publishable } = await listPubliableProperties()
    const bien = publishable.find((p) => p.reference.toUpperCase() === ref)
    if (!bien) return undefined
    const cityBits = [bien.district?.name, bien.city?.name].filter(Boolean)
    const cityLine = cityBits.join(" · ")
    const label = `Demande de visite — ${bien.reference}${cityLine ? ` · ${cityLine}` : ""}`
    return { reference: bien.reference, id: bien.id, label }
  } catch {
    // fetch Apimo failed → fallback silencieux, form normal.
    return undefined
  }
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams
  const bienPrefill = await resolveBienPrefill(sp.bien)
  return <ContactPageBody bienPrefill={bienPrefill} />
}
