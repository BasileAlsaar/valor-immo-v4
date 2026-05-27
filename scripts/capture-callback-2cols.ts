import { chromium, type Page } from "playwright"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const OUT_DIR = resolve(process.cwd(), "docs/ux-review-2026-05-27/correctif-callback")
const URL = process.env.SITE_URL ?? "http://localhost:3010"

async function scrollToText(page: Page, needle: string, off = 0.3) {
  await page.evaluate(({ n, o }) => {
    const needle = n.toLowerCase()
    const all = Array.from(document.querySelectorAll("h1, h2, h3, p, span"))
    const el = all.find((e) => (e as HTMLElement).innerText?.toLowerCase().includes(needle))
    if (!el) return
    const rect = el.getBoundingClientRect()
    const target = window.scrollY + rect.top - window.innerHeight * o + rect.height / 2
    window.scrollTo({ top: target, behavior: "instant" })
  }, { n: needle, o: off })
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" })
  const page = await ctx.newPage()
  for (const path of ["/vente", "/l-agence"]) {
    await page.goto(`${URL}${path}`, { waitUntil: "load", timeout: 30000 })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1500)
    await scrollToText(page, "Discutons-en", 0.25)
    await page.waitForTimeout(1500)
    const slug = path.replace(/^\//, "").replace(/\//g, "-") || "home"
    await page.screenshot({ path: `${OUT_DIR}/${slug}-callback-1440.png`, fullPage: false })
    console.log(`✓ ${slug}-callback`)
  }
  await browser.close()
}
main().catch((e) => { console.error(e); process.exit(1) })
