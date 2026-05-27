import {
  LABELS,
  zoneLabel,
  type ContactFormValues,
  type Zone,
} from "@/lib/validations/contact"

/**
 * Template HTML email interne (notification équipe Valor Immo).
 * Sobre, sans émojis, sans cliché. Palette V4 : ivoire #F5F2EC + vert profond
 * #0F3D2E + or #C9A961.
 */

function formatNumber(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n)
}

function formatSurface(min: number, max: number): string {
  if (min === max) return `${formatNumber(min)} m²`
  return `${formatNumber(min)} – ${formatNumber(max)} m²`
}

function formatBudget(
  min: number | undefined,
  max: number | undefined,
  suffix: string,
): string {
  if (min === undefined && max === undefined) return "Non précisé"
  if (min !== undefined && max !== undefined) {
    if (min === max) return `${formatNumber(min)} ${suffix}`
    return `${formatNumber(min)} – ${formatNumber(max)} ${suffix}`
  }
  if (max !== undefined) return `Jusqu'à ${formatNumber(max)} ${suffix}`
  return `À partir de ${formatNumber(min!)} ${suffix}`
}

function formatZones(zones: Zone[]): string {
  return zones.map(zoneLabel).join(", ")
}

function row(label: string, value: string): string {
  return `<tr><td style="padding:8px 0;color:#5B6573;font-size:13px;vertical-align:top;width:38%;">${label}</td><td style="padding:8px 0;color:#0A0E1A;font-size:14px;font-weight:500;">${value}</td></tr>`
}

function section(title: string, body: string): string {
  return `
    <div style="margin-top:24px;padding:18px 20px;background:#F5F2EC;border-radius:8px;">
      <p style="margin:0 0 12px;color:#7A571E;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;">${title}</p>
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">${body}</table>
    </div>
  `.trim()
}

export function buildInternalSubject(lead: ContactFormValues): string {
  const typo = LABELS.typologie[lead.typologie]
  const zonePrincipale = zoneLabel(lead.zones[0]!)
  return `[Nouveau lead Valor Immo] ${lead.nom} — ${typo} — ${zonePrincipale}`
}

export function buildInternalHtml(lead: ContactFormValues): string {
  const now = new Date()
  const dateStr = now.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
  const timeStr = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const budgetSuffix =
    lead.transaction === "location" ? "€/mois HT HC" : "€ HT"

  const projetRows = [
    row("Typologie", LABELS.typologie[lead.typologie]),
    row("Transaction", LABELS.transaction[lead.transaction]),
    row("Surface", formatSurface(lead.surfaceMin, lead.surfaceMax)),
    lead.transaction === "location" || lead.transaction === "les-deux"
      ? row(
          "Budget loyer",
          formatBudget(lead.budgetMin, lead.budgetMax, "€/mois HT HC"),
        )
      : "",
    lead.transaction === "acquisition" || lead.transaction === "les-deux"
      ? row(
          "Budget acquisition",
          formatBudget(
            lead.transaction === "les-deux"
              ? lead.budgetMinAcquisition
              : lead.budgetMin,
            lead.transaction === "les-deux"
              ? lead.budgetMaxAcquisition
              : lead.budgetMax,
            "€ HT",
          ),
        )
      : "",
  ]
    .filter(Boolean)
    .join("")

  const contexteRows = [
    row("Deadline", LABELS.deadline[lead.deadline]),
    row("Financement", LABELS.financement[lead.financement]),
    row(
      "Secteur",
      lead.secteur === "autre" && lead.secteurAutre
        ? `Autre — ${lead.secteurAutre}`
        : LABELS.secteur[lead.secteur],
    ),
    row("Zones", formatZones(lead.zones)),
  ].join("")

  const coordsRows = [
    row("Nom", lead.nom),
    lead.societe ? row("Société", lead.societe) : "",
    row(
      "Email",
      `<a href="mailto:${lead.email}" style="color:#0F3D2E;text-decoration:underline;">${lead.email}</a>`,
    ),
    row(
      "Téléphone",
      `<a href="tel:${lead.telephone.replace(/[\s.-]/g, "")}" style="color:#0F3D2E;text-decoration:underline;">${lead.telephone}</a>`,
    ),
    lead.source ? row("Source", LABELS.source[lead.source]) : "",
    lead.message
      ? row("Message", lead.message.replace(/\n/g, "<br/>"))
      : "",
  ]
    .filter(Boolean)
    .join("")

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"/><title>Nouveau lead Valor Immo</title></head>
<body style="margin:0;padding:0;background:#FAF8F3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0A0E1A;">
  <div style="max-width:640px;margin:0 auto;padding:32px 24px;">
    <div style="padding:24px 28px;background:#0F3D2E;border-radius:8px 8px 0 0;color:#F5F2EC;">
      <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#C9A961;">Valor Immo · Immobilier commercial Paris</p>
      <h1 style="margin:8px 0 0;font-size:22px;font-weight:600;letter-spacing:-0.01em;">Nouveau lead capturé</h1>
      <p style="margin:8px 0 0;font-size:13px;opacity:0.8;">${dateStr} à ${timeStr}</p>
    </div>
    <div style="padding:8px 0 0;background:#fff;border-radius:0 0 8px 8px;border:1px solid rgba(15,61,46,0.08);border-top:0;padding:24px 28px 32px;">
      ${section("Étape 1 — Projet", projetRows)}
      ${section("Étape 2 — Contexte", contexteRows)}
      ${section("Étape 3 — Coordonnées", coordsRows)}
      <p style="margin:28px 0 0;padding-top:18px;border-top:1px solid rgba(15,61,46,0.08);font-size:12px;color:#5B6573;">Rappel sous 24h ouvrées requis.</p>
    </div>
  </div>
</body>
</html>`
}
