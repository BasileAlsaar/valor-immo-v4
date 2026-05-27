import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, Phone } from "lucide-react"

import { PageHero } from "@/components/sections/page-hero"
import { CallbackSection } from "@/components/sections/callback-section"
import { MethodSection } from "@/components/home/method-section"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { CtaPill } from "@/components/ui/cta-pill"
import { CallbackTrigger } from "@/components/callback/CallbackTrigger"
import { RevealStagger, RevealItem } from "@/components/motion/reveal"
import { SITE } from "@/lib/site"
import { CATEGORIES } from "@/lib/data/categories"

export const metadata: Metadata = {
  title: "Gestion locative et technique — Paris",
  description:
    "Valor Immo gère votre patrimoine commercial parisien : gestion administrative, technique, locative et reporting patrimonial. Un seul interlocuteur du quittancement au renouvellement de bail.",
}

const SERVICES = [
  {
    titre: "Gestion administrative",
    text: "Encaissement loyers, quittancement, charges récupérables, révisions indexées.",
  },
  {
    titre: "Gestion technique",
    text: "Suivi travaux, audits réglementaires, sinistres, certifications obligatoires.",
  },
  {
    titre: "Gestion locative",
    text: "Renouvellement baux, négociation augmentations, gestion contentieux, recommercialisation.",
  },
  {
    titre: "Reporting patrimonial",
    text: "Tableaux de bord trimestriels, valorisation actif, optimisation fiscale.",
  },
] as const

const GESTION_METHOD_STEPS = [
  {
    chiffre: "100%",
    titre: "Transparence",
    text: "Reporting trimestriel détaillé, accès direct au gestionnaire.",
  },
  {
    chiffre: "24h",
    titre: "Réactivité",
    text: "Réponse sous 24h ouvrées sur tout sujet locataire ou technique.",
  },
  {
    chiffre: "1",
    titre: "Interlocuteur dédié",
    text: "Un seul gestionnaire référent, aucun relais.",
  },
] as const

export default function GestionPage() {
  return (
    <>
      <PageHero
        eyebrow="Valor Immo · Gestion locative et technique · Paris"
        title={
          <>
            Votre patrimoine commercial <span className="text-gold">entre les mains d'un seul interlocuteur.</span>
          </>
        }
        subtitle="Gestion administrative, technique, locative et reporting patrimonial pour boutiques, bureaux, immeubles et hôtellerie parisiens. Un mandat resserré, un gestionnaire référent."
        backgroundImage="/images/categories/immeubles.jpg"
        actions={
          <>
            <CtaPill href="/contact" variant="gold" size="lg">
              Confier la gestion de mon bien
            </CtaPill>
            <Link
              href={`tel:${SITE.telephoneTel}`}
              className="inline-flex items-center gap-2 text-sm tracking-wider opacity-80 hover:text-gold hover:opacity-100"
            >
              <Phone className="h-4 w-4" /> {SITE.telephoneDisplay}
            </Link>
          </>
        }
      />

      {/* Services — 2 colonnes (présentation + grille 2×2) */}
      <section className="bg-cream py-24 md:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[2fr_3fr]">
            <div className="lg:sticky lg:top-[120px] lg:self-start">
              <Eyebrow className="text-gold-deep">Périmètre</Eyebrow>
              <h3 className="font-accent mt-4 text-[clamp(2rem,3vw,2.75rem)] italic leading-[1.05] text-fir-dark">
                Trois métiers en un seul mandat.
              </h3>
              <div aria-hidden className="my-6 h-px w-12 bg-gold" />
              <p className="max-w-[36ch] text-[15px] leading-relaxed text-fir-dark/70 md:text-base">
                La gestion d'un actif commercial parisien combine trois disciplines
                distinctes — administrative, technique, patrimoniale. Chacune exige
                une expertise spécifique ; leur articulation conditionne la
                rentabilité réelle de l'investissement.
              </p>
            </div>
            <RevealStagger className="grid gap-6 md:grid-cols-2">
              {SERVICES.map((s) => (
                <RevealItem key={s.titre}>
                  <div className="h-full rounded-2xl border border-fir-dark/10 bg-white p-6 md:p-7">
                    <h4 className="text-base font-medium uppercase tracking-tight text-fir-dark md:text-lg">
                      {s.titre}
                    </h4>
                    <p className="mt-3 text-sm leading-relaxed text-ink/75">{s.text}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealStagger>
          </div>
        </Container>
      </section>

      {/* Méthode — 3 chiffres dédiés gestion */}
      <MethodSection steps={GESTION_METHOD_STEPS} />

      {/* Tarification */}
      <section className="bg-white py-24 md:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[2fr_3fr] lg:items-end">
            <div>
              <Eyebrow className="text-gold-deep">Tarification</Eyebrow>
              <h3 className="font-accent mt-4 text-[clamp(2rem,3vw,2.75rem)] italic leading-[1.05] text-fir-dark">
                Honoraires de gestion alignés sur la performance.
              </h3>
              <div aria-hidden className="my-6 h-px w-12 bg-gold" />
            </div>
            <div>
              <p className="max-w-2xl text-base leading-relaxed text-ink/75 md:text-lg">
                Honoraires plafonnés selon la réglementation en vigueur — 6 à 8% HT
                des loyers encaissés selon le périmètre du mandat. Pas de frais
                cachés. Devis personnalisé après audit du bien.
              </p>
              <div className="mt-8">
                <CtaPill href="/contact" variant="fir" size="lg">
                  Demander un devis
                </CtaPill>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Typologies gérées — 6 liens vers /classes-d-actifs/* */}
      <section className="bg-cream-soft py-24 md:py-32">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow className="text-gold-deep">Typologies gérées</Eyebrow>
              <h2 className="font-display mt-4 text-[clamp(1.75rem,4.5vw,3.5rem)] uppercase leading-tight tracking-tight text-fir-dark">
                Six classes d'actifs<br />
                <span className="text-gold-deep">sous mandat.</span>
              </h2>
            </div>
            <Link
              href="/classes-d-actifs"
              className="group inline-flex items-center gap-2 text-sm uppercase tracking-wider text-gold-deep hover:text-fir-dark"
            >
              Voir toutes les typologies
              <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-fir-dark/10 md:grid-cols-2">
            {CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={cat.href}
                  className="group flex h-full flex-col gap-2 bg-white p-6 transition hover:bg-cream md:p-8"
                >
                  <Eyebrow className="text-gold-deep">{cat.label}</Eyebrow>
                  <p className="text-sm leading-relaxed text-ink/70">{cat.accroche}</p>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-gold-deep transition group-hover:gap-2.5">
                    Découvrir
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CallbackSection />
    </>
  )
}
