import { Fragment } from "react"

import { cn } from "@/lib/utils"

/**
 * Rendu tolérant du champ `content.comment` d'Apimo (texte libre saisi
 * dans le CRM). Aucun HTML n'est jamais injecté — le texte est rendu
 * caractère par caractère via React (donc pas de `dangerouslySetInnerHTML`).
 *
 * Règles de parsing (dérivées des cas réels VI13 & VI14) :
 *
 *  1. `\r\n\r\n` (ligne vide) sépare des paragraphes.
 *  2. `\r\n` simple à l'intérieur d'un paragraphe = saut de ligne visuel
 *     (`<br>`). Sans ça, les blocs de signature "YOAV MARCIANO\r\nVALOR
 *     IMMO\r\n…" étaient collapsés en une seule ligne.
 *  3. Une ligne commençant par `* ` ou `- ` (astérisque/tiret + espace)
 *     devient un `<li>`. Les lignes consécutives de ce type se
 *     regroupent en un unique `<ul>`.
 *  4. Une ligne texte contenant ` * ` en milieu (séparateur inline saisi
 *     par erreur côté Apimo) est éclatée en items de liste — uniquement
 *     si le split produit au moins 2 morceaux non vides.
 *  5. Un astérisque isolé sans espaces des deux côtés (`*vraiment*`,
 *     `5* étage`) reste du texte brut : il ne casse pas le paragraphe.
 *  6. Une ligne `* ` sans contenu est ignorée (pas de `<li>` vide).
 */

type Block =
  | { kind: "p"; lines: string[] }
  | { kind: "ul"; items: string[] }

const BULLET_LINE_RE = /^[*\-]\s+(.*)$/
const INLINE_STAR_SEP_RE = / \* /

function parseDescription(raw: string): Block[] {
  const text = raw.replace(/\r\n?/g, "\n").trim()
  if (!text) return []

  const blocks: Block[] = []

  for (const rawBlock of text.split(/\n{2,}/)) {
    const lines = rawBlock
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
    if (lines.length === 0) continue

    let textBuffer: string[] = []
    let listBuffer: string[] = []

    const flushText = () => {
      if (textBuffer.length > 0) {
        blocks.push({ kind: "p", lines: textBuffer })
        textBuffer = []
      }
    }
    const flushList = () => {
      if (listBuffer.length > 0) {
        blocks.push({ kind: "ul", items: listBuffer })
        listBuffer = []
      }
    }

    for (const line of lines) {
      const bullet = line.match(BULLET_LINE_RE)
      if (bullet) {
        const content = bullet[1].trim()
        if (!content) continue
        flushText()
        listBuffer.push(content)
        continue
      }

      if (INLINE_STAR_SEP_RE.test(line)) {
        const parts = line
          .split(INLINE_STAR_SEP_RE)
          .map((p) => p.trim())
          .filter(Boolean)
        if (parts.length >= 2) {
          flushText()
          for (const p of parts) listBuffer.push(p)
          continue
        }
      }

      flushList()
      textBuffer.push(line)
    }

    flushText()
    flushList()
  }

  return blocks
}

type Props = {
  text: string | null | undefined
  className?: string
}

export function DescriptionApimo({ text, className }: Props) {
  if (!text) return null
  const blocks = parseDescription(text)
  if (blocks.length === 0) return null

  return (
    <div
      className={cn(
        "space-y-4 text-base leading-relaxed text-ink/80",
        className
      )}
    >
      {blocks.map((block, i) =>
        block.kind === "p" ? (
          <p key={i}>
            {block.lines.map((line, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>
        ) : (
          <ul key={i} className="list-disc space-y-1 pl-5 marker:text-gold-deep">
            {block.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        )
      )}
    </div>
  )
}
