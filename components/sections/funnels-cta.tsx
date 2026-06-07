import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { CtaPill } from "@/components/ui/cta-pill"

/**
 * Bloc d'incitation à l'action — 3 portes funnel par profil.
 * Pas d'affirmation d'activité ni de mandats. Strict appel à l'action.
 *
 * Routes : /proprietaire, /investisseur, /commercant — funnels Lot 2.
 * Tant que les pages cibles ne sont pas livrées, les liens 404. Routage
 * volontaire pour ne pas masquer l'état d'avancement.
 */
export function FunnelsCTA() {
  return (
    <section className="bg-cream py-20 md:py-28 lg:py-32">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <Eyebrow className="text-gold-deep">Votre projet</Eyebrow>
          <h2 className="font-display mt-4 text-[clamp(1.75rem,4.5vw,4rem)] uppercase leading-[0.95] tracking-tight text-fir-dark">
            Un actif à céder, à louer,
            <br className="hidden md:block" />
            ou une recherche en cours&nbsp;?
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-ink/75 md:text-lg">
            Nous accompagnons propriétaires, investisseurs et commerçants
            sur l&apos;ensemble des actifs commerciaux et professionnels —
            locaux, bureaux, immeubles, hôtellerie, logistique. Décrivez
            votre projet, réponse sous 24h ouvrées.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 md:mt-14 md:gap-6">
          <CtaPill href="/proprietaire" variant="fir" size="lg">
            Je suis propriétaire
          </CtaPill>
          <CtaPill href="/investisseur" variant="gold" size="lg">
            Je cherche à investir
          </CtaPill>
          <CtaPill href="/commercant" variant="outline-ink" size="lg">
            Je cherche un local
          </CtaPill>
        </div>
      </Container>
    </section>
  )
}
