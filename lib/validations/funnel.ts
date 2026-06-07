import { z } from "zod"

export const PARCOURS = ["proprietaire", "investisseur", "commercant"] as const
export type Parcours = (typeof PARCOURS)[number]

export const PARCOURS_LABELS: Record<Parcours, string> = {
  proprietaire: "Propriétaire",
  investisseur: "Investisseur",
  commercant: "Commerçant",
}

/** Valeur acceptée pour un champ : string (incl. choice value) ou boolean (toggle/binary). */
export const funnelFieldValueSchema = z.union([z.string().max(2000), z.boolean()])

export const funnelSubmissionSchema = z.object({
  parcours: z.enum(PARCOURS),
  fields: z.record(z.string(), funnelFieldValueSchema),
  consentement: z.literal(true, { message: "Consentement requis" }),
  // Honeypot — doit rester vide. Bots remplissent.
  website: z.string().max(0).optional(),
})

export type FunnelSubmission = z.infer<typeof funnelSubmissionSchema>
