/**
 * scripts/captures-sprint-5c.ts
 *
 * Captures AVANT/APRÈS sprint 5c — typo témoignages + footer + vides verticaux.
 *
 * Usage :
 *   node --experimental-strip-types scripts/captures-sprint-5c.ts BEFORE
 *   node --experimental-strip-types scripts/captures-sprint-5c.ts AFTER
 */

import { chromium, type Page } from "playwright"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const MODE = (process.argv[2] ?? "BEFORE").toUpperCase()
const SUFFIX = MODE === "BEFORE" ? "before" : "after"
const OUT_DIR = resolve(process.cwd(), "captures/sprint-5c")
const URL = process.env.SITE_URL ?? "http://localhost:3004"

async function scrollToText(page: Page, needle: string, offsetCenter = 0.5) {
  const found = await page.evaluate(
    ({ n, off }) => {
      const needle = n.toLowerCase()
      const all = Array.from(document.querySelectorAll("h1, h2, h3, p, span"))
      const el = all.find((e) => {
        const txt = (e as HTMLElement).innerText?.toLowerCase() ?? ""
        if (!txt.includes(needle)) return false
        const childMatch = Array.from(e.children).some((c) =>
          (c as HTMLElement).innerText?.toLowerCase().includes(needle),
        )
        return !childMatch
      })
      if (!el) return null
      const rect = el.getBoundingClientRect()
      const target =
        window.scrollY + rect.top - window.innerHeight * off + rect.height / 2
      window.scrollTo({ top: target, behavior: "instant" })
      return { y: target, found: true }
    },
    { n: needle, off: offsetCenter },
  )
  if (!found) {
    throw new Error(`scrollToText: needle "${needle}" not found`)
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const browser = await chromium.launch()
  try {
    // 1. Witness (témoignages)
    {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" })
      const page = await ctx.newPage()
      await page.goto(`${URL}/`, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      await scrollToText(page, "Ils nous ont confié")
      await page.waitForTimeout(800)
      await page.screenshot({ path: `${OUT_DIR}/witness-${SUFFIX}-1440.png`, fullPage: false })
      console.log(`✓ witness-${SUFFIX}-1440`)
      await ctx.close()
    }

    // 2. Footer (depuis home, scroll en bas)
    {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" })
      const page = await ctx.newPage()
      await page.goto(`${URL}/`, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(1000)
      await page.screenshot({ path: `${OUT_DIR}/footer-${SUFFIX}-1440.png`, fullPage: false })
      console.log(`✓ footer-${SUFFIX}-1440`)
      await ctx.close()
    }

    // 3. ARGUS → Opportunités (transition)
    {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" })
      const page = await ctx.newPage()
      await page.goto(`${URL}/`, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      // Cadrer entre la fin d'ARGUS et le titre Opportunités
      await page.evaluate(() => {
        const h2 = Array.from(document.querySelectorAll("h2")).find((e) =>
          e.innerText?.toLowerCase().includes("nos dernières"),
        )
        if (h2) {
          const rect = h2.getBoundingClientRect()
          window.scrollBy(0, rect.top - 480) // place titre vers 480px (vide visible au-dessus)
        }
      })
      await page.waitForTimeout(800)
      await page.screenshot({ path: `${OUT_DIR}/argus-to-opportunites-${SUFFIX}-1440.png`, fullPage: false })
      console.log(`✓ argus-to-opportunites-${SUFFIX}-1440`)
      await ctx.close()
    }

    // 4. /l-agence "Qui sommes-nous"
    {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" })
      const page = await ctx.newPage()
      await page.goto(`${URL}/l-agence`, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      await scrollToText(page, "Qui sommes-nous")
      await page.waitForTimeout(800)
      await page.screenshot({ path: `${OUT_DIR}/agence-quisommes-${SUFFIX}-1440.png`, fullPage: false })
      console.log(`✓ agence-quisommes-${SUFFIX}-1440`)
      await ctx.close()
    }
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
