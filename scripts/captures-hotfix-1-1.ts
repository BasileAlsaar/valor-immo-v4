/**
 * scripts/captures-hotfix-1-1.ts
 *
 * 4 sections × 1920×1080 pour le hotfix 1.1 visual fixes.
 *
 * Usage :
 *   node --experimental-strip-types scripts/captures-hotfix-1-1.ts AVANT
 *   node --experimental-strip-types scripts/captures-hotfix-1-1.ts APRES
 */

import { chromium, type Page } from "playwright"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const SUFFIX = process.argv[2] === "APRES" ? "APRES" : "AVANT"
const OUT_DIR = resolve(process.cwd(), "captures/hotfix-1-1")
const URL = process.env.SITE_URL ?? "http://localhost:3001"

const SECTIONS = [
  { name: "1-temoignages", selector: "section:has(blockquote)" },
  { name: "2-categories", selector: "section:has(h2:text('explorez par'))" },
  { name: "3-methode", selector: "section:has(h2:text('du brief à la signature'))" },
  // CtaFooterOutline (sprint 1) ou ContactCTA (sprint 2)
  { name: "4-cta-footer", selector: "section:has(h2:text('parlons'))" },
] as const

async function captureSection(page: Page, selector: string, name: string) {
  const handle = page.locator(selector).first()
  await handle.scrollIntoViewIfNeeded()
  await page.waitForTimeout(800)
  const path = `${OUT_DIR}/${name}-${SUFFIX}.png`
  await page.screenshot({ path, fullPage: false })
  console.log(`✓ ${path}`)
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const browser = await chromium.launch()
  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    })
    const page = await context.newPage()
    await page.goto(URL, { waitUntil: "networkidle" })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1200)

    for (const sec of SECTIONS) {
      await captureSection(page, sec.selector, sec.name)
    }

    await context.close()
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
