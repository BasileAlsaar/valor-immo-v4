/**
 * scripts/captures-correctif-2026-05-27.ts
 *
 * Captures correctif UI après FIX 1 (méthode 2 cols home + /l-agence) + FIX 2 (nav +20-30%, header h-48).
 */

import { chromium, type Page } from "playwright"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const OUT_DIR = resolve(process.cwd(), "docs/ux-review-2026-05-27/correctif-after")
const URL = process.env.SITE_URL ?? "http://localhost:3010"

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

    // 1. Home top — header h-48 + nav text-[15px]/2xl:text-[17px]
    await page.goto(`${URL}/`, { waitUntil: "load", timeout: 30000 })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1500)
    await page.screenshot({ path: `${OUT_DIR}/01-home-top-1440.png`, fullPage: false })
    console.log("✓ 01-home-top")

    // 2. Home — méthode 2 cols (24h / 48h)
    await scrollToText(page, "Brief précis", 0.5)
    await page.waitForTimeout(1500)
    await page.screenshot({ path: `${OUT_DIR}/02-home-methode-2cols-1440.png`, fullPage: false })
    console.log("✓ 02-home-methode-2cols")

    // 3. /l-agence méthode 2 cols (déjà OK MOD 4)
    await page.goto(`${URL}/l-agence`, { waitUntil: "load", timeout: 30000 })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1500)
    await scrollToText(page, "Brief précis", 0.5)
    await page.waitForTimeout(1500)
    await page.screenshot({ path: `${OUT_DIR}/03-agence-methode-2cols-1440.png`, fullPage: false })
    console.log("✓ 03-agence-methode-2cols")

    // 4. /gestion méthode (doit rester à 3 cols : 100%/24h/1)
    await page.goto(`${URL}/gestion`, { waitUntil: "load", timeout: 30000 })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1500)
    await scrollToText(page, "Réactivité", 0.5)
    await page.waitForTimeout(1500)
    await page.screenshot({ path: `${OUT_DIR}/04-gestion-methode-3cols-1440.png`, fullPage: false })
    console.log("✓ 04-gestion-methode-3cols")

    // 5. /l-agence top — PageHero pt-56 sous header h-48
    await page.goto(`${URL}/l-agence`, { waitUntil: "load", timeout: 30000 })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1500)
    await page.screenshot({ path: `${OUT_DIR}/05-agence-top-1440.png`, fullPage: false })
    console.log("✓ 05-agence-top")

    await ctx.close()
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
