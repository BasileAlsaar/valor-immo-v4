/**
 * scripts/captures-mod6-after.ts
 *
 * Captures MOD 6 — photos after.
 * Grille + 9 hero pages où les photos categories servent de background.
 */

import { chromium, type Page } from "playwright"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const OUT_DIR = resolve(process.cwd(), "docs/ux-review-2026-05-27/photos-after")
const URL = process.env.SITE_URL ?? "http://localhost:3001"

const PAGES: Array<{ path: string; name: string; scrollNeedle?: string }> = [
  { path: "/", name: "home-grid", scrollNeedle: "Explorez par typologie" },
  { path: "/classes-d-actifs", name: "classes-actifs-list", scrollNeedle: "Locaux commerciaux" },
  { path: "/classes-d-actifs/locaux-commerciaux", name: "classe-locaux-hero" },
  { path: "/classes-d-actifs/bureaux", name: "classe-bureaux-hero" },
  { path: "/classes-d-actifs/hotellerie-restauration", name: "classe-hotel-hero" },
  { path: "/classes-d-actifs/immeubles", name: "classe-immeubles-hero" },
  { path: "/classes-d-actifs/entrepots-logistique", name: "classe-entrepots-hero" },
  { path: "/classes-d-actifs/cession-droit-au-bail", name: "classe-cession-hero" },
  { path: "/vente", name: "vente-hero" },
  { path: "/location", name: "location-hero" },
  { path: "/l-agence", name: "l-agence-hero" },
  { path: "/opportunites", name: "opportunites-hero" },
  { path: "/estimations", name: "estimations-hero" },
]

async function scrollToText(page: Page, needle: string, offsetCenter = 0.15) {
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

    for (const pg of PAGES) {
      await page.goto(`${URL}${pg.path}`, { waitUntil: "load", timeout: 30000 })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(1500)
      if (pg.scrollNeedle) {
        await scrollToText(page, pg.scrollNeedle, 0.15)
        await page.waitForTimeout(1200)
      }
      await page.screenshot({ path: `${OUT_DIR}/${pg.name}-1440.png`, fullPage: false })
      console.log(`✓ ${pg.name}-1440`)
    }

    await ctx.close()
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
