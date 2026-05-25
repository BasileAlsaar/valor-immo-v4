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
      const header = document.querySelector("header") as HTMLElement | null
      const logo = header?.querySelector("a img") as HTMLElement | null
      const navLink = header?.querySelector("nav a") as HTMLElement | null
      const crest = document.querySelector(
        '[data-testid="hero-logo"]',
      ) as HTMLElement | null
      const heroSection = document.querySelector("section") as HTMLElement | null
      const h1 = document.querySelector("h1") as HTMLElement | null
      const scroll = Array.from(document.querySelectorAll("span")).find(
        (s) => (s.textContent ?? "").trim().toLowerCase() === "scroll",
      ) as HTMLElement | null
      return {
        header: header?.getBoundingClientRect(),
        logo: logo?.getBoundingClientRect(),
        navLink: navLink?.getBoundingClientRect(),
        navText: (navLink?.textContent ?? "").trim(),
        crest: crest?.getBoundingClientRect(),
        heroSection: heroSection?.getBoundingClientRect(),
        h1: h1?.getBoundingClientRect(),
        scroll: scroll?.getBoundingClientRect(),
        viewportH: window.innerHeight,
      }
    })
    console.log(`\n=== ${vp.tag} (${vp.w}×${vp.h}) viewportH=${m.viewportH} ===`)
    console.log(`  header: top=${Math.round(m.header?.top ?? 0)} h=${Math.round(m.header?.height ?? 0)}`)
    console.log(`  logo SiteHeader: top=${Math.round(m.logo?.top ?? 0)} left=${Math.round(m.logo?.left ?? 0)} h=${Math.round(m.logo?.height ?? 0)}`)
    console.log(`  nav link "${m.navText}": top=${Math.round(m.navLink?.top ?? 0)} left=${Math.round(m.navLink?.left ?? 0)} h=${Math.round(m.navLink?.height ?? 0)}`)
    console.log(`  crest: top=${Math.round(m.crest?.top ?? 0)} left=${Math.round(m.crest?.left ?? 0)} h=${Math.round(m.crest?.height ?? 0)}`)
    console.log(`  h1: top=${Math.round(m.h1?.top ?? 0)} left=${Math.round(m.h1?.left ?? 0)}`)
    console.log(`  hero section: h=${Math.round(m.heroSection?.height ?? 0)} (≤vp? ${(m.heroSection?.height ?? 0) <= (m.viewportH ?? 0)})`)
    if (m.scroll) console.log(`  scroll indicator: top=${Math.round(m.scroll.top)} bottom=${Math.round(m.scroll.bottom)} visible=${m.scroll.bottom <= (m.viewportH ?? 0)}`)
    await ctx.close()
  }
  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
