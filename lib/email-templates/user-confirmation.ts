import {
  LABELS,
  zoneLabel,
  type ContactFormValues,
} from "@/lib/validations/contact"
import { SITE } from "@/lib/site"

/**
 * Template HTML confirmation envoyée au prospect.
 * Sobre, professionnel, premium. Pas d'émojis, pas d'exclamation multiple.
 */

function formatNumber(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n)
}

function extractPrenom(nom: string): string {
  const trimmed = nom.trim()
  const firstSpace = trimmed.indexOf(" ")
  return firstSpace > 0 ? trimmed.slice(0, firstSpace) : trimmed
}

/**
 * Renvoie les 4 derniers chiffres d'un numéro FR avec l'espace conservé.
 * Exemple : "06 12 34 56 89" → "56 89".
 *
 * Pratique RGPD : si l'email est forwardé ou intercepté, le numéro complet
 * n'est pas exposé, mais le client reconnaît son propre numéro grâce aux
 * 4 derniers chiffres.
 */
export function maskPhoneLast4(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  const last4 = digits.slice(-4)
  if (last4.length < 4) return phone
  return `${last4.slice(0, 2)} ${last4.slice(2)}`
}

export function buildUserSubject(): string {
  return "Votre demande a bien été reçue — Valor Immo"
}

export function buildUserHtml(lead: ContactFormValues): string {
  const prenom = extractPrenom(lead.nom)
  const typo = LABELS.typologie[lead.typologie]
  const zonePrincipale = zoneLabel(lead.zones[0]!)
  const phoneMasked = maskPhoneLast4(lead.telephone)

  let budgetLine = ""
  if (lead.transaction === "location" && lead.budgetMax) {
    budgetLine = `<tr><td style="padding:6px 0;color:#5B6573;font-size:13px;width:38%;">Budget loyer</td><td style="padding:6px 0;color:#0A0E1A;font-size:14px;font-weight:500;">jusqu'à ${formatNumber(lead.budgetMax)} €/mois HT HC</td></tr>`
  } else if (lead.transaction === "acquisition" && lead.budgetMax) {
    budgetLine = `<tr><td style="padding:6px 0;color:#5B6573;font-size:13px;width:38%;">Budget acquisition</td><td style="padding:6px 0;color:#0A0E1A;font-size:14px;font-weight:500;">jusqu'à ${formatNumber(lead.budgetMax)} € HT</td></tr>`
  } else if (lead.transaction === "les-deux") {
    if (lead.budgetMax) {
      budgetLine += `<tr><td style="padding:6px 0;color:#5B6573;font-size:13px;width:38%;">Budget loyer</td><td style="padding:6px 0;color:#0A0E1A;font-size:14px;font-weight:500;">jusqu'à ${formatNumber(lead.budgetMax)} €/mois HT HC</td></tr>`
    }
    if (lead.budgetMaxAcquisition) {
      budgetLine += `<tr><td style="padding:6px 0;color:#5B6573;font-size:13px;width:38%;">Budget acquisition</td><td style="padding:6px 0;color:#0A0E1A;font-size:14px;font-weight:500;">jusqu'à ${formatNumber(lead.budgetMaxAcquisition)} € HT</td></tr>`
    }
  }

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"/><title>Votre demande Valor Immo</title></head>
<body style="margin:0;padding:0;background:#FAF8F3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0A0E1A;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="padding:28px 32px;background:#0F3D2E;border-radius:8px 8px 0 0;color:#F5F2EC;">
      <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#C9A961;">Valor Immo · Immobilier commercial Paris</p>
    </div>
    <div style="padding:32px;background:#fff;border-radius:0 0 8px 8px;border:1px solid rgba(15,61,46,0.08);border-top:0;">
      <p style="margin:0;font-size:15px;line-height:1.6;">Bonjour ${prenom},</p>
      <p style="margin:16px 0 0;font-size:15px;line-height:1.6;">Nous avons bien reçu votre demande concernant <strong>${typo}</strong> dans <strong>${zonePrincipale}</strong>. Un membre de notre équipe vous recontacte sous 24h ouvrées au numéro se terminant par ${phoneMasked}.</p>
      <div style="margin-top:28px;padding:18px 20px;background:#F5F2EC;border-radius:8px;">
        <p style="margin:0 0 12px;color:#7A571E;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;">Récapitulatif de votre demande</p>
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:6px 0;color:#5B6573;font-size:13px;width:38%;">Typologie</td><td style="padding:6px 0;color:#0A0E1A;font-size:14px;font-weight:500;">${typo}</td></tr>
          ${budgetLine}
        </table>
      </div>
      <p style="margin:28px 0 0;font-size:13px;line-height:1.6;color:#5B6573;">Cet email confirme uniquement la réception de votre demande.</p>
      <p style="margin:24px 0 0;padding-top:20px;border-top:1px solid rgba(15,61,46,0.08);font-size:13px;line-height:1.6;color:#5B6573;">Valor Immo<br/>${SITE.address.line1}, ${SITE.address.line2}<br/>${SITE.telephoneDisplay}</p>
    </div>
  </div>
</body>
</html>`
}
