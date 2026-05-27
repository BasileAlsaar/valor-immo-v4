import { chromium } from "playwright"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const OUT_DIR = resolve(process.cwd(), "docs/ux-review-2026-05-27/correctif-final")
const URL = process.env.SITE_URL ?? "http://localhost:3010"

const VIEWPORTS = [
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
] as const

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const browser = await chromium.launch()
  try {
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        reducedMotion: "no-preference",
      })
      const page = await ctx.newPage()
      await page.goto(`${URL}/`, { waitUntil: "load", timeout: 30000 })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(2500)
      await page.screenshot({ path: `${OUT_DIR}/hero-${vp.name}-after.png`, fullPage: false })
      console.log(`✓ hero-${vp.name}`)
      await ctx.close()
    }

    // Bonus : /vente callback
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" })
    const page = await ctx.newPage()
    await page.goto(`${URL}/vente`, { waitUntil: "load", timeout: 30000 })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(2000)
    await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll("h2, p, span"))
      const el = all.find((e) => (e as HTMLElement).innerText?.toLowerCase().includes("discutons-en"))
      if (el) {
        const rect = el.getBoundingClientRect()
        window.scrollTo({ top: window.scrollY + rect.top - 150, behavior: "instant" })
      }
    })
    await page.waitForTimeout(1500)
    await page.screenshot({ path: `${OUT_DIR}/callback-vente-1440-after.png`, fullPage: false })
    console.log("✓ callback-vente-1440")
    await ctx.close()
  } finally {
    await browser.close()
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
