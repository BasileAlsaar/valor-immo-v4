/**
 * Slug de fiche bien : `kebab(title) + "-" + reference.toLowerCase()`.
 *
 * Choix :
 *  - la référence Apimo (VI1, VI2, …) est toujours à la fin → parsing tail
 *    robuste et redirect canonique si le titre change côté CRM.
 *  - accents stripés, non-alphanumérique compressé en "-", pas de trailing "-".
 *  - cap 80 caractères sur la partie titre (URL propre + limite raisonnable).
 *  - fallback = référence seule si le titre est vide.
 */

const TITLE_CAP = 80
// Marques diacritiques combinantes Unicode U+0300…U+036F (accents décomposés
// après normalize("NFD")).
const DIACRITICS_RE = /[̀-ͯ]/g

function slugifyTitle(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS_RE, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, TITLE_CAP)
    .replace(/-+$/g, "")
}

export function computeSlug(
  title: string | null | undefined,
  reference: string
): string {
  const ref = reference.toLowerCase()
  const t = title ? slugifyTitle(title) : ""
  return t ? `${t}-${ref}` : ref
}

/**
 * Extrait la référence en fin de slug. Retourne `null` si aucune séquence
 * `[a-z0-9]+` en queue après un `-`. La reference peut aussi être le slug
 * entier (fallback sans titre).
 */
export function extractReferenceFromSlug(slug: string): string | null {
  const clean = slug.toLowerCase().trim()
  if (!clean) return null
  const dashIdx = clean.lastIndexOf("-")
  const tail = dashIdx >= 0 ? clean.slice(dashIdx + 1) : clean
  return /^[a-z0-9]+$/.test(tail) ? tail : null
}
