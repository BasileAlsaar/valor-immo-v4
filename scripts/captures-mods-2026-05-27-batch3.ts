/**
 * scripts/captures-mods-2026-05-27-batch3.ts
 *
 * Captures après MOD 7 — page /estimations avec valeurs 1bis/2 réalistes
 * + carte ARGUS recalibrée (paliers 300/450/550/650/800/950).
 */

import { chromium, type Page } from "playwright"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const OUT_DIR = resolve(process.cwd(), "docs/ux-review-2026-05-27")
const URL = process.env.SITE_URL ?? "http://localhost:3001"

async function scrollToText(page: Page, needle: string, offsetCenter = 0.5) {
  await page.evaluate(
    ({ n, off }) => {
      const needle = n.toLowerCase()
      const all = Array.from(document.querySelectorAll("h1, h2, h3, p, span, th, td"))
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

    // 1. /estimations — carte + tableau (vue principale)
    await page.goto(`${URL}/estimations`, { waitUntil: "networkidle" })
    await page.evaluate(() => document.fonts.ready)
    // Attendre le rendu carte MapLibre
    await page.waitForTimeout(3000)
    await scrollToText(page, "Quelle est la valeur locative", 0.2)
    await page.waitForTimeout(2000)
    await page.screenshot({ path: `${OUT_DIR}/after-estimations-map-table-1440.png`, fullPage: false })
    console.log("✓ after-estimations-map-table-1440")

    // 2. /estimations — tableau seul (scroll au tableau, focus pied)
    await page.evaluate(() => {
      const table = document.querySelector("table")
      if (table) {
        const rect = table.getBoundingClientRect()
        window.scrollBy(0, rect.top - 80)
      }
    })
    await page.waitForTimeout(1000)
    await page.screenshot({ path: `${OUT_DIR}/after-estimations-table-1440.png`, fullPage: false })
    console.log("✓ after-estimations-table-1440")

    // 3. Bas du tableau pour voir le disclaimer
    await page.evaluate(() => {
      const tbody = document.querySelector("tbody")
      if (tbody) tbody.scrollTop = tbody.scrollHeight
      const disclaimer = Array.from(document.querySelectorAll("p")).find((e) =>
        (e as HTMLElement).innerText?.toLowerCase().includes("valeurs indicatives"),
      )
      if (disclaimer) {
        const rect = (disclaimer as HTMLElement).getBoundingClientRect()
        window.scrollBy(0, rect.top - 400)
      }
    })
    await page.waitForTimeout(800)
    await page.screenshot({ path: `${OUT_DIR}/after-estimations-disclaimer-1440.png`, fullPage: false })
    console.log("✓ after-estimations-disclaimer-1440")

    await ctx.close()
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
