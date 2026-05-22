/**
 * scripts/captures-sprint-5b.ts
 *
 * Captures sprint 5b min — placeholders légaux + politique de confidentialité.
 *
 * Usage :
 *   node --experimental-strip-types scripts/captures-sprint-5b.ts
 */

import { chromium } from "playwright"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const OUT_DIR = resolve(process.cwd(), "captures/sprint-5b")
const URL = process.env.SITE_URL ?? "http://localhost:3004"

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const browser = await chromium.launch()
  try {
    // 1. /l-agence section Loi Hoguet — scroll vers le texte "en cours de souscription"
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
      })
      const page = await context.newPage()
      await page.goto(`${URL}/l-agence`, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      // Scroll vers la section Loi Hoguet — recherche du texte
      await page.evaluate(() => {
        const el = Array.from(document.querySelectorAll("p")).find((e) =>
          e.textContent?.includes("Carte T en cours d'obtention"),
        )
        el?.scrollIntoView({ behavior: "instant", block: "center" })
      })
      await page.waitForTimeout(800)
      await page.screenshot({
        path: `${OUT_DIR}/l-agence-loi-hoguet-1440.png`,
        fullPage: false,
      })
      console.log("✓ l-agence-loi-hoguet-1440")
      await context.close()
    }

    // 2. /politique-de-confidentialite — capture longue (fullPage)
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
      })
      const page = await context.newPage()
      await page.goto(`${URL}/politique-de-confidentialite`, {
        waitUntil: "networkidle",
      })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(800)
      await page.screenshot({
        path: `${OUT_DIR}/politique-confidentialite-full-1440.png`,
        fullPage: true,
      })
      console.log("✓ politique-confidentialite-full-1440")
      await context.close()
    }

    // 3. Footer avec lien Politique de confidentialité — depuis home, scroll en bas
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
      })
      const page = await context.newPage()
      await page.goto(`${URL}/`, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      // Aller en pied de page absolu
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(1200)
      // Le footer occupe le bas — capture bas du viewport
      await page.screenshot({
        path: `${OUT_DIR}/footer-legal-section-1440.png`,
        fullPage: false,
      })
      console.log("✓ footer-legal-section-1440")
      await context.close()
    }
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
