import { findMember, readyMembers, type TeamMember } from "@/lib/team"
import { SITE } from "@/lib/site"

type Params = Promise<{ slug: string }>

export const dynamic = "force-static"
export const dynamicParams = false

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return readyMembers().map((m) => ({ slug: m.slug }))
}

export async function GET(_req: Request, { params }: { params: Params }) {
  const { slug } = await params
  const m = findMember(slug)
  if (!m || !m.ready) {
    return new Response("Not found", { status: 404 })
  }

  const vcard = buildVCard(m)
  const filename = `${m.slug}.vcf`

  return new Response(vcard, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}

/**
 * Échappe les caractères réservés dans une valeur vCard 3.0 (RFC 2426).
 * Ordre critique : backslash d'abord (sinon on double-échappe les autres).
 */
function esc(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
}

function buildVCard(m: TeamMember): string {
  const CRLF = "\r\n"
  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"]

  lines.push(`N:${esc(m.lastName)};${esc(m.firstName)};;;`)
  lines.push(`FN:${esc(`${m.firstName} ${m.lastName}`)}`)
  lines.push(`ORG:${esc(m.org)}`)
  lines.push(`TITLE:${esc(m.role)}`)

  if (m.phone) {
    lines.push(`TEL;TYPE=CELL,VOICE:${m.phone.tel}`)
  }
  if (m.fixe) {
    lines.push(`TEL;TYPE=WORK,VOICE:${m.fixe.tel}`)
  }
  if (m.email) {
    lines.push(`EMAIL;TYPE=WORK:${esc(m.email)}`)
  }

  lines.push(`URL:${SITE.url}`)

  // ADR à 7 composants : PO;Extended;Street;Locality;Region;PostalCode;Country
  const a = m.workAddress
  lines.push(
    `ADR;TYPE=WORK:;;${esc(a.street ?? "")};${esc(a.locality)};${esc(a.region ?? "")};${esc(a.postalCode ?? "")};${esc(a.country)}`
  )

  // Item-grouping Apple pour libeller le lien LinkedIn dans iOS Contacts.
  if (m.linkedinUrl) {
    lines.push(`item1.URL:${m.linkedinUrl}`)
    lines.push(`item1.X-ABLabel:LinkedIn`)
  }

  lines.push("END:VCARD")
  return lines.join(CRLF) + CRLF
}
