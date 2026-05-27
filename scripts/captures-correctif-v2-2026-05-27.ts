/**
 * scripts/captures-correctif-v2-2026-05-27.ts
 *
 * Captures correctif v2 :
 * - FIX 1 : méthode 3 cols (1 INTERLOCUTEUR CONFIRMÉ)
 * - FIX 2 : header h-56 + nav text-[19px]/[21px] + bouton aligné
 * - FIX 3 : l-agence Qui sommes-nous + Direction 2 cards (Yoav + Basile)
 * - FIX 4/5/Q3 : audit interlocuteur / petite couronne / directeurs
 */

import { chromium, type Page } from "playwright"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const OUT_DIR = resolve(process.cwd(), "docs/ux-review-2026-05-27/correctif-v2-after")
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

    // 1. Home top — header h-56 + nav text-[19px] / [21px]
    await page.goto(`${URL}/`, { waitUntil: "load", timeout: 30000 })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1500)
    await page.screenshot({ path: `${OUT_DIR}/01-home-top-1440.png`, fullPage: false })
    console.log("✓ 01-home-top")

    // 2. Home — méthode 3 cols (24h / 48h / 1 INTERLOCUTEUR CONFIRMÉ)
    await scrollToText(page, "Brief précis", 0.5)
    await page.waitForTimeout(1500)
    await page.screenshot({ path: `${OUT_DIR}/02-home-methode-3cols-1440.png`, fullPage: false })
    console.log("✓ 02-home-methode-3cols")

    // 3. /l-agence top — hero title "un interlocuteur confirmé"
    await page.goto(`${URL}/l-agence`, { waitUntil: "load", timeout: 30000 })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1500)
    await page.screenshot({ path: `${OUT_DIR}/03-agence-hero-1440.png`, fullPage: false })
    console.log("✓ 03-agence-hero")

    // 4. /l-agence — Qui sommes-nous reformulé
    await scrollToText(page, "Une équipe resserrée", 0.3)
    await page.waitForTimeout(1500)
    await page.screenshot({ path: `${OUT_DIR}/04-agence-quisommes-1440.png`, fullPage: false })
    console.log("✓ 04-agence-quisommes")

    // 5. /l-agence — Direction 2 cards (Yoav + Basile)
    await scrollToText(page, "Deux interlocuteurs", 0.2)
    await page.waitForTimeout(1500)
    await page.screenshot({ path: `${OUT_DIR}/05-agence-direction-2cards-1440.png`, fullPage: false })
    console.log("✓ 05-agence-direction-2cards")

    // 6. /l-agence — méthode 3 cols depuis DEFAULT
    await scrollToText(page, "Brief précis", 0.5)
    await page.waitForTimeout(1500)
    await page.screenshot({ path: `${OUT_DIR}/06-agence-methode-3cols-1440.png`, fullPage: false })
    console.log("✓ 06-agence-methode-3cols")

    // 7. /gestion méthode 3 cols dédiés (100%/24h/1 INTERLOCUTEUR DÉDIÉ — preserved)
    await page.goto(`${URL}/gestion`, { waitUntil: "load", timeout: 30000 })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1500)
    await scrollToText(page, "Réactivité", 0.5)
    await page.waitForTimeout(1500)
    await page.screenshot({ path: `${OUT_DIR}/07-gestion-methode-3cols-1440.png`, fullPage: false })
    console.log("✓ 07-gestion-methode-3cols")

    await ctx.close()
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
