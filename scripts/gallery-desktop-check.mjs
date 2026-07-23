import { chromium } from "playwright"

const slugs = [
  { label: "vi11 (8 photos, affecté)", slug: "local-commercial-avec-extraction-ternes-paris-17eme-vi11" },
  { label: "vi18 (11 photos, affecté)", slug: "a-louer-hotel-particulier-de-bureaux-r-3-165-m-paris-17-vi18" },
  { label: "vi38 (4 photos, affecté)", slug: "bureau-contemporain-de-66-m-a-javel-paris-15eme-vi38" },
  { label: "vi7 (2 photos, jusque-là correct)", slug: "local-commercial-31-m-avec-extraction-professionnelle-plaisance-paris-14eme-vi7" },
]

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await context.newPage()

for (const { label, slug } of slugs) {
  await page.goto(`http://localhost:3001/commerces/${slug}`, { waitUntil: "networkidle" })
  const outfile = `/tmp/gallery-${slug.split("-").pop()}.png`
  await page.screenshot({ path: outfile, fullPage: false })

  const info = await page.evaluate(() => {
    const gallery = document.querySelector('[data-testid="opportunity-gallery"]')
    if (!gallery) return { found: false }
    const galleryRect = gallery.getBoundingClientRect()
    const gridInner = gallery.firstElementChild
    const gridRect = gridInner.getBoundingClientRect()
    const thumbsCol = gridInner.children[1]
    const thumbsRect = thumbsCol ? thumbsCol.getBoundingClientRect() : null
    const thumbBtns = thumbsCol ? Array.from(thumbsCol.children) : []
    const thumbHeights = thumbBtns.map((el) => el.getBoundingClientRect().height)

    const description = Array.from(document.querySelectorAll("p, h2"))
      .find((el) => el.textContent && el.textContent.trim() === "Description")
    const descRect = description ? description.getBoundingClientRect() : null

    const galleryBottom = galleryRect.top + galleryRect.height
    const descTop = descRect ? descRect.top : null
    const gap = descTop != null ? descTop - galleryBottom : null

    return {
      found: true,
      galleryHeight: Math.round(galleryRect.height),
      gridHeight: Math.round(gridRect.height),
      thumbsColHeight: thumbsRect ? Math.round(thumbsRect.height) : null,
      thumbCount: thumbBtns.length,
      thumbHeights: thumbHeights.map((h) => Math.round(h)),
      totalThumbHeightWithGaps:
        thumbHeights.length > 0
          ? Math.round(thumbHeights.reduce((a, b) => a + b, 0) + (thumbHeights.length - 1) * 12)
          : 0,
      descriptionTop: descRect ? Math.round(descTop) : null,
      galleryBottom: Math.round(galleryBottom),
      gapGalleryToDescription: gap != null ? Math.round(gap) : null,
      overflow:
        thumbsRect && thumbHeights.length > 0
          ? Math.max(
              0,
              Math.round(
                thumbHeights.reduce((a, b) => a + b, 0) +
                  (thumbHeights.length - 1) * 12 -
                  thumbsRect.height,
              ),
            )
          : 0,
    }
  })

  console.log(`\n=== ${label} ===`)
  console.log(`  screenshot: ${outfile}`)
  console.log(JSON.stringify(info, null, 2))
}

await browser.close()
