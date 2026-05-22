/**
 * scripts/captures-sprint-3.ts
 *
 * Captures sprint 3 — ARGUS map enrichie.
 *
 * Usage :
 *   node --experimental-strip-types scripts/captures-sprint-3.ts STATES   # 4 états × 3 résolutions
 *   node --experimental-strip-types scripts/captures-sprint-3.ts DEMO     # screencast ~10 s parcours interactif
 */

import { chromium, type Page } from "playwright"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const MODE = (process.argv[2] ?? "STATES").toUpperCase()
const OUT_DIR = resolve(process.cwd(), "captures/sprint-3")
const URL = process.env.SITE_URL ?? "http://localhost:3001"

const VIEWPORTS = [
  { name: "1280", width: 1280, height: 800 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
] as const

const TOGGLE_LABELS = {
  choropleth: "Valeurs €/m² par arrondissement",
  heatmap: "Densité du marché",
  markers: "Biens en exclusivité",
} as const

type LayersOn = { choropleth: boolean; heatmap: boolean; markers: boolean }

async function setLayers(page: Page, target: LayersOn) {
  // Les checkboxes sont `sr-only` ; on clique le label parent qui est
  // visible et a la même action de toggle.
  for (const [key, label] of Object.entries(TOGGLE_LABELS)) {
    const want = target[key as keyof LayersOn]
    const checkbox = page.locator(`input[aria-label="${label}"]`)
    const isChecked = await checkbox.isChecked()
    if (isChecked !== want) {
      const labelEl = page
        .locator("label")
        .filter({ has: page.locator(`input[aria-label="${label}"]`) })
        .first()
      await labelEl.click()
    }
  }
  await page.waitForTimeout(500)
}

async function scrollToArgus(page: Page) {
  const section = page.locator("section#argus").first()
  await section.scrollIntoViewIfNeeded()
  await page.waitForTimeout(800) // attendre le tile load + reveal animation
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
      await page.goto(URL, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      await scrollToArgus(page)
      // Attendre que MapLibre soit prêt (tile load)
      await page.waitForTimeout(1500)

      // État 1 : tous activés (par défaut)
      await setLayers(page, { choropleth: true, heatmap: true, markers: true })
      await page.waitForTimeout(800)
      await page.screenshot({
        path: `${OUT_DIR}/argus-all-${vp.name}.png`,
        fullPage: false,
      })
      console.log(`✓ argus-all-${vp.name}`)

      // État 2 : choroplèthes seuls
      await setLayers(page, { choropleth: true, heatmap: false, markers: false })
      await page.screenshot({
        path: `${OUT_DIR}/argus-choropleth-only-${vp.name}.png`,
        fullPage: false,
      })
      console.log(`✓ argus-choropleth-only-${vp.name}`)

      // État 3 : heatmap seule
      await setLayers(page, { choropleth: false, heatmap: true, markers: false })
      await page.screenshot({
        path: `${OUT_DIR}/argus-heatmap-only-${vp.name}.png`,
        fullPage: false,
      })
      console.log(`✓ argus-heatmap-only-${vp.name}`)

      // État 4 : markers seuls (équivalent AVANT sprint 3 — preuve non-régression)
      await setLayers(page, { choropleth: false, heatmap: false, markers: true })
      await page.screenshot({
        path: `${OUT_DIR}/argus-markers-only-${vp.name}.png`,
        fullPage: false,
      })
      console.log(`✓ argus-markers-only-${vp.name}`)

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
    await page.goto(URL, { waitUntil: "networkidle" })
    await page.evaluate(() => document.fonts.ready)
    await scrollToArgus(page)
    await page.waitForTimeout(2000)

    // Hover sur un arrondissement (8e Triangle d'or) via la table
    const row8 = page.locator("tr").filter({ hasText: "Paris 8" }).first()
    await row8.hover()
    await page.waitForTimeout(900)

    async function clickToggle(label: string) {
      const labelEl = page
        .locator("label")
        .filter({ has: page.locator(`input[aria-label="${label}"]`) })
        .first()
      await labelEl.click()
    }

    // Toggle heatmap off puis on
    await clickToggle(TOGGLE_LABELS.heatmap)
    await page.waitForTimeout(700)
    await clickToggle(TOGGLE_LABELS.heatmap)
    await page.waitForTimeout(700)

    // Toggle choropleth off puis on
    await clickToggle(TOGGLE_LABELS.choropleth)
    await page.waitForTimeout(700)
    await clickToggle(TOGGLE_LABELS.choropleth)
    await page.waitForTimeout(700)

    // Zoom-in pour révéler les points individuels
    const mapCanvas = page.locator("section#argus canvas").first()
    const box = await mapCanvas.boundingBox()
    if (box) {
      const cx = box.x + box.width / 2
      const cy = box.y + box.height / 2
      // Double-click zoom + scroll wheel
      for (let i = 0; i < 4; i++) {
        await page.mouse.wheel(0, -300)
        await page.keyboard.down("Control")
        await page.mouse.wheel(0, -200)
        await page.keyboard.up("Control")
        await page.waitForTimeout(250)
        // Bypass cooperativeGestures avec ctrl
        await page.keyboard.down("Control")
        await page.mouse.move(cx, cy)
        await page.mouse.wheel(0, -300)
        await page.keyboard.up("Control")
      }
    }
    await page.waitForTimeout(1800)
    await page.close()
    const video = page.video()
    await context.close()
    if (video) {
      const dst = `${OUT_DIR}/demo-argus-enriched.webm`
      await video.saveAs(dst)
      console.log(`✓ ${dst}`)
    }
  } finally {
    await browser.close()
  }
}

async function runPerf() {
  const browser = await chromium.launch()
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    })
    const page = await context.newPage()

    const consoleMessages: string[] = []
    page.on("console", (msg) => {
      if (msg.text().includes("argus-map")) consoleMessages.push(msg.text())
    })

    const t0 = Date.now()
    await page.goto(URL, { waitUntil: "networkidle" })
    await page.evaluate(() => document.fonts.ready)
    await scrollToArgus(page)
    // Attendre que le canvas MapLibre soit visible
    await page.locator("section#argus canvas").first().waitFor({ state: "visible", timeout: 15000 })
    const tCanvas = Date.now() - t0
    // Attendre 2 s supplémentaire pour les tiles + l'event "load" interne
    await page.waitForTimeout(2500)
    const tFull = Date.now() - t0
    await context.close()

    const lines = [
      `=== Mesure perf — première interactivité carte ARGUS sprint 3 ===`,
      ``,
      `Environnement : Playwright chromium headless, viewport 1440×900, dev server Next 16 Turbopack`,
      `Méthode : page.goto(/) → networkidle → scrollIntoView ARGUS → wait for canvas visible`,
      ``,
      `Temps page.goto → canvas visible : ${tCanvas} ms`,
      `Temps page.goto → tiles + load event : ${tFull} ms`,
      ``,
      `Mesures additionnelles (browser console, mountTime → onLoad) :`,
      ...(consoleMessages.length ? consoleMessages.map((m) => `  ${m}`) : ["  [aucune mesure capturée]"]),
      ``,
      `Note : dev mode (HMR), perf prod attendue sensiblement meilleure (build optim + minification + cache).`,
    ]
    const out = `${OUT_DIR}/perf-measurement.txt`
    const { writeFileSync } = await import("node:fs")
    writeFileSync(out, lines.join("\n"))
    console.log(`✓ ${out}`)
    for (const l of lines) console.log(l)
  } finally {
    await browser.close()
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  if (MODE === "STATES") return runStates()
  if (MODE === "DEMO") return runDemo()
  if (MODE === "PERF") return runPerf()
  console.error(`Mode inconnu : ${MODE}`)
  process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
