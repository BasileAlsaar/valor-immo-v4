/**
 * scripts/captures-correctif-v4.ts
 *
 * Micro-correctif v4 : top du crest aligné avec TOP des liens nav (pas
 * baseline). Capture les 5 viewports + annotation 1440 avec les 2 lignes
 * de repère (VENTE V tip, crest V tip).
 */
import { chromium } from "playwright"
import sharp from "sharp"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const OUT_DIR = resolve(process.cwd(), "docs/ux-review-2026-05-25/after-correctif-v4")
const URL = process.env.SITE_URL ?? "http://localhost:3010"

const VIEWPORTS = [
  { w: 1920, h: 1080, tag: "1920" },
  { w: 1440, h: 900, tag: "1440" },
  { w: 1280, h: 800, tag: "1280" },
  { w: 1024, h: 768, tag: "1024" },
  { w: 390, h: 844, tag: "390" },
]

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const browser = await chromium.launch()
  try {
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({
        viewport: { width: vp.w, height: vp.h },
        reducedMotion: "reduce",
      })
      const page = await ctx.newPage()
      await page.goto(`${URL}/`, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(1200)
      const buf = await page.screenshot({ fullPage: false })
      await sharp(buf).toFile(`${OUT_DIR}/hero-${vp.tag}.png`)
      console.log(`✓ hero-${vp.tag}`)

      // Annotation 1440 uniquement
      if (vp.tag === "1440") {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${vp.w}" height="${vp.h}">
          <line x1="0" y1="47" x2="${vp.w}" y2="47" stroke="#ff0066" stroke-width="1" stroke-dasharray="6,4"/>
          <text x="10" y="44" fill="#ff0066" font-family="Arial" font-size="11" font-weight="bold">y=47  TOP du V de VENTE (cible utilisateur)</text>
          <line x1="0" y1="46" x2="${vp.w}" y2="46" stroke="#00ff66" stroke-width="1" stroke-dasharray="3,3"/>
          <text x="500" y="44" fill="#00ff66" font-family="Arial" font-size="11" font-weight="bold">y=46  TOP du V du crest (apres top-6) — Δ -1px</text>
        </svg>`
        await sharp(buf)
          .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
          .toFile(`${OUT_DIR}/hero-1440-annotated.png`)
        console.log(`✓ hero-1440-annotated.png`)
      }
      await ctx.close()
    }
  } finally {
    await browser.close()
  }
}
main().catch((e) => { console.error(e); process.exit(1) })
