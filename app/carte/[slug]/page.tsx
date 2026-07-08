import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ChevronRight, Globe, Mail, Phone } from "lucide-react"

import { SetHeaderLight } from "@/components/site/set-header-light"
import { Container } from "@/components/ui/container"
import { CtaPill } from "@/components/ui/cta-pill"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Surface } from "@/components/ui/surface"
import { findMember, readyMembers } from "@/lib/team"
import { SITE } from "@/lib/site"

type Params = Promise<{ slug: string }>

export const dynamicParams = false

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return readyMembers().map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { slug } = await params
  const m = findMember(slug)
  if (!m || !m.ready) return { robots: { index: false, follow: false } }
  const fullName = `${m.firstName} ${m.lastName}`
  return {
    title: `${fullName} — ${m.role}`,
    description: `Carte de contact de ${fullName}, ${m.role} chez ${m.org}.`,
    alternates: { canonical: `${SITE.url}/carte/${m.slug}` },
    robots: { index: false, follow: false },
    openGraph: {
      type: "profile",
      firstName: m.firstName,
      lastName: m.lastName,
      title: `${fullName} — ${m.role}`,
      description: `${m.org} · ${m.workAddress.localityDisplay ?? m.workAddress.locality}`,
    },
  }
}

export default async function CartePage({ params }: { params: Params }) {
  const { slug } = await params
  const m = findMember(slug)
  if (!m || !m.ready) notFound()

  const fullName = `${m.firstName} ${m.lastName}`
  const localityDisplay = m.workAddress.localityDisplay ?? m.workAddress.locality
  const monogram = `${m.firstName[0] ?? ""}${m.lastName[0] ?? ""}`.toUpperCase()

  return (
    <>
      <SetHeaderLight />
      <Container className="max-w-md py-10 md:py-16">
        <Surface variant="dark" className="text-center">
          <div className="mx-auto mb-5 h-24 w-24 overflow-hidden rounded-full ring-1 ring-gold/30">
            {m.photo ? (
              <Image
                src={m.photo}
                alt={fullName}
                width={200}
                height={200}
                className="h-full w-full object-cover"
                priority
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-cream">
                <span
                  aria-hidden="true"
                  className="font-accent text-3xl font-medium tracking-tight text-fir-dark"
                >
                  {monogram}
                </span>
              </div>
            )}
          </div>
          <h1 className="font-accent text-2xl font-medium leading-tight text-cream md:text-3xl">
            {fullName}
          </h1>
          <Eyebrow as="p" className="mt-3 text-gold">
            {m.role}
          </Eyebrow>
          <p className="mt-2 text-sm text-cream/70">
            {m.org} · {localityDisplay}
          </p>
        </Surface>

        <div className="mt-6">
          <CtaPill
            href={`/carte/${m.slug}/vcard`}
            variant="fir"
            size="lg"
            className="w-full"
          >
            Ajouter à mes contacts
          </CtaPill>
          <p className="mt-2 text-center text-xs text-slate-muted">
            Enregistré directement sur votre téléphone
          </p>
        </div>

        <Surface variant="light" className="mt-6 p-0 md:p-0">
          <ul className="divide-y divide-fir-dark/10">
            {m.phone && (
              <ContactRow
                icon={<Phone className="h-4 w-4" />}
                label="Mobile"
                value={m.phone.display}
                href={`tel:${m.phone.tel}`}
                ariaLabel={`Appeler ${fullName} au ${m.phone.display}`}
              />
            )}
            {m.fixe && (
              <ContactRow
                icon={<Phone className="h-4 w-4" />}
                label="Fixe"
                value={m.fixe.display}
                href={`tel:${m.fixe.tel}`}
                ariaLabel={`Appeler ${fullName} au ${m.fixe.display}`}
              />
            )}
            {m.email && (
              <ContactRow
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={m.email}
                href={`mailto:${m.email}`}
                ariaLabel={`Envoyer un email à ${fullName}`}
              />
            )}
            <ContactRow
              icon={<Globe className="h-4 w-4" />}
              label="Site"
              value={SITE.domain}
              href={SITE.url}
              external
              ariaLabel={`Ouvrir ${SITE.domain} dans un nouvel onglet`}
            />
            {m.linkedinUrl && (
              <ContactRow
                icon={<LinkedinGlyph className="h-4 w-4" />}
                label="LinkedIn"
                value={fullName}
                href={m.linkedinUrl}
                external
                ariaLabel={`Ouvrir le profil LinkedIn de ${fullName}`}
              />
            )}
          </ul>
        </Surface>
      </Container>
    </>
  )
}

// LinkedIn — lucide-react v1.16 du repo n'expose pas de brand icons.
// Inline plutôt qu'ajout de dépendance.
function LinkedinGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z" />
    </svg>
  )
}

function ContactRow({
  icon,
  label,
  value,
  href,
  external,
  ariaLabel,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href: string
  external?: boolean
  ariaLabel: string
}) {
  return (
    <li>
      <a
        href={href}
        aria-label={ariaLabel}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-cream-soft"
      >
        <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-cream text-fir-dark">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <Eyebrow as="span" className="text-slate-muted">
            {label}
          </Eyebrow>
          <span className="mt-0.5 block break-all text-sm font-medium text-ink">
            {value}
          </span>
        </span>
        <ChevronRight
          aria-hidden="true"
          className="h-4 w-4 flex-shrink-0 text-fir-dark/30"
        />
      </a>
    </li>
  )
}
