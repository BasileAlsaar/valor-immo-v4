/**
 * scripts/captures-ui-fixes-2026-05-25.ts
 *
 * Captures pour PR fix(ui): 5 corrections UX (footer, vocab, filtres, hero, témoignages).
 * Cible : 5 viewports × 5 fixes = 25 captures.
 */

import { chromium, type Page } from "playwright"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const OUT_DIR = resolve(process.cwd(), "captures/ui-fixes-2026-05-25")
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

      // FIX 4 — Hero crest (home, top)
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
          path: `${OUT_DIR}/fix4-hero-${vp.tag}.png`,
          fullPage: false,
        })
        console.log(`✓ fix4-hero-${vp.tag}`)
        await ctx.close()
      }

      // FIX 5 — Témoignages (home, scroll "Ils nous ont confié")
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
          path: `${OUT_DIR}/fix5-testimonial-${vp.tag}.png`,
          fullPage: false,
        })
        console.log(`✓ fix5-testimonial-${vp.tag}`)
        await ctx.close()
      }

      // FIX 1 — Footer (home, scroll bottom)
      {
        const ctx = await browser.newContext({
          viewport: { width: vp.w, height: vp.h },
          reducedMotion: "reduce",
        })
        const page = await ctx.newPage()
        await page.goto(`${URL}/`, { waitUntil: "networkidle" })
        await page.evaluate(() => document.fonts.ready)
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
        await page.waitForTimeout(1000)
        await page.screenshot({
          path: `${OUT_DIR}/fix1-footer-${vp.tag}.png`,
          fullPage: false,
        })
        console.log(`✓ fix1-footer-${vp.tag}`)
        await ctx.close()
      }

      // FIX 2 — Vocabulaire métier (page entrepots-logistique)
      {
        const ctx = await browser.newContext({
          viewport: { width: vp.w, height: vp.h },
          reducedMotion: "reduce",
        })
        const page = await ctx.newPage()
        await page.goto(`${URL}/classes-d-actifs/entrepots-logistique`, {
          waitUntil: "networkidle",
        })
        await page.evaluate(() => document.fonts.ready)
        await scrollToText(page, "Vocabulaire métier", 0.15)
        await page.waitForTimeout(800)
        await page.screenshot({
          path: `${OUT_DIR}/fix2-vocab-${vp.tag}.png`,
          fullPage: false,
        })
        console.log(`✓ fix2-vocab-${vp.tag}`)
        await ctx.close()
      }

      // FIX 3 — Filtres opportunités
      {
        const ctx = await browser.newContext({
          viewport: { width: vp.w, height: vp.h },
          reducedMotion: "reduce",
        })
        const page = await ctx.newPage()
        await page.goto(`${URL}/opportunites`, { waitUntil: "networkidle" })
        await page.evaluate(() => document.fonts.ready)
        await scrollToText(page, "Typologie", 0.2)
        await page.waitForTimeout(800)
        await page.screenshot({
          path: `${OUT_DIR}/fix3-filtres-${vp.tag}.png`,
          fullPage: false,
        })
        console.log(`✓ fix3-filtres-${vp.tag}`)
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
