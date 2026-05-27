/**
 * scripts/captures-mods-2026-05-27-batch2.ts
 *
 * Captures après MOD 4 + MOD 5 (page /l-agence — méthode 2 colonnes + CallbackSection enrichi).
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
      const all = Array.from(document.querySelectorAll("h1, h2, h3, p, span"))
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
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" })
    const page = await ctx.newPage()

    // MOD 4 — section méthode /l-agence (2 colonnes)
    await page.goto(`${URL}/l-agence`, { waitUntil: "networkidle" })
    await page.evaluate(() => document.fonts.ready)
    await scrollToText(page, "Brief précis", 0.6)
    await page.waitForTimeout(1800)
    await page.screenshot({ path: `${OUT_DIR}/after-agence-methode-1440.png`, fullPage: false })
    console.log("✓ after-agence-methode-1440")

    // MOD 5 — CallbackSection enrichi (bas /l-agence)
    await scrollToText(page, "Discutons-en", 0.4)
    await page.waitForTimeout(1800)
    await page.screenshot({ path: `${OUT_DIR}/after-agence-callback-1440.png`, fullPage: false })
    console.log("✓ after-agence-callback-1440")

    await ctx.close()

    // Idem en 1280
    const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "no-preference" })
    const page2 = await ctx2.newPage()
    await page2.goto(`${URL}/l-agence`, { waitUntil: "networkidle" })
    await page2.evaluate(() => document.fonts.ready)
    await scrollToText(page2, "Brief précis", 0.6)
    await page2.waitForTimeout(1800)
    await page2.screenshot({ path: `${OUT_DIR}/after-agence-methode-1280.png`, fullPage: false })
    console.log("✓ after-agence-methode-1280")
    await scrollToText(page2, "Discutons-en", 0.4)
    await page2.waitForTimeout(1800)
    await page2.screenshot({ path: `${OUT_DIR}/after-agence-callback-1280.png`, fullPage: false })
    console.log("✓ after-agence-callback-1280")
    await ctx2.close()
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
