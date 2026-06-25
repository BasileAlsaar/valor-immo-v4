import type { Metadata } from "next"

import { ContactPageBody } from "@/components/contact/contact-page-body"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contact",
  description: `Valor Immo · ${SITE.address.line1} ${SITE.address.line2} · ${SITE.telephoneDisplay}. Brief en 3 étapes, réponse sous 24h ouvrées.`,
}

export default function ContactPage() {
  return <ContactPageBody />
}
