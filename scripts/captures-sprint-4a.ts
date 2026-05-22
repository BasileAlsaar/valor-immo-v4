/**
 * scripts/captures-sprint-4a.ts
 *
 * Captures sprint 4a — refonte visuels catégories + filtres opportunites.
 *
 * Usage :
 *   node --experimental-strip-types scripts/captures-sprint-4a.ts STATES   # 3 états × 3 résolutions
 *   node --experimental-strip-types scripts/captures-sprint-4a.ts DEMO     # screencast ~10 s parcours filtres
 */

import { chromium, type Page } from "playwright"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const MODE = (process.argv[2] ?? "STATES").toUpperCase()
const OUT_DIR = resolve(process.cwd(), "captures/sprint-4a")
const URL = process.env.SITE_URL ?? "http://localhost:3001"

const VIEWPORTS = [
  { name: "1280", width: 1280, height: 800 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
] as const

async function scrollToCategories(page: Page) {
  const section = page.locator("section#categories").first()
  await section.scrollIntoViewIfNeeded()
  await page.waitForTimeout(900)
}

async function runStates() {
  const browser = await chromium.launch()
  try {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
      })
      const page = await context.newPage()

      // État 1 — home Catégories avec nouvelles images
      await page.goto(URL, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      await scrollToCategories(page)
      await page.waitForTimeout(900)
      await page.screenshot({
        path: `${OUT_DIR}/categories-home-${vp.name}.png`,
        fullPage: false,
      })
      console.log(`✓ categories-home-${vp.name}`)

      // État 2 — /opportunites avec 2 filtres actifs (typologie=bureaux,locaux-commerciaux & transaction=location)
      await page.goto(`${URL}/opportunites?typologie=bureaux,locaux-commerciaux&transaction=location`, {
        waitUntil: "networkidle",
      })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(1200)
      await page.screenshot({
        path: `${OUT_DIR}/opportunites-filters-active-${vp.name}.png`,
        fullPage: false,
      })
      console.log(`✓ opportunites-filters-active-${vp.name}`)

      // État 3 — /opportunites état "0 résultat" (filtres incompatibles)
      await page.goto(`${URL}/opportunites?typologie=entrepots-logistique&arrondissement=8&transaction=vente`, {
        waitUntil: "networkidle",
      })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(1000)
      await page.screenshot({
        path: `${OUT_DIR}/opportunites-empty-state-${vp.name}.png`,
        fullPage: false,
      })
      console.log(`✓ opportunites-empty-state-${vp.name}`)

      await context.close()
    }
  } finally {
    await browser.close()
  }
}

async function runDemo() {
  const browser = await chromium.launch()
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      recordVideo: { dir: OUT_DIR, size: { width: 1440, height: 900 } },
    })
    const page = await context.newPage()
    await page.goto(`${URL}/opportunites`, { waitUntil: "networkidle" })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1500)

    // Click typologie Bureaux
    await page.getByRole("button", { name: /^Bureaux$/ }).first().click()
    await page.waitForTimeout(900)

    // Click typologie Hôtellerie & Restauration
    await page.getByRole("button", { name: /Hôtellerie/ }).first().click()
    await page.waitForTimeout(900)

    // Click transaction Location
    await page.getByRole("button", { name: /^Location$/ }).first().click()
    await page.waitForTimeout(900)

    // Click arrondissement Paris 6e
    await page.getByRole("button", { name: /^Paris 6ᵉ$/ }).click()
    await page.waitForTimeout(900)

    // Reset
    await page.getByRole("button", { name: /Réinitialiser/ }).click()
    await page.waitForTimeout(900)

    // Click une carte
    const firstCard = page.locator("a[href^='/opportunites/']").first()
    await firstCard.scrollIntoViewIfNeeded()
    await firstCard.click()
    await page.waitForLoadState("networkidle")
    await page.waitForTimeout(1500)

    await page.close()
    const video = page.video()
    await context.close()
    if (video) {
      const dst = `${OUT_DIR}/demo-filters-flow.webm`
      await video.saveAs(dst)
      console.log(`✓ ${dst}`)
    }
  } finally {
    await browser.close()
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  if (MODE === "STATES") return runStates()
  if (MODE === "DEMO") return runDemo()
  console.error(`Mode inconnu : ${MODE}`)
  process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
