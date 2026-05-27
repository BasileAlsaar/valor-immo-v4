/**
 * scripts/captures-mods-2026-05-27-batch4.ts
 *
 * Captures grille classes d'actifs après remplacement partiel des photos
 * (MOD 6 — étape intermédiaire).
 */

import { chromium, type Page } from "playwright"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const OUT_DIR = resolve(process.cwd(), "docs/ux-review-2026-05-27")
const URL = process.env.SITE_URL ?? "http://localhost:3001"

async function scrollToText(page: Page, needle: string, offsetCenter = 0.4) {
  await page.evaluate(
    ({ n, off }) => {
      const needle = n.toLowerCase()
      const all = Array.from(document.querySelectorAll("h2, h3, p, span"))
      const el = all.find((e) => (e as HTMLElement).innerText?.toLowerCase().includes(needle))
      if (!el) return
      const rect = el.getBoundingClientRect()
      const target = window.scrollY + rect.top - window.innerHeight * off + rect.height / 2
      window.scrollTo({ top: target, behavior: "instant" })
    },
    { n: needle, off: offsetCenter },
  )
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const browser = await chromium.launch()
  try {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "no-preference",
    })
    const page = await ctx.newPage()

    // 1. Home — grille classes d'actifs
    await page.goto(`${URL}/`, { waitUntil: "networkidle" })
    await page.evaluate(() => document.fonts.ready)
    await scrollToText(page, "Explorez par typologie", 0.15)
    await page.waitForTimeout(2000)
    await page.screenshot({ path: `${OUT_DIR}/after-home-categories-grid-1440.png`, fullPage: false })
    console.log("✓ after-home-categories-grid-1440")

    // 2. Page /classes-d-actifs (liste full)
    await page.goto(`${URL}/classes-d-actifs`, { waitUntil: "networkidle" })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(2000)
    await scrollToText(page, "Locaux commerciaux", 0.2)
    await page.waitForTimeout(1500)
    await page.screenshot({ path: `${OUT_DIR}/after-classes-actifs-list-1440.png`, fullPage: false })
    console.log("✓ after-classes-actifs-list-1440")

    await ctx.close()
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
