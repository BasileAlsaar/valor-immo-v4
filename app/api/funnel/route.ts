import { NextResponse } from "next/server"

import { rateLimit } from "@/lib/rate-limit"
import { sendFunnelNotification } from "@/lib/email"
import { funnelSubmissionSchema } from "@/lib/validations/funnel"

/**
 * POST /api/funnel — captation des leads multi-étapes
 * (parcours propriétaire / investisseur / commerçant).
 *
 * Plomberie partagée avec /api/contact : rate-limit IP, Resend via lib/email.
 * // TODO CRM : pousser le lead dans le CRM dès choix du provider (Lot 2).
 */
export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous"
  const rl = rateLimit(`funnel:${ip}`, { max: 3, windowMs: 60 * 60 * 1000 })
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

  const parsed = funnelSubmissionSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation", issues: parsed.error.issues },
      { status: 400 },
    )
  }
  // Honeypot — bot, on retourne 200 silencieux.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true })
  }

  const { parcours, fields } = parsed.data
  const emailRaw = fields["email"]
  const replyTo = typeof emailRaw === "string" && emailRaw.includes("@") ? emailRaw : undefined

  const result = await sendFunnelNotification({ parcours, fields, replyTo })
  if (!result.ok) {
    console.error("[funnel] send failed", result.error)
    return NextResponse.json(
      { error: "Envoi impossible pour le moment, réessayez ou appelez-nous." },
      { status: 502 },
    )
  }

  // TODO CRM : `await crm.createLead({ parcours, fields, source: "/funnel" })`
  // dès choix du provider validé (HubSpot / Pipedrive / Attio…).

  return NextResponse.json({
    ok: true,
    message: "Demande reçue. Un conseiller vous contacte rapidement.",
    stub: "stub" in result ? result.stub : undefined,
  })
}
