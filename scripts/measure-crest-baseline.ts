/**
 * Mesure fine : où apparaît visuellement le V du crest vs baseline des
 * liens nav du SiteHeader. Le PNG du logo a du padding transparent en haut,
 * donc l'image.top mesuré (bounding box) est plus haut que le V visible.
 * On scanne les pixels de la capture pour repérer le premier pixel non
 * transparent de la zone crest.
 */
import { chromium } from "playwright"
import sharp from "sharp"

const URL = process.env.SITE_URL ?? "http://localhost:3010"

async function main() {
  const browser = await chromium.launch()
  for (const vp of [
    { w: 1920, h: 1080, tag: "1920" },
    { w: 1440, h: 900, tag: "1440" },
    { w: 1280, h: 800, tag: "1280" },
    { w: 1024, h: 768, tag: "1024" },
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      reducedMotion: "reduce",
    })
    const page = await ctx.newPage()
    await page.goto(`${URL}/`, { waitUntil: "networkidle" })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1200)
    const m = await page.evaluate(() => {
      const header = document.querySelector("header") as HTMLElement | null
      const logo = header?.querySelector("a img") as HTMLElement | null
      const navLink = header?.querySelector("nav a") as HTMLElement | null
      const crest = document.querySelector(
        '[data-testid="hero-logo"] img',
      ) as HTMLElement | null
      // Mesure baseline approximative via canvas mesuré
      let navBaseline: number | null = null
      if (navLink) {
        const rect = navLink.getBoundingClientRect()
        const cs = window.getComputedStyle(navLink)
        // baseline ≈ rect.top + line-box ascent. Approximation : top + 0.8 * fontSize.
        const fontSize = parseFloat(cs.fontSize)
        navBaseline = rect.top + fontSize * 0.8
      }
      return {
        logoRect: logo?.getBoundingClientRect(),
        navRect: navLink?.getBoundingClientRect(),
        navBaseline,
        navText: (navLink?.textContent ?? "").trim(),
        navFontSize: navLink ? parseFloat(window.getComputedStyle(navLink).fontSize) : null,
        crestRect: crest?.getBoundingClientRect(),
        vh: window.innerHeight,
      }
    })
    // Capture & pixel scan dans la zone crest
    const buf = await page.screenshot({ fullPage: false })
    const img = sharp(buf)
    const meta = await img.metadata()
    const raw = await img.raw().toBuffer()
    const channels = meta.channels ?? 3
    const W = meta.width ?? vp.w
    // Zone du crest dans la capture
    const cx = Math.round(m.crestRect?.left ?? 0)
    const cy = Math.round(m.crestRect?.top ?? 0)
    const cw = Math.round(m.crestRect?.width ?? 0)
    const ch = Math.round(m.crestRect?.height ?? 0)
    // Scan vertical : trouver la première ligne où il y a au moins un pixel
    // non transparent (alpha > 32) OU non blanc en dessous d'un seuil dans la zone crest.
    // Le crest est `brightness-0 invert` → rendu blanc opaque sur fond sombre.
    // On cherche donc le premier pixel "très clair" (>= 200 sur RGB) dans la zone.
    let firstY: number | null = null
    for (let y = cy; y < cy + ch; y++) {
      for (let x = cx; x < cx + cw; x++) {
        const idx = (y * W + x) * channels
        const r = raw[idx]
        const g = raw[idx + 1]
        const b = raw[idx + 2]
        // Seuil 200 — capte le V solide (crest est blanc opaque sur fond sombre)
        // sans confondre avec la vidéo de fond qui peut atteindre ~150.
        if (r >= 200 && g >= 200 && b >= 200) {
          firstY = y
          break
        }
      }
      if (firstY !== null) break
    }
    console.log(`\n=== ${vp.tag} (${vp.w}×${vp.h}) ===`)
    console.log(`  nav link "${m.navText}": top=${Math.round(m.navRect?.top ?? 0)} fontSize=${m.navFontSize?.toFixed(1)} baseline≈${m.navBaseline?.toFixed(1)}`)
    console.log(`  logo SiteHeader bbox top=${Math.round(m.logoRect?.top ?? 0)}`)
    console.log(`  crest <img> bbox top=${Math.round(m.crestRect?.top ?? 0)} height=${ch}`)
    console.log(`  crest V VISIBLE first opaque y = ${firstY} (delta vs nav baseline = ${firstY !== null && m.navBaseline ? Math.round(firstY - m.navBaseline) : "?"}px)`)
    await ctx.close()
  }
  await browser.close()
}
main().catch((e) => { console.error(e); process.exit(1) })
