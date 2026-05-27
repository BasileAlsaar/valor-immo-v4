import { z } from "zod"

/**
 * Schéma Zod partagé client/serveur — formulaire qualifiant 3 étapes.
 * Importé par `components/contact-form/*` et `app/api/contact/route.ts`.
 * Tout ajout de champ se fait ici en source unique.
 */

export const TYPOLOGIES = [
  "locaux-commerciaux",
  "bureaux",
  "hotellerie-restauration",
  "immeubles",
  "entrepots-logistique",
  "cession-droit-au-bail",
] as const

export const TRANSACTIONS = ["acquisition", "location", "gestion", "les-deux"] as const

export const DEADLINES = [
  "immediat",
  "court-terme",
  "moyen-terme",
  "long-terme",
  "veille",
] as const

export const FINANCEMENTS = [
  "apport",
  "pret-en-cours",
  "pret-valide",
  "fonds-propres",
  "investisseur",
  "a-definir",
] as const

export const SECTEURS = [
  "restauration",
  "mode-luxe",
  "beaute-bien-etre",
  "tech-conseil",
  "retail",
  "industrie-artisanat",
  "sante",
  "education",
  "autre",
] as const

const PARIS_ARRONDISSEMENTS = Array.from({ length: 20 }, (_, i) => `paris-${i + 1}` as const)
export const ZONES = [
  ...PARIS_ARRONDISSEMENTS,
  "hauts-de-seine",
  "seine-saint-denis",
  "val-de-marne",
  "indifferent",
] as const

export const SOURCES = [
  "recommandation",
  "google",
  "reseaux-sociaux",
  "presse",
  "autre",
] as const

/** Regex tel FR : 0X, +33X, 00 33X ; espaces / points / tirets tolérés entre groupes. */
export const PHONE_FR_REGEX = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/

const projetShape = {
  typologie: z.enum(TYPOLOGIES),
  transaction: z.enum(TRANSACTIONS),
  surfaceMin: z.number().int().min(0).max(2000),
  surfaceMax: z.number().int().min(0).max(2000),
  /** En €/mois HT HC pour location, en € total pour acquisition. */
  budgetMin: z.number().int().min(0).optional(),
  budgetMax: z.number().int().min(0).optional(),
  /** Si transaction = les-deux, on garde des bornes acquisition séparées. */
  budgetMinAcquisition: z.number().int().min(0).optional(),
  budgetMaxAcquisition: z.number().int().min(0).optional(),
}

const contexteShape = {
  deadline: z.enum(DEADLINES),
  financement: z.enum(FINANCEMENTS),
  secteur: z.enum(SECTEURS),
  secteurAutre: z.string().max(120).optional(),
  zones: z.array(z.enum(ZONES)).min(1, "Sélectionnez au moins une zone"),
}

const coordonneesShape = {
  nom: z.string().min(2, "Nom requis").max(120),
  societe: z.string().max(120).optional(),
  email: z.string().email("Email invalide"),
  telephone: z.string().regex(PHONE_FR_REGEX, "Numéro français invalide"),
  source: z.enum(SOURCES).optional(),
  message: z.string().max(500).optional(),
  consentement: z.literal(true, { message: "Consentement requis" }),
  // Honeypot — doit rester vide.
  website: z.string().max(0).optional(),
}

const refineSurface = <T extends { surfaceMin: number; surfaceMax: number }>(d: T) =>
  d.surfaceMax >= d.surfaceMin

export const stepSchemas = {
  projet: z.object(projetShape).refine(refineSurface, {
    message: "Surface max doit être ≥ surface min",
    path: ["surfaceMax"],
  }),
  contexte: z.object(contexteShape),
  coordonnees: z.object(coordonneesShape),
} as const

export const contactFormSchema = z
  .object({
    ...projetShape,
    ...contexteShape,
    ...coordonneesShape,
  })
  .refine(refineSurface, {
    message: "Surface max doit être ≥ surface min",
    path: ["surfaceMax"],
  })

export type ContactFormValues = z.infer<typeof contactFormSchema>
export type Typologie = (typeof TYPOLOGIES)[number]
export type Transaction = (typeof TRANSACTIONS)[number]
export type Deadline = (typeof DEADLINES)[number]
export type Financement = (typeof FINANCEMENTS)[number]
export type Secteur = (typeof SECTEURS)[number]
export type Zone = (typeof ZONES)[number]
export type Source = (typeof SOURCES)[number]

/** Labels FR pour affichage UI + emails. */
export const LABELS = {
  typologie: {
    "locaux-commerciaux": "Locaux commerciaux",
    bureaux: "Bureaux",
    "hotellerie-restauration": "Hôtellerie & Restauration",
    immeubles: "Immeubles",
    "entrepots-logistique": "Entrepôts & Logistique",
    "cession-droit-au-bail": "Cession de droit au bail",
  },
  transaction: {
    acquisition: "Acquisition",
    location: "Location",
    gestion: "Gestion",
    "les-deux": "Acquisition ou location",
  },
  deadline: {
    immediat: "Immédiat (< 1 mois)",
    "court-terme": "Court terme (1-3 mois)",
    "moyen-terme": "Moyen terme (3-6 mois)",
    "long-terme": "Long terme (6+ mois)",
    veille: "Veille marché",
  },
  financement: {
    apport: "Apport",
    "pret-en-cours": "Prêt bancaire en cours d'obtention",
    "pret-valide": "Prêt validé",
    "fonds-propres": "Fonds propres entreprise",
    investisseur: "Investisseur tiers",
    "a-definir": "À définir",
  },
  secteur: {
    restauration: "Restauration",
    "mode-luxe": "Mode & Luxe",
    "beaute-bien-etre": "Beauté & Bien-être",
    "tech-conseil": "Tech & Conseil",
    retail: "Retail",
    "industrie-artisanat": "Industrie & Artisanat",
    sante: "Santé",
    education: "Éducation",
    autre: "Autre",
  },
  source: {
    recommandation: "Recommandation",
    google: "Recherche Google",
    "reseaux-sociaux": "Réseaux sociaux",
    presse: "Presse",
    autre: "Autre",
  },
} as const

export function zoneLabel(zone: Zone): string {
  if (zone === "hauts-de-seine") return "Hauts-de-Seine (92)"
  if (zone === "seine-saint-denis") return "Seine-Saint-Denis (93)"
  if (zone === "val-de-marne") return "Val-de-Marne (94)"
  if (zone === "indifferent") return "Indifférent"
  const n = zone.replace("paris-", "")
  return n === "1" ? "Paris 1ᵉʳ" : `Paris ${n}ᵉ`
}
