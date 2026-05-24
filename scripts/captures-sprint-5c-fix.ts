/**
 * scripts/captures-sprint-5c-fix.ts
 *
 * Captures 5C-FIX — 5 vues après corrections audit visuel Basile.
 */

import { chromium, type Page } from "playwright"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

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
      return true
    },
    { n: needle, off: offsetCenter },
  )
  if (!found) throw new Error(`scrollToText: "${needle}" not found`)
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const browser = await chromium.launch()
  try {
    // 1. home-hero-logo-fix (top of home, logo + nav)
    {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" })
      const page = await ctx.newPage()
      await page.goto(`${URL}/`, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(1500)
      await page.screenshot({ path: `${OUT_DIR}/home-hero-logo-fix-1440.png`, fullPage: false })
      console.log("✓ home-hero-logo-fix-1440")
      await ctx.close()
    }

    // 2. witness-fix
    {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" })
      const page = await ctx.newPage()
      await page.goto(`${URL}/`, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      await scrollToText(page, "Ils nous ont confié")
      await page.waitForTimeout(800)
      await page.screenshot({ path: `${OUT_DIR}/witness-fix-1440.png`, fullPage: false })
      console.log("✓ witness-fix-1440")
      await ctx.close()
    }

    // 3. footer-fix
    {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" })
      const page = await ctx.newPage()
      await page.goto(`${URL}/`, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(1000)
      await page.screenshot({ path: `${OUT_DIR}/footer-fix-1440.png`, fullPage: false })
      console.log("✓ footer-fix-1440")
      await ctx.close()
    }

    // 4. argus-to-opportunites-fix
    {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" })
      const page = await ctx.newPage()
      await page.goto(`${URL}/`, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      await page.evaluate(() => {
        const h2 = Array.from(document.querySelectorAll("h2")).find((e) =>
          e.innerText?.toLowerCase().includes("nos dernières"),
        )
        if (h2) {
          const rect = h2.getBoundingClientRect()
          window.scrollBy(0, rect.top - 480)
        }
      })
      await page.waitForTimeout(800)
      await page.screenshot({ path: `${OUT_DIR}/argus-to-opportunites-fix-1440.png`, fullPage: false })
      console.log("✓ argus-to-opportunites-fix-1440")
      await ctx.close()
    }

    // 5. agence-quisommes-fix
    {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" })
      const page = await ctx.newPage()
      await page.goto(`${URL}/l-agence`, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      await scrollToText(page, "Qui sommes-nous")
      await page.waitForTimeout(800)
      await page.screenshot({ path: `${OUT_DIR}/agence-quisommes-fix-1440.png`, fullPage: false })
      console.log("✓ agence-quisommes-fix-1440")
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
