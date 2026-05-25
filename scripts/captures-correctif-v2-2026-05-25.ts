/**
 * scripts/captures-correctif-v2-2026-05-25.ts
 *
 * Correctif final hero homepage (v2). 2 corrections :
 *   P1. Crest top-left aligné sur le SiteHeader
 *   P2. Hero contenu intégralement dans 100vh à 1440 et 1920
 *
 * Cible : docs/ux-review-2026-05-25/after-correctif-v2/
 */

import { chromium } from "playwright"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const OUT_DIR = resolve(process.cwd(), "docs/ux-review-2026-05-25/after-correctif-v2")
const URL = process.env.SITE_URL ?? "http://localhost:3004"

const VIEWPORTS = [
  { w: 1920, h: 1080, tag: "1920" },
  { w: 1440, h: 900, tag: "1440" },
  { w: 1280, h: 800, tag: "1280" },
  { w: 1024, h: 768, tag: "1024" },
  { w: 390, h: 844, tag: "390" },
]

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const browser = await chromium.launch()
  try {
    for (const vp of VIEWPORTS) {
      console.log(`\n=== Viewport ${vp.tag} (${vp.w}×${vp.h}) ===`)
      const ctx = await browser.newContext({
        viewport: { width: vp.w, height: vp.h },
        reducedMotion: "reduce",
      })
      const page = await ctx.newPage()
      await page.goto(`${URL}/`, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(1200)
      await page.screenshot({
        path: `${OUT_DIR}/hero-${vp.tag}.png`,
        fullPage: false,
      })
      console.log(`✓ hero-${vp.tag}`)

      // Mesures fines : crest vs SiteHeader, hero h vs viewport, CTAs + SCROLL visibles
      if (vp.w >= 1024) {
        const m = await page.evaluate(() => {
          const header = document.querySelector("header") as HTMLElement | null
          const logo = header?.querySelector("a img") as HTMLElement | null
          const navLink = header?.querySelector("nav a") as HTMLElement | null
          const crest = document.querySelector(
            '[data-testid="hero-logo"]',
          ) as HTMLElement | null
          const heroSection = document.querySelector("section") as HTMLElement | null
          const ctaLink = Array.from(document.querySelectorAll("a")).find((a) =>
            (a.textContent ?? "").includes("Voir les opportunités"),
          ) as HTMLElement | null
          const scroll = Array.from(document.querySelectorAll("span")).find(
            (s) => (s.textContent ?? "").trim().toLowerCase() === "scroll",
          ) as HTMLElement | null
          return {
            logo: logo?.getBoundingClientRect(),
            navLink: navLink?.getBoundingClientRect(),
            crest: crest?.getBoundingClientRect(),
            heroH: heroSection?.getBoundingClientRect().height,
            ctaBottom: ctaLink?.getBoundingClientRect().bottom,
            scrollBottom: scroll?.getBoundingClientRect().bottom,
            vh: window.innerHeight,
          }
        })
        const dTop = Math.round((m.crest?.top ?? 0) - (m.navLink?.top ?? 0))
        const dLeft = Math.round((m.crest?.left ?? 0) - (m.logo?.left ?? 0))
        console.log(`  crest.top ↔ navLink.top : Δ=${dTop}px (cible ±4)`)
        console.log(`  crest.left ↔ logo.left : Δ=${dLeft}px (cible ±2)`)
        console.log(`  hero h = ${Math.round(m.heroH ?? 0)}px / viewport ${m.vh}px (${(m.heroH ?? 0) <= (m.vh ?? 0) ? "fits ✓" : "OVERFLOW ✗"})`)
        console.log(`  CTA bottom = ${Math.round(m.ctaBottom ?? 0)} (${(m.ctaBottom ?? 999) <= (m.vh ?? 0) ? "visible ✓" : "coupé"})`)
        console.log(`  SCROLL bottom = ${Math.round(m.scrollBottom ?? 0)} (${(m.scrollBottom ?? 999) <= (m.vh ?? 0) ? "visible ✓" : "coupé"})`)
      }
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
