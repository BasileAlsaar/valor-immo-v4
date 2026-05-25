/**
 * scripts/captures-correctif-2026-05-25.ts
 *
 * Captures du correctif post-commit 0b95605 — 4 corrections :
 *   C1. Crest hero aligné sur le H1 (composition verticale gauche)
 *   C2. Suppression de la ReassuranceBar "Discuter de mon projet"
 *   C3. Chevrons « » du carrousel témoignages — taille réduite + inline
 *   C4. Hero search-bar : "Loyer max (€/mois HT)"
 *
 * Cible : docs/ux-review-2026-05-25/after-correctif/
 */

import { chromium, type Page } from "playwright"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const OUT_DIR = resolve(process.cwd(), "docs/ux-review-2026-05-25/after-correctif")
const URL = process.env.SITE_URL ?? "http://localhost:3004"

const VIEWPORTS = [
  { w: 1920, h: 1080, tag: "1920" },
  { w: 1440, h: 900, tag: "1440" },
  { w: 1280, h: 800, tag: "1280" },
  { w: 1024, h: 768, tag: "1024" },
  { w: 390, h: 844, tag: "390" },
]

async function scrollToText(page: Page, needle: string, offsetCenter = 0.3) {
  const found = await page.evaluate(
    ({ n, off }) => {
      const needle = n.toLowerCase()
      const all = Array.from(document.querySelectorAll("h1, h2, h3, h4, p, span"))
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
    for (const vp of VIEWPORTS) {
      console.log(`\n=== Viewport ${vp.tag} (${vp.w}×${vp.h}) ===`)

      // C1. Hero crest alignment + C4. search-bar HT (même capture)
      {
        const ctx = await browser.newContext({
          viewport: { width: vp.w, height: vp.h },
          reducedMotion: "reduce",
        })
        const page = await ctx.newPage()
        await page.goto(`${URL}/`, { waitUntil: "networkidle" })
        await page.evaluate(() => document.fonts.ready)
        await page.waitForTimeout(1500)
        await page.screenshot({
          path: `${OUT_DIR}/c1-hero-${vp.tag}.png`,
          fullPage: false,
        })
        console.log(`✓ c1-hero-${vp.tag}`)

        // Mesure d'alignement vertical crest vs H1 (lg+ uniquement)
        if (vp.w >= 1024) {
          const measure = await page.evaluate(() => {
            const crest = document.querySelector(
              '[data-testid="hero-logo"]',
            ) as HTMLElement | null
            const h1 = document.querySelector("h1") as HTMLElement | null
            if (!crest || !h1) return null
            const crestRect = crest.getBoundingClientRect()
            const h1Rect = h1.getBoundingClientRect()
            return {
              crestLeft: Math.round(crestRect.left),
              h1Left: Math.round(h1Rect.left),
              delta: Math.round(crestRect.left - h1Rect.left),
            }
          })
          console.log(`  ↳ crest.left=${measure?.crestLeft}px h1.left=${measure?.h1Left}px Δ=${measure?.delta}px`)
        }

        await ctx.close()
      }

      // C3. Témoignages — chevrons resserrés
      {
        const ctx = await browser.newContext({
          viewport: { width: vp.w, height: vp.h },
          reducedMotion: "reduce",
        })
        const page = await ctx.newPage()
        await page.goto(`${URL}/`, { waitUntil: "networkidle" })
        await page.evaluate(() => document.fonts.ready)
        await scrollToText(page, "Ils nous ont confié")
        await page.waitForTimeout(800)
        await page.screenshot({
          path: `${OUT_DIR}/c3-temoignages-${vp.tag}.png`,
          fullPage: false,
        })
        console.log(`✓ c3-temoignages-${vp.tag}`)
        await ctx.close()
      }

      // C2. ReassuranceBar supprimée — capture bas de home pour vérifier l'absence
      {
        const ctx = await browser.newContext({
          viewport: { width: vp.w, height: vp.h },
          reducedMotion: "reduce",
        })
        const page = await ctx.newPage()
        await page.goto(`${URL}/`, { waitUntil: "networkidle" })
        await page.evaluate(() => document.fonts.ready)
        // Scroll vers le bas pour montrer la transition Argus/Opportunités → ContactCTA → Footer
        await scrollToText(page, "Démarrer mon projet", 0.5).catch(async () => {
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - window.innerHeight))
        })
        await page.waitForTimeout(800)
        await page.screenshot({
          path: `${OUT_DIR}/c2-no-reassurance-${vp.tag}.png`,
          fullPage: false,
        })
        console.log(`✓ c2-no-reassurance-${vp.tag}`)
        await ctx.close()
      }
    }
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
