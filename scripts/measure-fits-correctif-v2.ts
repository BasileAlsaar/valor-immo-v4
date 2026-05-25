import { chromium } from "playwright"

const URL = process.env.SITE_URL ?? "http://localhost:3004"

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
    await page.waitForTimeout(800)
    const m = await page.evaluate(() => {
      const ctaLink = Array.from(document.querySelectorAll("a")).find((a) =>
        (a.textContent ?? "").includes("Voir les opportunités"),
      ) as HTMLElement | null
      const searchForm = document.querySelector("form") as HTMLElement | null
      const scrollSpan = Array.from(document.querySelectorAll("span")).find(
        (s) => (s.textContent ?? "").trim().toLowerCase() === "scroll",
      ) as HTMLElement | null
      return {
        searchForm: searchForm?.getBoundingClientRect(),
        ctaLink: ctaLink?.getBoundingClientRect(),
        scroll: scrollSpan?.getBoundingClientRect(),
        viewportH: window.innerHeight,
      }
    })
    console.log(`\n=== ${vp.tag} viewportH=${m.viewportH} ===`)
    console.log(`  searchForm: top=${Math.round(m.searchForm?.top ?? 0)} bottom=${Math.round(m.searchForm?.bottom ?? 0)} visible=${(m.searchForm?.bottom ?? 999) <= (m.viewportH ?? 0)}`)
    console.log(`  CTA bandeau: top=${Math.round(m.ctaLink?.top ?? 0)} bottom=${Math.round(m.ctaLink?.bottom ?? 0)} visible=${(m.ctaLink?.bottom ?? 999) <= (m.viewportH ?? 0)}`)
    console.log(`  SCROLL: top=${Math.round(m.scroll?.top ?? 0)} bottom=${Math.round(m.scroll?.bottom ?? 0)} visible=${(m.scroll?.bottom ?? 999) <= (m.viewportH ?? 0)}`)
    await ctx.close()
  }
  await browser.close()
}
main().catch((e) => {
  console.error(e)
  process.exit(1)
})
