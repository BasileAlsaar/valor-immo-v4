/**
 * scripts/captures-mod3-gestion.ts
 *
 * Captures MOD 3 — page /gestion en 5 sections.
 */

import { chromium, type Page } from "playwright"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const OUT_DIR = resolve(process.cwd(), "docs/ux-review-2026-05-27/gestion-after")
const URL = process.env.SITE_URL ?? "http://localhost:3001"

async function scrollToText(page: Page, needle: string, offsetCenter = 0.15) {
  await page.evaluate(
    ({ n, off }) => {
      const needle = n.toLowerCase()
      const all = Array.from(document.querySelectorAll("h1, h2, h3, h4, p, span"))
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
    await page.goto(`${URL}/gestion`, { waitUntil: "load", timeout: 30000 })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(2000)

    // 1. Hero
    await page.screenshot({ path: `${OUT_DIR}/01-hero-1440.png`, fullPage: false })
    console.log("✓ 01-hero")

    // 2. Section services 4 cards
    await scrollToText(page, "Trois métiers", 0.15)
    await page.waitForTimeout(1200)
    await page.screenshot({ path: `${OUT_DIR}/02-services-1440.png`, fullPage: false })
    console.log("✓ 02-services")

    // 3. Section méthode (3 chiffres dédiés)
    await scrollToText(page, "Du brief à la signature", 0.15)
    await page.waitForTimeout(1200)
    await page.screenshot({ path: `${OUT_DIR}/03-methode-1440.png`, fullPage: false })
    console.log("✓ 03-methode")

    // 4. Section tarification
    await scrollToText(page, "Honoraires", 0.15)
    await page.waitForTimeout(1200)
    await page.screenshot({ path: `${OUT_DIR}/04-tarification-1440.png`, fullPage: false })
    console.log("✓ 04-tarification")

    // 5. Section typologies
    await scrollToText(page, "Six classes d'actifs", 0.15)
    await page.waitForTimeout(1200)
    await page.screenshot({ path: `${OUT_DIR}/05-typologies-1440.png`, fullPage: false })
    console.log("✓ 05-typologies")

    // 6. CTA final
    await scrollToText(page, "Discutons-en", 0.15)
    await page.waitForTimeout(1200)
    await page.screenshot({ path: `${OUT_DIR}/06-callback-1440.png`, fullPage: false })
    console.log("✓ 06-callback")

    await ctx.close()
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
