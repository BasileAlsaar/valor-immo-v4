/**
 * Découpe verticale du crest : pour chaque y de la zone crest, scan le pixel
 * le plus blanc trouvé. Permet de cartographier où se trouvent les éléments
 * visibles (V, "VALOR IMMO" texte, tagline) à quel y du viewport.
 */
import { chromium } from "playwright"
import sharp from "sharp"

const URL = process.env.SITE_URL ?? "http://localhost:3010"

async function main() {
  const browser = await chromium.launch()
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  })
  const page = await ctx.newPage()
  await page.goto(`${URL}/`, { waitUntil: "networkidle" })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1200)
  const rect = await page.evaluate(() => {
    const img = document.querySelector('[data-testid="hero-logo"] img') as HTMLElement | null
    return img?.getBoundingClientRect()
  })
  const buf = await page.screenshot({ fullPage: false })
  const meta = await sharp(buf).metadata()
  const raw = await sharp(buf).raw().toBuffer()
  const W = meta.width ?? 1440
  const channels = meta.channels ?? 3

  const cx = Math.round(rect?.left ?? 0)
  const cy = Math.round(rect?.top ?? 0)
  const cw = Math.round(rect?.width ?? 0)
  const ch = Math.round(rect?.height ?? 0)
  console.log(`Crest bbox: top=${cy} left=${cx} w=${cw} h=${ch}`)
  console.log(`Scanning y=${cy}..${cy+ch}, x=${cx}..${cx+cw}\n`)
  console.log("  y   | maxBrightness | (r,g,b) at brightest x | first opaque (>=200)")
  console.log("------+---------------+------------------------+----------------------")

  for (let y = cy; y < cy + ch; y += 4) {
    let maxBright = 0, maxR = 0, maxG = 0, maxB = 0, maxX = -1
    let firstOpaqueX = -1
    for (let x = cx; x < cx + cw; x++) {
      const idx = (y * W + x) * channels
      const r = raw[idx], g = raw[idx + 1], b = raw[idx + 2]
      const bright = (r + g + b) / 3
      if (bright > maxBright) {
        maxBright = bright
        maxR = r; maxG = g; maxB = b; maxX = x
      }
      if (firstOpaqueX < 0 && r >= 200 && g >= 200 && b >= 200) firstOpaqueX = x
    }
    const marker = firstOpaqueX >= 0 ? `x=${firstOpaqueX} ✓` : "—"
    console.log(`  ${String(y).padStart(3)} |    ${maxBright.toFixed(0).padStart(3)}        | (${maxR},${maxG},${maxB}) at x=${maxX}  | ${marker}`)
  }
  await ctx.close()
  await browser.close()
}
main().catch((e) => { console.error(e); process.exit(1) })
