import { FUNNELS, resolveFieldDisplay } from "@/lib/data/funnels"
import { PARCOURS_LABELS, type Parcours } from "@/lib/validations/funnel"

function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export function buildFunnelSubject(parcours: Parcours): string {
  return `[${PARCOURS_LABELS[parcours]}] nouveau lead Valor Immo`
}

export function buildFunnelHtml(
  parcours: Parcours,
  rawFields: Record<string, string | boolean>,
): string {
  const config = FUNNELS[parcours]
  const rows: string[] = []
  for (const [name, raw] of Object.entries(rawFields)) {
    const { label, value } = resolveFieldDisplay(config, name, raw)
    rows.push(
      `<tr>
        <td style="padding:8px 16px;border-bottom:1px solid #e5e5e5;color:#5b6573;font-size:13px;width:200px;vertical-align:top">${escape(label)}</td>
        <td style="padding:8px 16px;border-bottom:1px solid #e5e5e5;color:#0a0e1a;font-size:14px;vertical-align:top">${escape(value)}</td>
      </tr>`,
    )
  }
  return `<!doctype html>
<html lang="fr"><body style="margin:0;background:#f5f2ec;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#0a0e1a">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f2ec;padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%">
        <tr><td style="padding:24px 24px 8px;background:#0F3D2E;color:#F5F2EC">
          <p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#C9A961">Valor Immo · Nouveau lead</p>
          <h1 style="margin:8px 0 0;font-size:22px;letter-spacing:-0.01em">Parcours ${escape(PARCOURS_LABELS[parcours])}</h1>
        </td></tr>
        <tr><td style="padding:24px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows.join("")}</table>
        </td></tr>
        <tr><td style="padding:16px 24px;background:#f5f2ec;color:#5b6573;font-size:12px">
          Lead envoyé via /${parcours} — consentement RGPD coché.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}
