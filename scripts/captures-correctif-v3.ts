/**
 * scripts/captures-correctif-v3.ts
 *
 * Micro-correctif v3 : top du crest aligné avec baseline des liens nav.
 * Capture les 5 viewports dans docs/ux-review-2026-05-25/after-correctif-v3/
 */
import { chromium } from "playwright"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const OUT_DIR = resolve(process.cwd(), "docs/ux-review-2026-05-25/after-correctif-v3")
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
      await page.screenshot({
        path: `${OUT_DIR}/hero-${vp.tag}.png`,
        fullPage: false,
      })
      console.log(`✓ hero-${vp.tag}`)
      await ctx.close()
    }
  } finally {
    await browser.close()
  }
}
main().catch((e) => { console.error(e); process.exit(1) })
