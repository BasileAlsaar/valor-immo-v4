/**
 * Équipe Valor Immo — source de vérité des cartes hébergées /carte/[slug].
 *
 * `ready: true` = statifié + servi. `ready: false` = 404 auto via
 * `dynamicParams = false` + `generateStaticParams()` filtré.
 */

export type TeamMember = {
  /** Segment URL, kebab-case, unique. */
  slug: string
  firstName: string
  lastName: string
  role: string
  /** Gate de statification : seuls les `true` sont prérendus + servis. */
  ready: boolean
  /** Organisation — casse marque contrôlée (« Valor Immo », pas capitales). */
  org: string
  /** Chemin public depuis `/public`. Fallback monogramme (2 lettres) si absent. */
  photo?: string
  /** Mobile. Rendu ligne « Mobile » sur la page + `TEL;TYPE=CELL,VOICE:` vCard. */
  phone?: {
    /** Format FR humain, ex. "06 20 21 03 85". */
    display: string
    /** E.164, ex. "+33620210385". Utilisé dans `href="tel:…"` et `TEL:` vCard. */
    tel: string
  }
  /** Fixe/ligne agence. Rendu conditionnel « Fixe » + `TEL;TYPE=WORK,VOICE:` vCard. */
  fixe?: {
    display: string
    tel: string
  }
  email?: string
  linkedinUrl?: string
  workAddress: {
    /** Numéro + voie, ex. « 96 rue Boileau ». Vide → ADR sans street. */
    street?: string
    /** Locality transportée dans `ADR:` vCard. */
    locality: string
    /** Affichage éventuel distinct (ex. « Paris 16e »). Jamais dans `ADR:`. */
    localityDisplay?: string
    region?: string
    /** Code postal FR, ex. « 75016 ». */
    postalCode?: string
    country: string
  }
}

export const TEAM: TeamMember[] = [
  {
    slug: "basile",
    firstName: "Basile",
    lastName: "Alsaar",
    role: "Directeur Commercial",
    ready: true,
    org: "Valor Immo",
    photo: "/team/basile.webp",
    phone: { display: "06 20 21 03 85", tel: "+33620210385" },
    email: "basile.alsaar@groupevalorimmo.fr",
    linkedinUrl: "https://www.linkedin.com/in/basile-alsaar-441789171/",
    workAddress: {
      locality: "Paris",
      localityDisplay: "Paris 16e",
      region: "Île-de-France",
      country: "France",
    },
  },
  {
    slug: "yoav",
    firstName: "Yoav",
    lastName: "Marciano",
    role: "Directeur d'agence",
    ready: true,
    org: "Valor Immo",
    phone: { display: "06 64 83 00 55", tel: "+33664830055" },
    fixe: { display: "01 89 40 70 00", tel: "+33189407000" },
    email: "yoavmarciano@groupevalorimmo.fr",
    workAddress: {
      street: "96 rue Boileau",
      locality: "Paris",
      localityDisplay: "Paris 16e",
      region: "Île-de-France",
      postalCode: "75016",
      country: "France",
    },
  },
  {
    slug: "shai",
    firstName: "Shai",
    lastName: "Guedj",
    role: "Consultant immobilier",
    ready: true,
    org: "Valor Immo",
    phone: { display: "07 67 86 34 61", tel: "+33767863461" },
    fixe: { display: "01 89 40 70 00", tel: "+33189407000" },
    email: "shai-guedj@groupevalorimmo.fr",
    workAddress: {
      street: "96 rue Boileau",
      locality: "Paris",
      localityDisplay: "Paris 16e",
      region: "Île-de-France",
      postalCode: "75016",
      country: "France",
    },
  },
]

export function findMember(slug: string): TeamMember | undefined {
  return TEAM.find((m) => m.slug === slug)
}

export function readyMembers(): TeamMember[] {
  return TEAM.filter((m) => m.ready)
}
