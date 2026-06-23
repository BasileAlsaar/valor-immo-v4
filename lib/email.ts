import { Resend } from "resend"

import {
  buildInternalHtml,
  buildInternalSubject,
} from "@/lib/email-templates/internal-notification"
import {
  buildUserHtml,
  buildUserSubject,
} from "@/lib/email-templates/user-confirmation"
import {
  buildFunnelHtml,
  buildFunnelSubject,
} from "@/lib/email-templates/funnel-notification"
import { SITE } from "@/lib/site"
import type { ContactFormValues } from "@/lib/validations/contact"
import type { Parcours } from "@/lib/validations/funnel"

/**
 * Wrapper Resend — instancie le client à la demande et expose deux fonctions
 * typées pour les emails transactionnels du formulaire qualifiant.
 *
 * Si `RESEND_API_KEY` est absente, les fonctions retournent un stub `{ ok: true,
 * stub: true }` après log console.info — utile en dev local sans secrets.
 */

function getClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

function getFrom(): string {
  // Fallback dev tant que le domaine groupevalorimmo.fr n'est pas vérifié côté
  // Resend par Basile. À switcher vers "Valor Immo <contact@groupevalorimmo.fr>"
  // une fois la vérification de domaine effectuée.
  return process.env.RESEND_FROM_EMAIL ?? "Valor Immo <onboarding@resend.dev>"
}

function getInternalTo(): string {
  return process.env.RESEND_TO_EMAIL ?? SITE.email
}

type SendResult =
  | { ok: true; id?: string; stub?: boolean }
  | { ok: false; error: string }

async function send(args: {
  to: string
  subject: string
  html: string
  replyTo?: string
}): Promise<SendResult> {
  const client = getClient()
  if (!client) {
    console.info("[email] stub — RESEND_API_KEY absente", {
      to: args.to,
      subject: args.subject,
    })
    return { ok: true, stub: true }
  }
  try {
    const { data, error } = await client.emails.send({
      from: getFrom(),
      to: args.to,
      subject: args.subject,
      html: args.html,
      replyTo: args.replyTo,
    })
    if (error) return { ok: false, error: error.message }
    return { ok: true, id: data?.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Envoi impossible"
    return { ok: false, error: message }
  }
}

export async function sendInternalNotification(
  lead: ContactFormValues,
): Promise<SendResult> {
  return send({
    to: getInternalTo(),
    subject: buildInternalSubject(lead),
    html: buildInternalHtml(lead),
    replyTo: lead.email,
  })
}

export async function sendUserConfirmation(
  lead: ContactFormValues,
): Promise<SendResult> {
  return send({
    to: lead.email,
    subject: buildUserSubject(),
    html: buildUserHtml(lead),
  })
}

/**
 * Envoi interne d'un lead funnel (parcours propriétaire / investisseur /
 * commerçant). Réutilise la même plomberie Resend que les formulaires
 * contact — destinataire = boîte agence (SITE.email ou RESEND_TO_EMAIL).
 */
export async function sendFunnelNotification(args: {
  parcours: Parcours
  fields: Record<string, string | boolean>
  replyTo?: string
}): Promise<SendResult> {
  return send({
    to: getInternalTo(),
    subject: buildFunnelSubject(args.parcours),
    html: buildFunnelHtml(args.parcours, args.fields),
    replyTo: args.replyTo,
  })
}
