import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Phone } from "lucide-react"

import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { CtaPill } from "@/components/ui/cta-pill"
import { Badge } from "@/components/ui/badge"
import { CallbackSection } from "@/components/sections/callback-section"
import {
  properties,
  STATUT_LABEL,
  TYPE_LABEL,
} from "@/lib/data/properties"
import { SITE } from "@/lib/site"

type Params = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const p = properties.find((x) => x.slug === slug)
  if (!p) return { title: "Bien introuvable" }
  return {
    title: p.title,
    description: p.description?.slice(0, 160) ?? `${p.title} — ${p.quartier}, ${p.surface} m²`,
  }
}

function formatPrice(v: number) {
  return new Intl.NumberFormat("fr-FR").format(v)
}

export default async function FicheBienPage({ params }: Params) {
  const { slug } = await params
  const p = properties.find((x) => x.slug === slug)
  if (!p) notFound()

  return (
    <>
      <section className="relative isolate min-h-[80vh] overflow-hidden bg-fir-dark pt-32 text-white">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: `url(/images/properties/${p.slug}.jpg)` }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-fir-dark/40 via-fir-dark/55 to-fir-darker/95" />

        <Container className="flex min-h-[60vh] flex-col justify-end pb-16">
          <Link
            href="/opportunites"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-gold hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Retour au catalogue
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Badge
              variant="status"
              tone={p.statut === "vente" ? "gold" : p.statut === "murs-libres" ? "green" : "neutral"}
            >
              {STATUT_LABEL[p.statut]}
            </Badge>
            <Badge variant="type" tone="dark">{TYPE_LABEL[p.type]}</Badge>
            <Badge variant="ref" tone="dark">{p.ref}</Badge>
          </div>
          <h1 className="font-display mt-6 max-w-4xl text-[clamp(2rem,6vw,5rem)] uppercase leading-[0.95] tracking-tight">
            {p.title}
          </h1>
          <p className="mt-4 text-base opacity-85">
            {p.quartier} · Paris {p.arrondissement}ᵉ · {p.surface} m²
            {p.surfaceSousSol ? ` + ${p.surfaceSousSol} m² sous-sol` : ""}
          </p>
        </Container>
      </section>

      <section className="bg-cream py-24 md:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
            <div>
              <Eyebrow className="text-gold-deep">Description</Eyebrow>
              <p className="mt-6 text-lg leading-relaxed text-ink/85">{p.description}</p>

              {p.caracteristiques && (
                <div className="mt-12">
                  <Eyebrow className="text-gold-deep">Caractéristiques</Eyebrow>
                  <dl className="mt-6 divide-y divide-fir-dark/10 rounded-2xl border border-fir-dark/10 bg-white">
                    {p.caracteristiques.map((c) => (
                      <div key={c.label} className="flex items-center justify-between px-6 py-4">
                        <dt className="text-sm text-ink/60">{c.label}</dt>
                        <dd className="text-sm font-medium text-fir-dark">{c.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {p.tags && p.tags.length > 0 && (
                <div className="mt-12">
                  <Eyebrow className="text-gold-deep">À retenir</Eyebrow>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs uppercase tracking-wider text-gold-deep"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="lg:sticky lg:top-32 lg:self-start">
              <div className="rounded-3xl bg-fir-dark p-8 text-white">
                <p className="eyebrow text-gold">{STATUT_LABEL[p.statut]}</p>
                <p className="font-display mt-4 text-4xl uppercase leading-tight tracking-tight text-gold">
                  {p.loyerMensuel
                    ? `${formatPrice(p.loyerMensuel)} €/mois`
                    : p.prix
                      ? `${formatPrice(p.prix)} €`
                      : "Sur demande"}
                </p>
                {p.honoraires && (
                  <p className="mt-2 text-xs uppercase tracking-wider opacity-70">
                    Honoraires : {p.honoraires}
                  </p>
                )}
                {p.depotGarantie && (
                  <p className="mt-1 text-xs uppercase tracking-wider opacity-70">
                    Dépôt : {p.depotGarantie}
                  </p>
                )}
                {p.bail && (
                  <p className="mt-1 text-xs uppercase tracking-wider opacity-70">{p.bail}</p>
                )}

                <div className="mt-8 space-y-3">
                  <CtaPill href="/contact" variant="gold" size="lg" className="w-full">
                    Demander une visite
                  </CtaPill>
                  <a
                    href={`tel:${SITE.telephoneTel}`}
                    className="flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm uppercase tracking-wider transition hover:border-gold hover:text-gold"
                  >
                    <Phone className="h-4 w-4" /> {SITE.telephoneDisplay}
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <CallbackSection />
    </>
  )
}
