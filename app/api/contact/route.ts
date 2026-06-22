/**
 * POST /api/contact — formulaire qualifiant 3 étapes (sprint 2).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Schéma mono-step archivé (sprint 1 — bootstrap) :
 *
 *   z.object({
 *     name: z.string().min(2).max(120),
 *     email: z.string().email(),
 *     phone: z.string().max(40).optional(),
 *     subject: z.enum(["vente","location","estimation","autre"]),
 *     message: z.string().min(10).max(5000),
 *     hp: z.string().max(0).optional(),
 *   })
 *
 * Remplacé sprint 2 par `contactFormSchema` (3 étapes : projet + contexte +
 * coordonnées) défini dans `lib/validations/contact.ts` et partagé avec
 * `components/contact-form/*`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server"

import { createApimoLead } from "@/lib/apimo/leads"
import { rateLimit } from "@/lib/rate-limit"
import {
  sendInternalNotification,
  sendUserConfirmation,
} from "@/lib/email"
import { contactFormSchema } from "@/lib/validations/contact"

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous"
  const rl = rateLimit(`contact:${ip}`, { max: 3, windowMs: 60 * 60 * 1000 })
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Trop de soumissions, réessayez plus tard." },
      { status: 429 },
    )
  }

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: "Payload invalide" }, { status: 400 })
  }

  const parsed = contactFormSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation", issues: parsed.error.issues },
      { status: 400 },
    )
  }
  // Honeypot — bot, on retourne 200 silencieux pour ne pas informer.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true })
  }

  const lead = parsed.data

  // Apimo est la condition de succès — c'est le CRM source de vérité.
  // Si la création du lead échoue, on renvoie 502 : aucun lead capturé.
  const apimo = await createApimoLead(lead)
  if (!apimo.ok) {
    console.error("[contact] apimo lead failed", {
      status: apimo.status,
      error: apimo.error,
    })
    return NextResponse.json({ error: "delivery" }, { status: 502 })
  }

  // Resend = best-effort. Le lead est déjà dans Apimo : les notifications
  // email sont un confort, pas une condition de succès. Toute erreur (clé
  // invalide, panne Resend, timeout) est loggée mais n'affecte pas la
  // réponse au prospect.
  try {
    const internal = await sendInternalNotification(lead)
    if (!internal.ok) {
      console.error("[contact] internal send failed", internal.error)
    }
  } catch (err) {
    console.error("[contact] internal send threw", err)
  }

  try {
    const user = await sendUserConfirmation(lead)
    if (!user.ok) {
      console.error("[contact] user confirmation failed", user.error)
    }
  } catch (err) {
    console.error("[contact] user confirmation threw", err)
  }

  return NextResponse.json({
    ok: true,
    message: "Demande reçue. Réponse sous 24h ouvrées.",
  })
}
