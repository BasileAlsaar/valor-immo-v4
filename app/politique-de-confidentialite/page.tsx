import type { Metadata } from "next"
import { PageHero } from "@/components/sections/page-hero"
import { Container } from "@/components/ui/container"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité — traitement des données personnelles par Valor Immo conformément au RGPD.",
}

const LAST_REVISION = "22 mai 2026"

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <PageHero
        eyebrow="Légal"
        title={
          <>
            Politique de <span className="text-gold">confidentialité.</span>
          </>
        }
      />
      <section className="py-24">
        <Container>
          <div className="prose-editorial mx-auto max-w-3xl">
            <p className="text-sm text-ink/60">
              Cette politique décrit la manière dont {SITE.name} traite les
              données à caractère personnel collectées via son site web et son
              formulaire de contact, conformément au Règlement général sur la
              protection des données (RGPD — règlement UE 2016/679) et à la loi
              Informatique et Libertés du 6 janvier 1978 modifiée.
            </p>

            <h2 className="font-display mt-12 text-3xl uppercase tracking-tight text-fir-dark">
              Responsable de traitement
            </h2>
            <p>
              Le responsable de traitement est {SITE.name}, dont le siège est
              situé au {SITE.address.line1}, {SITE.address.line2}. Toute demande
              relative au traitement de vos données peut être adressée par email
              à{" "}
              <a href={`mailto:${SITE.email}`} className="text-gold-deep underline">
                {SITE.email}
              </a>{" "}
              ou par téléphone au {SITE.telephoneDisplay}.
            </p>
            <p className="text-sm text-ink/60">
              {SITE.name} n'a pas désigné de délégué à la protection des données
              (DPO) formel. Les demandes liées à vos droits RGPD sont traitées
              directement par le responsable de traitement via l'adresse email
              indiquée ci-dessus.
            </p>

            <h2 className="font-display text-3xl uppercase tracking-tight text-fir-dark">
              Données collectées
            </h2>
            <p>
              Les données personnelles collectées via le formulaire de contact
              du site sont les suivantes :
            </p>
            <ul className="list-disc pl-6">
              <li>nom et prénom du contact ;</li>
              <li>raison sociale et fonction (champs facultatifs) ;</li>
              <li>adresse email et numéro de téléphone professionnel ;</li>
              <li>
                description du projet immobilier : typologie d'actif,
                transaction envisagée, surface, budget, échéance, financement,
                secteur d'activité, zones géographiques recherchées ;
              </li>
              <li>message libre éventuel ;</li>
              <li>
                données techniques minimales nécessaires à la sécurité du
                formulaire (adresse IP, horodatage) pour prévenir les soumissions
                automatisées.
              </li>
            </ul>
            <p>
              Aucune donnée sensible au sens de l'article 9 du RGPD n'est
              collectée. La saisie de chaque information reste à votre
              initiative.
            </p>

            <h2 className="font-display text-3xl uppercase tracking-tight text-fir-dark">
              Finalités du traitement
            </h2>
            <p>Les données collectées sont utilisées pour :</p>
            <ul className="list-disc pl-6">
              <li>
                qualifier votre demande et préparer un échange commercial adapté
                à votre projet ;
              </li>
              <li>
                vous adresser une réponse personnalisée par email ou téléphone ;
              </li>
              <li>
                assurer le suivi commercial de votre dossier en cas de poursuite
                de la relation ;
              </li>
              <li>
                respecter les obligations légales liées à l'activité de
                transaction immobilière (notamment la conservation des pièces
                contractuelles).
              </li>
            </ul>

            <h2 className="font-display text-3xl uppercase tracking-tight text-fir-dark">
              Base légale
            </h2>
            <p>
              Les traitements reposent sur deux bases légales prévues par
              l'article 6 du RGPD :
            </p>
            <ul className="list-disc pl-6">
              <li>
                <strong>article 6.1.b</strong> — l'exécution de mesures
                précontractuelles prises à votre demande lorsque vous nous
                contactez via le formulaire ;
              </li>
              <li>
                <strong>article 6.1.f</strong> — l'intérêt légitime de{" "}
                {SITE.name} à qualifier et suivre les prospects commerciaux dans
                le cadre de son activité.
              </li>
            </ul>

            <h2 className="font-display text-3xl uppercase tracking-tight text-fir-dark">
              Durée de conservation
            </h2>
            <p>Les durées de conservation appliquées sont les suivantes :</p>
            <ul className="list-disc pl-6">
              <li>
                <strong>prospects</strong> — 3 ans à compter du dernier contact
                (recommandation CNIL pour les fichiers de prospection
                commerciale B2B) ;
              </li>
              <li>
                <strong>clients</strong> — 5 ans à compter de la fin de la
                relation contractuelle, conformément au délai de prescription
                commercial de l'article L110-4 du Code de commerce ;
              </li>
              <li>
                <strong>données techniques anti-spam</strong> — 12 mois maximum.
              </li>
            </ul>
            <p>
              À l'issue de ces durées, les données sont supprimées ou archivées
              de manière strictement limitée aux obligations légales en vigueur.
            </p>

            <h2 className="font-display text-3xl uppercase tracking-tight text-fir-dark">
              Destinataires
            </h2>
            <p>
              Vos données sont destinées exclusivement à l'équipe de{" "}
              {SITE.name}. Elles ne sont jamais revendues, louées ou cédées à
              des tiers à des fins commerciales.
            </p>
            <p>
              Pour assurer le bon acheminement des emails issus du formulaire
              de contact, {SITE.name} fait appel au sous-traitant suivant :
            </p>
            <ul className="list-disc pl-6">
              <li>
                <strong>Resend</strong> (Resend, Inc.) — service d'envoi
                d'emails transactionnels. Ce sous-traitant agit sur instructions
                documentées du responsable de traitement et applique des
                mesures techniques et organisationnelles appropriées
                (chiffrement en transit, accès restreint).
              </li>
            </ul>
            <p className="text-sm text-ink/60">
              Le site est hébergé par Vercel Inc. (États-Unis). Les transferts
              de données hors Union européenne associés à cet hébergement sont
              encadrés par les clauses contractuelles types adoptées par la
              Commission européenne.
            </p>

            <h2 className="font-display text-3xl uppercase tracking-tight text-fir-dark">
              Droits des personnes
            </h2>
            <p>
              Conformément aux articles 15 à 22 du RGPD, vous disposez sur les
              données qui vous concernent des droits suivants :
            </p>
            <ul className="list-disc pl-6">
              <li>
                <strong>droit d'accès</strong> — obtenir confirmation que vos
                données sont traitées et en obtenir copie ;
              </li>
              <li>
                <strong>droit de rectification</strong> — corriger des données
                inexactes ou incomplètes ;
              </li>
              <li>
                <strong>droit d'effacement</strong> — demander la suppression
                lorsque les données ne sont plus nécessaires ;
              </li>
              <li>
                <strong>droit d'opposition</strong> — vous opposer pour des
                motifs tenant à votre situation particulière, et de manière
                inconditionnelle s'agissant de la prospection commerciale ;
              </li>
              <li>
                <strong>droit à la limitation</strong> — demander la suspension
                temporaire du traitement ;
              </li>
              <li>
                <strong>droit à la portabilité</strong> — recevoir vos données
                dans un format structuré et lisible par machine.
              </li>
            </ul>
            <p>
              Pour exercer l'un de ces droits, adressez votre demande par email
              à{" "}
              <a href={`mailto:${SITE.email}`} className="text-gold-deep underline">
                {SITE.email}
              </a>{" "}
              en précisant votre identité et l'objet de la demande. Une réponse
              vous sera apportée dans le délai d'un mois prévu par le RGPD.
            </p>

            <h2 className="font-display text-3xl uppercase tracking-tight text-fir-dark">
              Cookies et traceurs
            </h2>
            <p>
              Le site n'utilise actuellement{" "}
              <strong>
                aucun cookie de mesure d'audience, de marketing ou de tiers
              </strong>
              . Seuls les cookies strictement nécessaires au fonctionnement
              technique (préférences d'affichage, validation de formulaire) sont
              déposés. Le détail figure sur la page{" "}
              <a href="/gestion-des-cookies" className="text-gold-deep underline">
                Gestion des cookies
              </a>
              .
            </p>
            <p>
              Si un outil de mesure d'audience est mis en place ultérieurement,
              un bandeau de recueil du consentement conforme à la délibération
              CNIL n° 2020-091 sera déployé, et cette politique sera mise à
              jour.
            </p>

            <h2 className="font-display text-3xl uppercase tracking-tight text-fir-dark">
              Réclamation auprès de la CNIL
            </h2>
            <p>
              Si vous estimez, après nous avoir contactés, que vos droits sur
              vos données ne sont pas respectés, vous pouvez introduire une
              réclamation auprès de la Commission nationale de l'informatique
              et des libertés (CNIL) — 3 place de Fontenoy, 75007 Paris —{" "}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-deep underline"
              >
                www.cnil.fr
              </a>
              .
            </p>

            <h2 className="font-display text-3xl uppercase tracking-tight text-fir-dark">
              Mise à jour de la politique
            </h2>
            <p>
              {SITE.name} se réserve le droit de modifier la présente politique
              afin de tenir compte des évolutions législatives,
              jurisprudentielles, éditoriales ou techniques. La version en
              vigueur est celle publiée sur cette page à la date de votre
              consultation.
            </p>
            <p className="text-sm text-ink/60">
              Document susceptible d'être mis à jour. Dernière révision :{" "}
              {LAST_REVISION}.
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}
