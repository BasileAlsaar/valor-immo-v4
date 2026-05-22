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

  // Envoi interne d'abord — le lead est capturé si celui-ci réussit.
  const internal = await sendInternalNotification(lead)
  if (!internal.ok) {
    console.error("[contact] internal send failed", internal.error)
    return NextResponse.json(
      { error: "Envoi impossible pour le moment, réessayez ou appelez-nous." },
      { status: 502 },
    )
  }

  // Confirmation user : best-effort. Si elle échoue, le lead est déjà capturé
  // côté équipe → on log et on retourne succès UX (cf. brief §83).
  const user = await sendUserConfirmation(lead)
  if (!user.ok) {
    console.error("[contact] user confirmation failed", user.error)
  }

  return NextResponse.json({
    ok: true,
    message: "Demande reçue. Réponse sous 24h ouvrées.",
    stub: "stub" in internal ? internal.stub : undefined,
  })
}
