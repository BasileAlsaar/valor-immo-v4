import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight, Phone } from "lucide-react"

import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { CtaPill } from "@/components/ui/cta-pill"
import { Badge } from "@/components/ui/badge"
import { Gallery } from "@/components/ui/gallery"
import { MiniMap } from "@/components/ui/mini-map"
import { CallbackSection } from "@/components/sections/callback-section"
import { ComparableLeases } from "@/components/sections/comparable-leases"
import { BudgetSimulator } from "@/components/sections/budget-simulator"
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

function arrRoman(n: number): string {
  const ROMAN: Record<number, string> = {
    1: "Iᵉʳ", 2: "IIᵉ", 3: "IIIᵉ", 4: "IVᵉ", 5: "Vᵉ", 6: "VIᵉ", 7: "VIIᵉ",
    8: "VIIIᵉ", 9: "IXᵉ", 10: "Xᵉ", 11: "XIᵉ", 12: "XIIᵉ", 13: "XIIIᵉ",
    14: "XIVᵉ", 15: "XVᵉ", 16: "XVIᵉ", 17: "XVIIᵉ", 18: "XVIIIᵉ",
    19: "XIXᵉ", 20: "XXᵉ",
  }
  return ROMAN[n] ?? `${n}ᵉ`
}

export default async function FicheBienPage({ params }: Params) {
  const { slug } = await params
  const p = properties.find((x) => x.slug === slug)
  if (!p) notFound()

  const heroSrc = `/images/properties/${p.slug}.jpg`
  const secondarySrc = `/images/properties/${p.slug}-2.jpg`

  // Prix au m²/an dérivé du loyer mensuel pour le BudgetSimulator.
  // Pour les biens en vente, on n'affiche pas le simulateur (cf. plus bas).
  const prixM2An = p.loyerMensuel
    ? Math.round((p.loyerMensuel * 12) / p.surface)
    : null

  return (
    <>
      {/* Hero plein écran — migration Next/Image (sprint 4b) */}
      <section className="relative isolate min-h-[80vh] overflow-hidden bg-fir-dark pt-32 text-white">
        <Image
          src={heroSrc}
          alt={p.title}
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-fir-darker/80 via-fir-dark/40 to-fir-dark/20" />

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

      {/* Galerie iconographie */}
      <section className="bg-cream-soft py-16 md:py-20">
        <Container>
          <Eyebrow className="text-gold-deep">Iconographie</Eyebrow>
          <h2 className="font-display mt-3 text-3xl uppercase leading-tight tracking-tight text-fir-dark md:text-4xl">
            Le bien en images
          </h2>
          <p className="mt-2 text-sm text-ink/60">
            {p.surface} m² · {TYPE_LABEL[p.type]} dans le quartier {p.quartier}.
          </p>
          <div className="mt-8">
            <Gallery
              images={[
                { src: heroSrc, alt: `${p.title} — vue principale` },
                { src: secondarySrc, alt: `${p.title} — vue complémentaire` },
              ]}
              aspectRatio="4/3"
            />
          </div>
        </Container>
      </section>

      {/* Description + caractéristiques + sticky aside (préservé sprint 1) */}
      <section className="bg-cream py-20 md:py-24">
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
                  <Link
                    href={`/contact?intent=plan&bien=${p.slug}`}
                    className="flex items-center justify-center gap-2 rounded-full border-2 border-gold/60 px-6 py-3 text-sm font-medium uppercase tracking-wider text-gold transition hover:border-gold hover:bg-gold/10"
                  >
                    Demander le plan détaillé
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={`tel:${SITE.telephoneTel}`}
                    className="flex items-center justify-center gap-2 text-sm uppercase tracking-wider text-cream/80 transition hover:text-gold"
                  >
                    <Phone className="h-4 w-4" /> {SITE.telephoneDisplay}
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* Localisation */}
      <section className="bg-cream-soft py-20 md:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:items-start">
            <div>
              <Eyebrow className="text-gold-deep">Localisation</Eyebrow>
              <h2 className="font-display mt-3 text-3xl uppercase leading-tight tracking-tight text-fir-dark md:text-4xl">
                Quartier {p.quartier}
                <br />
                <span className="text-gold-deep">Paris {arrRoman(p.arrondissement)}</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink/65">
                Adresse exacte communiquée sur demande après prise de contact.
                Le marqueur indique le centroïde approximatif du quartier.
              </p>
            </div>
            <MiniMap
              lat={p.center[1]}
              lng={p.center[0]}
              slug={p.slug}
              arrondissement={`Paris ${arrRoman(p.arrondissement)}`}
            />
          </div>
        </Container>
      </section>

      {/* Baux comparables — données de marché */}
      <section className="bg-cream py-20 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow className="text-gold-deep">Données de marché</Eyebrow>
            <h2 className="font-display mt-3 text-3xl uppercase leading-tight tracking-tight text-fir-dark md:text-4xl">
              Baux comparables récents
            </h2>
            <p className="mt-3 text-sm text-ink/65">
              Sélection de transactions anonymisées sur le quartier et ses
              limitrophes immédiats — issues de notre base d'analyse marché.
            </p>
          </div>
          <div className="mt-10">
            <ComparableLeases
              arrondissement={p.arrondissement}
              typologie={p.type}
              slug={p.slug}
            />
          </div>
        </Container>
      </section>

      {/* Simulation budget */}
      <section className="bg-cream-soft py-20 md:py-24">
        <Container>
          {prixM2An !== null ? (
            <BudgetSimulator
              surfaceInitiale={p.surface}
              prixM2An={prixM2An}
              slug={p.slug}
            />
          ) : (
            <div className="rounded-3xl border border-fir-dark/10 bg-cream p-8 md:p-10">
              <Eyebrow className="text-gold-deep">Simulation budget</Eyebrow>
              <h3 className="font-display mt-3 text-2xl uppercase leading-tight tracking-tight text-fir-dark md:text-3xl">
                Estimation personnalisée
              </h3>
              <p className="mt-3 max-w-xl text-sm text-ink/65">
                Le simulateur s'applique aux biens en location. Pour ce bien en{" "}
                {p.statut === "murs-libres" ? "vente murs libres" : "acquisition"},
                contactez-nous pour une estimation d'amortissement personnalisée
                tenant compte du contexte fiscal et patrimonial.
              </p>
              <Link
                href={`/contact?intent=simulation&bien=${p.slug}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-fir-dark px-6 py-3 text-sm font-medium uppercase tracking-wider text-cream transition hover:bg-ink"
              >
                Affiner avec un expert
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </Container>
      </section>

      <CallbackSection />
    </>
  )
}
