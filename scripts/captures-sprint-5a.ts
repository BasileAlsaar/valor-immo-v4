/**
 * scripts/captures-sprint-5a.ts
 *
 * Captures sprint 5a — logo hero + re-sourcing photos.
 *
 * Usage :
 *   node --experimental-strip-types scripts/captures-sprint-5a.ts LOGO
 *   node --experimental-strip-types scripts/captures-sprint-5a.ts PHOTOS
 *   node --experimental-strip-types scripts/captures-sprint-5a.ts ALL
 */

import { chromium } from "playwright"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const MODE = (process.argv[2] ?? "LOGO").toUpperCase()
const OUT_DIR = resolve(process.cwd(), "captures/sprint-5a")
const URL = process.env.SITE_URL ?? "http://localhost:3001"

async function runLogo() {
  const browser = await chromium.launch()
  try {
    // Home desktop 1440
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
      })
      const page = await context.newPage()
      await page.goto(URL, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(1500)
      await page.screenshot({
        path: `${OUT_DIR}/home-hero-logo-desktop-1440.png`,
        fullPage: false,
      })
      console.log(`✓ home-hero-logo-desktop-1440`)
      await context.close()
    }

    // Home desktop 1920
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
      })
      const page = await context.newPage()
      await page.goto(URL, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(1500)
      await page.screenshot({
        path: `${OUT_DIR}/home-hero-logo-desktop-1920.png`,
        fullPage: false,
      })
      console.log(`✓ home-hero-logo-desktop-1920`)
      await context.close()
    }

    // Home mobile (logo 120px)
    {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        reducedMotion: "reduce",
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      })
      const page = await context.newPage()
      await page.goto(URL, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(1500)
      await page.screenshot({
        path: `${OUT_DIR}/home-hero-logo-mobile-390.png`,
        fullPage: false,
      })
      console.log(`✓ home-hero-logo-mobile-390`)
      await context.close()
    }

    // /opportunites — SiteHeader avec logo 48 px conservé
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
      })
      const page = await context.newPage()
      await page.goto(`${URL}/opportunites`, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(1500)
      await page.screenshot({
        path: `${OUT_DIR}/opportunites-header-logo-48-1440.png`,
        fullPage: false,
      })
      console.log(`✓ opportunites-header-logo-48-1440`)
      await context.close()
    }
  } finally {
    await browser.close()
  }
}

async function runPhotos() {
  const browser = await chromium.launch()
  try {
    const targets: Array<{ name: string; url: string; viewport: { width: number; height: number } }> = [
      { name: "home-categories-desktop-1440", url: "/", viewport: { width: 1440, height: 900 } },
      { name: "classes-d-actifs-grid-desktop-1440", url: "/classes-d-actifs", viewport: { width: 1440, height: 900 } },
      { name: "opportunites-hero-desktop-1440", url: "/opportunites", viewport: { width: 1440, height: 900 } },
      { name: "bien-chatelet-desktop-1440", url: "/opportunites/local-chatelet-halles-173m2", viewport: { width: 1440, height: 900 } },
      { name: "bien-bureaux-monceau-desktop-1440", url: "/opportunites/bureaux-monceau-340m2", viewport: { width: 1440, height: 900 } },
      { name: "bien-brasserie-stgermain-desktop-1440", url: "/opportunites/brasserie-st-germain-220m2", viewport: { width: 1440, height: 900 } },
      { name: "bien-immeuble-gboulevards-desktop-1440", url: "/opportunites/immeuble-grands-boulevards-840m2", viewport: { width: 1440, height: 900 } },
      { name: "bien-boutique-passy-desktop-1440", url: "/opportunites/boutique-passy-86m2", viewport: { width: 1440, height: 900 } },
      { name: "bien-hotel-marais-desktop-1440", url: "/opportunites/hotel-marais-12-chambres", viewport: { width: 1440, height: 900 } },
      { name: "bien-entrepot-pajol-desktop-1440", url: "/opportunites/entrepot-pajol-680m2", viewport: { width: 1440, height: 900 } },
      { name: "bien-pizzeria-bastille-desktop-1440", url: "/opportunites/fonds-pizzeria-bastille-95m2", viewport: { width: 1440, height: 900 } },
    ]
    for (const t of targets) {
      const context = await browser.newContext({
        viewport: t.viewport,
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
      })
      const page = await context.newPage()
      await page.goto(`${URL}${t.url}`, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(1500)
      await page.screenshot({
        path: `${OUT_DIR}/${t.name}.png`,
        fullPage: false,
      })
      console.log(`✓ ${t.name}`)
      await context.close()
    }
  } finally {
    await browser.close()
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  if (MODE === "LOGO") return runLogo()
  if (MODE === "PHOTOS") return runPhotos()
  if (MODE === "ALL") {
    await runLogo()
    await runPhotos()
    return
  }
  console.error(`Mode inconnu : ${MODE}`)
  process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
