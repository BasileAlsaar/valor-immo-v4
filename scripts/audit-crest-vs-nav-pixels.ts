/**
 * Audit pixel : on prend la capture 1440 brute, on scanne :
 *  - la colonne x du milieu du V de "VENTE" → premier pixel blanc opaque
 *  - la colonne x du milieu du V du crest    → premier pixel blanc opaque
 *  - écart Y en pixels viewport
 *
 * Sortie : valeur précise pour piloter le top du wrapper.
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
  const rects = await page.evaluate(() => {
    const navLink = document.querySelector("header nav a") as HTMLElement | null
    const crestImg = document.querySelector(
      '[data-testid="hero-logo"] img',
    ) as HTMLElement | null
    return {
      navRect: navLink?.getBoundingClientRect(),
      crestRect: crestImg?.getBoundingClientRect(),
    }
  })
  const buf = await page.screenshot({ fullPage: false })
  const meta = await sharp(buf).metadata()
  const raw = await sharp(buf).raw().toBuffer()
  const W = meta.width ?? 1440
  const channels = meta.channels ?? 3

  function scanFirstOpaqueY(xMin: number, xMax: number, yMin: number, yMax: number, threshold: number) {
    for (let y = yMin; y <= yMax; y++) {
      for (let x = xMin; x <= xMax; x++) {
        const idx = (y * W + x) * channels
        const r = raw[idx], g = raw[idx + 1], b = raw[idx + 2]
        if (r >= threshold && g >= threshold && b >= threshold) {
          return { y, x, r, g, b }
        }
      }
    }
    return null
  }

  // VENTE bbox
  const nx = Math.round(rects.navRect?.left ?? 0)
  const ny = Math.round(rects.navRect?.top ?? 0)
  const nw = Math.round(rects.navRect?.width ?? 0)
  const nh = Math.round(rects.navRect?.height ?? 0)
  // Crest bbox
  const cx = Math.round(rects.crestRect?.left ?? 0)
  const cy = Math.round(rects.crestRect?.top ?? 0)
  const cw = Math.round(rects.crestRect?.width ?? 0)
  const ch = Math.round(rects.crestRect?.height ?? 0)

  for (const t of [150, 200, 230]) {
    const ventTop = scanFirstOpaqueY(nx, nx + nw, ny, ny + nh, t)
    // Pour le crest, scanner plus large car le crest occupe une plus grosse zone
    const crestTop = scanFirstOpaqueY(cx, cx + cw, cy, cy + ch, t)
    console.log(`\n--- threshold=${t} ---`)
    console.log(`VENTE bbox top=${ny} left=${nx} w=${nw} h=${nh}`)
    console.log(`  first opaque  : y=${ventTop?.y} x=${ventTop?.x} rgb=(${ventTop?.r},${ventTop?.g},${ventTop?.b})`)
    console.log(`Crest bbox top=${cy} left=${cx} w=${cw} h=${ch}`)
    console.log(`  first opaque  : y=${crestTop?.y} x=${crestTop?.x} rgb=(${crestTop?.r},${crestTop?.g},${crestTop?.b})`)
    if (ventTop && crestTop) {
      console.log(`  ➜ Δ (crest - vente) = ${crestTop.y - ventTop.y}px`)
    }
  }
  await ctx.close()
  await browser.close()
}
main().catch((e) => { console.error(e); process.exit(1) })
