import { NextResponse } from "next/server"
import { z } from "zod"
import { Resend } from "resend"

import { rateLimit } from "@/lib/rate-limit"
import { SITE } from "@/lib/site"

const schema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(8).max(40),
  slot: z.string().max(120).optional(),
  hp: z.string().max(0).optional(),
})

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous"
  const rl = rateLimit(`callback:${ip}`, { max: 3, windowMs: 60_000 })
  if (!rl.ok) {
    return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 })
  }

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: "Payload invalide" }, { status: 400 })
  }

  const parsed = schema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation", issues: parsed.error.issues }, { status: 400 })
  }
  if (parsed.data.hp) return NextResponse.json({ ok: true })

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL ?? SITE.email
  const from = process.env.CONTACT_FROM_EMAIL ?? `Valor Immo <onboarding@resend.dev>`

  if (!apiKey) {
    console.info("[callback] (stub, RESEND_API_KEY manquante)", parsed.data)
    return NextResponse.json({ ok: true, stub: true })
  }

  const resend = new Resend(apiKey)
  const { name, phone, slot } = parsed.data

  try {
    await resend.emails.send({
      from,
      to,
      subject: `Valor Immo — Rappel demandé (${name})`,
      html: `
        <h2>Demande de rappel</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Téléphone :</strong> ${phone}</p>
        ${slot ? `<p><strong>Créneau souhaité :</strong> ${slot}</p>` : ""}
      `,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[callback] resend error", err)
    return NextResponse.json({ error: "Envoi impossible" }, { status: 500 })
  }
}
