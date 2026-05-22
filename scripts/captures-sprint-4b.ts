/**
 * scripts/captures-sprint-4b.ts
 *
 * Captures sprint 4b — fiches /opportunites/[slug] enrichies.
 *
 * Usage :
 *   node --experimental-strip-types scripts/captures-sprint-4b.ts STATES
 *   node --experimental-strip-types scripts/captures-sprint-4b.ts DEMO
 */

import { chromium } from "playwright"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const MODE = (process.argv[2] ?? "STATES").toUpperCase()
const OUT_DIR = resolve(process.cwd(), "captures/sprint-4b")
const URL = process.env.SITE_URL ?? "http://localhost:3001"

const VIEWPORTS = [
  { name: "1280", width: 1280, height: 800 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
] as const

const BIEN_CENTRE = "local-chatelet-halles-173m2"     // Paris 1er
const BIEN_COURONNE = "boutique-passy-86m2"            // Paris 16e (résidentiel, comparables limités)

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

      // État 1 — Fiche bien centre Paris (fullPage)
      await page.goto(`${URL}/opportunites/${BIEN_CENTRE}`, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(1800)
      await page.screenshot({
        path: `${OUT_DIR}/fiche-centre-${vp.name}.png`,
        fullPage: true,
      })
      console.log(`✓ fiche-centre-${vp.name}`)

      // État 2 — Fiche bien 16e (MiniMap moins centrale)
      await page.goto(`${URL}/opportunites/${BIEN_COURONNE}`, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(1800)
      await page.screenshot({
        path: `${OUT_DIR}/fiche-couronne-${vp.name}.png`,
        fullPage: true,
      })
      console.log(`✓ fiche-couronne-${vp.name}`)

      // État 3 — Lightbox ouvert sur photo secondaire
      await page.goto(`${URL}/opportunites/${BIEN_CENTRE}`, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(1500)
      // Scroll vers la section iconographie
      const gallery = page.getByTestId("opportunity-gallery")
      await gallery.scrollIntoViewIfNeeded()
      await page.waitForTimeout(600)
      // Swap thumbnail puis ouvre lightbox
      const thumbnails = gallery.locator("button").nth(1)
      await thumbnails.click()
      await page.waitForTimeout(400)
      const mainImg = gallery.locator("button").first()
      await mainImg.click()
      await page.waitForTimeout(700)
      await page.screenshot({
        path: `${OUT_DIR}/lightbox-${vp.name}.png`,
        fullPage: false,
      })
      console.log(`✓ lightbox-${vp.name}`)

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
    await page.waitForTimeout(1300)

    // Clic sur la première carte
    const firstCard = page.locator(`a[href='/opportunites/${BIEN_CENTRE}']`).first()
    await firstCard.scrollIntoViewIfNeeded()
    await firstCard.click()
    await page.waitForLoadState("networkidle")
    await page.waitForTimeout(1500)

    // Scroll lent : hero → galerie
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: "smooth" }))
    await page.waitForTimeout(1400)
    await page.evaluate(() => window.scrollTo({ top: 1100, behavior: "smooth" }))
    await page.waitForTimeout(1200)

    // Swap thumbnail galerie
    const gallery = page.getByTestId("opportunity-gallery")
    await gallery.scrollIntoViewIfNeeded()
    await page.waitForTimeout(600)
    await gallery.locator("button").nth(1).click()
    await page.waitForTimeout(900)

    // Ouvre lightbox
    await gallery.locator("button").first().click()
    await page.waitForTimeout(1200)
    // Ferme avec Escape
    await page.keyboard.press("Escape")
    await page.waitForTimeout(800)

    // Scroll vers MiniMap
    await page.evaluate(() => window.scrollTo({ top: 2400, behavior: "smooth" }))
    await page.waitForTimeout(1500)

    // Scroll vers comparables + simulateur
    await page.evaluate(() => window.scrollTo({ top: 3400, behavior: "smooth" }))
    await page.waitForTimeout(1300)

    // Modifie surface simulateur
    const surfaceInput = page.locator("input[type='number']").first()
    await surfaceInput.scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    await surfaceInput.click({ clickCount: 3 })
    await surfaceInput.fill("250")
    await page.waitForTimeout(900)

    await page.close()
    const video = page.video()
    await context.close()
    if (video) {
      const dst = `${OUT_DIR}/demo-fiche-bien-complete.webm`
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
