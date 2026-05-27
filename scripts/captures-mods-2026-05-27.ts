/**
 * scripts/captures-mods-2026-05-27.ts
 *
 * Captures après MOD 1 + MOD 2 (header refondu + lien GESTION).
 * Stop visuel pour validation Basile avant d'enchaîner MOD 4/5/7/6/3.
 */

import { chromium } from "playwright"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const OUT_DIR = resolve(process.cwd(), "docs/ux-review-2026-05-27")
const URL = process.env.SITE_URL ?? "http://localhost:3001"

const VIEWPORTS = [
  { name: "1440", width: 1440, height: 900 },
  { name: "1280", width: 1280, height: 800 },
] as const

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const browser = await chromium.launch()
  try {
    for (const vp of VIEWPORTS) {
      // Home — top (header transparent + nav blanche)
      {
        const ctx = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          reducedMotion: "reduce",
        })
        const page = await ctx.newPage()
        await page.goto(`${URL}/`, { waitUntil: "networkidle" })
        await page.evaluate(() => document.fonts.ready)
        await page.waitForTimeout(1200)
        await page.screenshot({ path: `${OUT_DIR}/after-home-top-${vp.name}.png`, fullPage: false })
        console.log(`✓ after-home-top-${vp.name}`)

        // Home — scrolled (header cream + nav noire)
        await page.evaluate(() => window.scrollTo({ top: 700, behavior: "instant" }))
        await page.waitForTimeout(800)
        await page.screenshot({ path: `${OUT_DIR}/after-home-scrolled-${vp.name}.png`, fullPage: false })
        console.log(`✓ after-home-scrolled-${vp.name}`)

        await ctx.close()
      }

      // /l-agence — top (page interne, header par-dessus background sombre)
      {
        const ctx = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          reducedMotion: "reduce",
        })
        const page = await ctx.newPage()
        await page.goto(`${URL}/l-agence`, { waitUntil: "networkidle" })
        await page.evaluate(() => document.fonts.ready)
        await page.waitForTimeout(800)
        await page.screenshot({ path: `${OUT_DIR}/after-agence-top-${vp.name}.png`, fullPage: false })
        console.log(`✓ after-agence-top-${vp.name}`)
        await ctx.close()
      }
    }
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
