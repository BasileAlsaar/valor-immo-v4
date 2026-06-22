import { ApimoError, apimoFetch } from "./client"
import { VALOR_IMMO_AGENCY_ID } from "./index"
import {
  LABELS,
  zoneLabel,
  type ContactFormValues,
} from "@/lib/validations/contact"

export type ApimoLeadResult =
  | { ok: true; status: number }
  | { ok: false; status: number; error: string }

type ApimoLeadPayload = {
  reference: string
  date: string
  step: string
  type: string
  language: string
  country: string
  lastname: string
  firstname: string
  email: string
  phone: string
  message: string
}

const REQUEST_TIMEOUT_MS = 8000

function pad(n: number): string {
  return String(n).padStart(2, "0")
}

function formatDateTime(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function splitNom(nom: string): { firstname: string; lastname: string } {
  const trimmed = nom.trim()
  const idx = trimmed.indexOf(" ")
  if (idx === -1) return { firstname: "", lastname: trimmed }
  return {
    firstname: trimmed.slice(0, idx),
    lastname: trimmed.slice(idx + 1).trim(),
  }
}

function buildMessage(lead: ContactFormValues): string {
  const lines: string[] = [
    `Transaction : ${LABELS.transaction[lead.transaction]}`,
    `Typologie : ${LABELS.typologie[lead.typologie]}`,
    `Échéance : ${LABELS.deadline[lead.deadline]}`,
    `Financement : ${LABELS.financement[lead.financement]}`,
  ]
  const secteur =
    lead.secteur === "autre" && lead.secteurAutre
      ? `${LABELS.secteur.autre} — ${lead.secteurAutre}`
      : LABELS.secteur[lead.secteur]
  lines.push(`Secteur : ${secteur}`)
  lines.push(`Zones : ${lead.zones.map(zoneLabel).join(", ")}`)
  if (lead.societe) lines.push(`Société : ${lead.societe}`)
  if (lead.source) lines.push(`Source : ${LABELS.source[lead.source]}`)
  if (lead.message) {
    lines.push("", "Message :", lead.message)
  }
  return lines.join("\n")
}

function buildPayload(input: ContactFormValues): ApimoLeadPayload {
  const { firstname, lastname } = splitNom(input.nom)
  return {
    reference: `web-${Date.now()}`,
    date: formatDateTime(new Date()),
    step: "1",
    type: "1",
    language: "fr",
    country: "FR",
    lastname,
    firstname,
    email: input.email,
    phone: input.telephone,
    message: buildMessage(input),
  }
}

export async function createApimoLead(
  input: ContactFormValues,
  agencyId: string = VALOR_IMMO_AGENCY_ID,
): Promise<ApimoLeadResult> {
  try {
    await apimoFetch<unknown>(`/agencies/${agencyId}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload(input)),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    return { ok: true, status: 200 }
  } catch (err) {
    if (err instanceof ApimoError) {
      return { ok: false, status: err.status, error: err.message }
    }
    if (err instanceof DOMException && err.name === "TimeoutError") {
      return { ok: false, status: 0, error: `timeout (${REQUEST_TIMEOUT_MS}ms)` }
    }
    const message = err instanceof Error ? err.message : "unknown error"
    return { ok: false, status: 0, error: message }
  }
}
