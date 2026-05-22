/**
 * scripts/captures-sprint-2.ts
 *
 * Captures Playwright pour le sprint 2 — formulaire qualifiant 3 étapes.
 *
 * Usage :
 *   node --experimental-strip-types scripts/captures-sprint-2.ts STEPS    # 3 étapes × 3 résolutions
 *   node --experimental-strip-types scripts/captures-sprint-2.ts SUCCESS  # SuccessScreen (parcours complet)
 *   node --experimental-strip-types scripts/captures-sprint-2.ts CTA      # section ContactCTA en pied de home
 *   node --experimental-strip-types scripts/captures-sprint-2.ts DEMO     # screencast 8 s parcours complet
 *
 * Pré-requis : dev server en marche sur http://localhost:3001.
 */

import { chromium, type Page } from "playwright"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const MODE = (process.argv[2] ?? "STEPS").toUpperCase()
const OUT_DIR = resolve(process.cwd(), "captures/sprint-2")
const URL = process.env.SITE_URL ?? "http://localhost:3001"

const VIEWPORTS = [
  { name: "1280", width: 1280, height: 800 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
] as const

async function pickRadioByLabel(page: Page, text: string) {
  await page
    .locator("label")
    .filter({ hasText: new RegExp(`^${escapeRegex(text)}$`) })
    .first()
    .click()
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

async function fillStep1(page: Page) {
  await pickRadioByLabel(page, "Locaux commerciaux")
  await pickRadioByLabel(page, "Location")
  await page.locator('input[name="surfaceMin"]').fill("80")
  await page.locator('input[name="surfaceMax"]').fill("200")
  await page.locator('input[name="budgetMin"]').fill("3000")
  await page.locator('input[name="budgetMax"]').fill("8000")
}

async function fillStep2(page: Page) {
  await pickRadioByLabel(page, "Court terme (1-3 mois)")
  await pickRadioByLabel(page, "Prêt bancaire en cours d'obtention")
  await page.locator('select[name="secteur"]').selectOption("restauration")
  await page.getByRole("button", { name: "Paris 1ᵉʳ" }).click()
  await page.getByRole("button", { name: "Paris 2ᵉ" }).click()
}

async function fillStep3(page: Page) {
  await page.locator('input[name="nom"]').fill("Émilie Bernard")
  await page.locator('input[name="societe"]').fill("Maison Bernard SARL")
  await page.locator('input[name="email"]').fill("emilie@example.fr")
  await page.locator('input[name="telephone"]').fill("06 12 34 56 89")
  await page.locator('select[name="source"]').selectOption("recommandation")
  await page
    .locator('textarea[name="message"]')
    .fill("Recherche flagship rue Saint-Honoré, 80–200 m², ouverture printemps.")
  await page.locator('input[name="consentement"]').check()
}

async function runStepsCaptures() {
  const browser = await chromium.launch()
  try {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
      })
      const page = await context.newPage()
      await page.goto(`${URL}/contact`, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(800)

      // Étape 1
      await page.screenshot({
        path: `${OUT_DIR}/contact-step1-${vp.name}.png`,
        fullPage: false,
      })
      console.log(`✓ contact-step1-${vp.name}`)

      // Remplir + passer étape 2
      await fillStep1(page)
      await page.getByRole("button", { name: /^Suivant/ }).click()
      await page.waitForTimeout(700)
      await page.screenshot({
        path: `${OUT_DIR}/contact-step2-${vp.name}.png`,
        fullPage: false,
      })
      console.log(`✓ contact-step2-${vp.name}`)

      // Remplir + passer étape 3
      await fillStep2(page)
      await page.getByRole("button", { name: /^Suivant/ }).click()
      await page.waitForTimeout(700)
      await page.screenshot({
        path: `${OUT_DIR}/contact-step3-${vp.name}.png`,
        fullPage: false,
      })
      console.log(`✓ contact-step3-${vp.name}`)

      await context.close()
    }
  } finally {
    await browser.close()
  }
}

async function runSuccessCaptures() {
  // Mock state via route dev `/contact/success-demo` — évite la dépendance au
  // rate limit (3/h) du POST `/api/contact` et le brief §284 prévoit ce mock.
  const browser = await chromium.launch()
  try {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
      })
      const page = await context.newPage()
      await page.goto(`${URL}/contact/success-demo`, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      // Laisser le pathLength + fadeUp se terminer (≈ 1 s)
      await page.waitForTimeout(1500)
      await page.screenshot({
        path: `${OUT_DIR}/contact-success-${vp.name}.png`,
        fullPage: false,
      })
      console.log(`✓ contact-success-${vp.name}`)
      await context.close()
    }
  } finally {
    await browser.close()
  }
}

async function runCtaCapture() {
  const browser = await chromium.launch()
  try {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
      })
      const page = await context.newPage()
      await page.goto(URL, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(800)

      const cta = page.locator("section:has(h2:text('Parlons de votre projet.'))").last()
      await cta.scrollIntoViewIfNeeded()
      await page.waitForTimeout(900)
      await page.screenshot({
        path: `${OUT_DIR}/contact-cta-home-${vp.name}.png`,
        fullPage: false,
      })
      console.log(`✓ contact-cta-home-${vp.name}`)
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
    await page.goto(`${URL}/contact`, { waitUntil: "networkidle" })
    await page.waitForTimeout(1200)

    await fillStep1(page)
    await page.waitForTimeout(500)
    await page.getByRole("button", { name: /^Suivant/ }).click()
    await page.waitForTimeout(900)

    await fillStep2(page)
    await page.waitForTimeout(500)
    await page.getByRole("button", { name: /^Suivant/ }).click()
    await page.waitForTimeout(900)

    await fillStep3(page)
    await page.waitForTimeout(500)
    await page.getByRole("button", { name: /^Envoyer ma demande/ }).click()
    await page.waitForSelector("text=Demande reçue.", { timeout: 8000 })
    await page.waitForTimeout(1800)
    await page.close()
    const video = page.video()
    await context.close()
    if (video) {
      const dst = `${OUT_DIR}/demo-form-flow.webm`
      await video.saveAs(dst)
      console.log(`✓ ${dst}`)
    }
  } finally {
    await browser.close()
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  if (MODE === "STEPS") return runStepsCaptures()
  if (MODE === "SUCCESS") return runSuccessCaptures()
  if (MODE === "CTA") return runCtaCapture()
  if (MODE === "DEMO") return runDemo()
  console.error(`Mode inconnu : ${MODE}`)
  process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
