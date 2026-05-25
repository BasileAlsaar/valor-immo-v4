import { chromium } from "playwright"
const URL = "http://localhost:3010"

async function main() {
  const browser = await chromium.launch()
  // Test viewports problématiques : large mais court (Safari macOS plein écran avec dock)
  for (const vp of [
    { w: 1920, h: 800, tag: "1920x800-short" },
    { w: 1500, h: 700, tag: "1500x700-short" },
    { w: 1366, h: 768, tag: "1366x768-laptop" },
  ]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, reducedMotion: "reduce" })
    const page = await ctx.newPage()
    await page.goto(`${URL}/`, { waitUntil: "networkidle" })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(800)
    const m = await page.evaluate(() => {
      const cta = Array.from(document.querySelectorAll("a")).find((a) => (a.textContent ?? "").includes("Voir les opportunités")) as HTMLElement | null
      const section = document.querySelector("section") as HTMLElement | null
      const next = document.querySelectorAll("section")[1] as HTMLElement | null
      return {
        ctaBottom: cta?.getBoundingClientRect().bottom,
        heroBottom: section?.getBoundingClientRect().bottom,
        nextTop: next?.getBoundingClientRect().top,
      }
    })
    console.log(`\n=== ${vp.tag} (${vp.w}×${vp.h}) ===`)
    console.log(`  CTA bottom: ${Math.round(m.ctaBottom ?? 0)}`)
    console.log(`  Hero section bottom: ${Math.round(m.heroBottom ?? 0)}`)
    console.log(`  Next section top: ${Math.round(m.nextTop ?? 0)}`)
    console.log(`  CTA inside hero? ${(m.ctaBottom ?? 999) <= (m.heroBottom ?? 0) ? "yes ✓" : "NO — clipped"}`)
    await ctx.close()
  }
  await browser.close()
}
main().catch(e => { console.error(e); process.exit(1) })
