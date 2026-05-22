/**
 * scripts/captures-sprint-1.ts
 *
 * Captures Playwright pour le sprint 1.
 *
 * Usage :
 *   node --experimental-strip-types scripts/captures-sprint-1.ts          # hero AVANT (par défaut)
 *   node --experimental-strip-types scripts/captures-sprint-1.ts APRES    # hero après le fix
 *   node --experimental-strip-types scripts/captures-sprint-1.ts SECTIONS # 3 sections compressées (livrable §3)
 *   node --experimental-strip-types scripts/captures-sprint-1.ts DEMO     # screencast 4 s hero animation (critère wow §6)
 *
 * Pré-requis :
 *   - dev server lancé sur http://localhost:3001
 *   - npx playwright install chromium effectué
 *
 * Sortie : captures/sprint-1/<scope>-<width>-<SUFFIX>.png
 */

import { chromium } from "playwright"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const VIEWPORTS = [
  { name: "1280", width: 1280, height: 800 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
] as const

const MODE = process.argv[2] === "APRES"
  ? "APRES"
  : process.argv[2] === "SECTIONS"
    ? "SECTIONS"
    : process.argv[2] === "DEMO"
      ? "DEMO"
      : "AVANT"
const OUT_DIR = resolve(process.cwd(), "captures/sprint-1")
const URL = process.env.SITE_URL ?? "http://localhost:3001"

const SECTIONS = [
  { id: "quotes", selector: "section:has(blockquote)", name: "section-temoignages" },
  { id: "method", selector: "section:has(h2:text('DU BRIEF'))", name: "section-methode" },
  { id: "argus", selector: "#argus", name: "section-argus" },
] as const

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  const browser = await chromium.launch()
  try {
    if (MODE === "DEMO") {
      // Enregistrement vidéo 4 s du hero animé (critère "wow" §6)
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
        recordVideo: { dir: OUT_DIR, size: { width: 1440, height: 900 } },
      })
      const page = await context.newPage()
      await page.goto(URL, { waitUntil: "domcontentloaded" })
      await page.waitForTimeout(4000)
      await page.close()
      const video = page.video()
      await context.close()
      if (video) {
        const finalPath = `${OUT_DIR}/hero-animation-demo.webm`
        await video.saveAs(finalPath)
        console.log(`✓ ${finalPath}`)
      }
      return
    }

    if (MODE === "SECTIONS") {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
      })
      const page = await context.newPage()
      await page.goto(URL, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(1500)

      for (const sec of SECTIONS) {
        const handle = page.locator(sec.selector).first()
        await handle.scrollIntoViewIfNeeded()
        await page.waitForTimeout(600)
        const outPath = `${OUT_DIR}/${sec.name}-1440-APRES.png`
        await page.screenshot({ path: outPath, fullPage: false })
        console.log(`✓ ${outPath}`)
      }
      await context.close()
      return
    }

    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
        // Couper l'autoplay vidéo pour stabilité de capture (poster + premier frame)
        reducedMotion: "reduce",
      })
      const page = await context.newPage()
      await page.goto(URL, { waitUntil: "networkidle" })
      // Attendre les fonts (next/font swap) + premier frame vidéo
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(2000)

      const outPath = `${OUT_DIR}/hero-${vp.name}-${MODE}.png`
      await page.screenshot({ path: outPath, fullPage: false })
      console.log(`✓ ${outPath}`)
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
