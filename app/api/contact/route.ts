import { NextResponse } from "next/server"
import { z } from "zod"
import { Resend } from "resend"

import { rateLimit } from "@/lib/rate-limit"
import { SITE } from "@/lib/site"

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  subject: z.enum(["vente", "location", "estimation", "autre"]),
  message: z.string().min(10).max(5000),
  hp: z.string().max(0).optional(), // honeypot
})

export async function POST(req: Request) {
  // Honeypot + rate limit par IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous"
  const rl = rateLimit(`contact:${ip}`, { max: 5, windowMs: 60_000 })
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
  if (parsed.data.hp) {
    // Honeypot rempli → bot
    return NextResponse.json({ ok: true })
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL ?? SITE.email
  const from = process.env.CONTACT_FROM_EMAIL ?? `Valor Immo <onboarding@resend.dev>`

  // Stub si pas de clé Resend en dev — log + 200
  if (!apiKey) {
    console.info("[contact] (stub, RESEND_API_KEY manquante)", parsed.data)
    return NextResponse.json({ ok: true, stub: true })
  }

  const resend = new Resend(apiKey)
  const { name, email, phone, subject, message } = parsed.data

  const html = `
    <h2>Nouvelle demande — ${subject}</h2>
    <p><strong>Nom :</strong> ${name}</p>
    <p><strong>Email :</strong> ${email}</p>
    ${phone ? `<p><strong>Téléphone :</strong> ${phone}</p>` : ""}
    <p><strong>Message :</strong></p>
    <p>${message.replace(/\n/g, "<br/>")}</p>
  `

  try {
    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Valor Immo — ${subject} (${name})`,
      html,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[contact] resend error", err)
    return NextResponse.json({ error: "Envoi impossible" }, { status: 500 })
  }
}
