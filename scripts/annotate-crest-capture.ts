/**
 * Trace 3 lignes horizontales rouges sur la capture 1440 pour rendre
 * visuellement évident où se trouvent les éléments mesurés :
 *  y=47 : top du V de "VENTE" (cible utilisateur)
 *  y=54 : top du V du crest (mon état actuel)
 *  y=150 : zone où l'utilisateur dit voir "le sommet du crest"
 *
 * Sortie : docs/ux-review-2026-05-25/after-correctif-v4/hero-1440-annotated.png
 */
import { chromium } from "playwright"
import sharp from "sharp"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const URL = process.env.SITE_URL ?? "http://localhost:3010"
const OUT_DIR = resolve(process.cwd(), "docs/ux-review-2026-05-25/after-correctif-v4")

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const browser = await chromium.launch()
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  })
  const page = await ctx.newPage()
  await page.goto(`${URL}/`, { waitUntil: "networkidle" })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1200)
  const buf = await page.screenshot({ fullPage: false })

  // Trace 3 lignes horizontales SVG
  const W = 1440, H = 900
  const svgOverlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <line x1="0" y1="47" x2="${W}" y2="47" stroke="#ff0066" stroke-width="1" stroke-dasharray="6,4"/>
    <text x="10" y="44" fill="#ff0066" font-family="Arial" font-size="11" font-weight="bold">y=47  TOP du V de VENTE (cible)</text>
    <line x1="0" y1="54" x2="${W}" y2="54" stroke="#ffcc00" stroke-width="1" stroke-dasharray="6,4"/>
    <text x="10" y="68" fill="#ffcc00" font-family="Arial" font-size="11" font-weight="bold">y=54  TOP du V du crest (actuel, après top-8)</text>
    <line x1="0" y1="150" x2="${W}" y2="150" stroke="#00aaff" stroke-width="1" stroke-dasharray="6,4"/>
    <text x="10" y="147" fill="#00aaff" font-family="Arial" font-size="11" font-weight="bold">y=150  ce que l'utilisateur perçoit comme "sommet du crest"</text>
  </svg>`
  await sharp(buf)
    .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
    .toFile(`${OUT_DIR}/hero-1440-annotated.png`)
  console.log(`✓ hero-1440-annotated.png`)
  await ctx.close()
  await browser.close()
}
main().catch((e) => { console.error(e); process.exit(1) })
