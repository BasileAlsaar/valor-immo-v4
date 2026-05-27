/**
 * scripts/download-pexels-mod6.ts
 *
 * Télécharge les photos Pexels validées pour MOD 6, resize 1920px max,
 * recompresse en JPG progressif quality 82, écrit dans public/images/categories/.
 * Next.js sert ensuite AVIF/WebP automatiquement via /_next/image.
 *
 * Usage : npx tsx scripts/download-pexels-mod6.ts [slug1 slug2 ...]
 * (sans argument : tous les slugs définis ci-dessous)
 */

import sharp from "sharp"
import { writeFile } from "node:fs/promises"
import { resolve } from "node:path"

const DEST_DIR = resolve(process.cwd(), "public/images/categories")

// Sources Pexels — URLs directes vers le JPEG haute résolution
const SOURCES: Record<string, { url: string; pexelsPage: string; author: string }> = {
  "locaux-commerciaux": {
    url: "https://images.pexels.com/photos/32417557/pexels-photo-32417557.jpeg",
    pexelsPage: "https://www.pexels.com/photo/charming-antique-shop-in-paris-display-window-32417557/",
    author: "Pexels (Charming Antique Shop in Paris)",
  },
  immeubles: {
    url: "https://images.pexels.com/photos/31058041/pexels-photo-31058041.jpeg",
    pexelsPage: "https://www.pexels.com/photo/elegant-haussmann-building-in-paris-france-31058041/",
    author: "Abhishek Navlakha",
  },
  "entrepots-logistique": {
    url: "https://images.pexels.com/photos/3831826/pexels-photo-3831826.jpeg",
    pexelsPage: "https://www.pexels.com/photo/modern-interior-of-spacious-empty-warehouse-3831826/",
    author: "Andrea Piacquadio",
  },
  "cession-droit-au-bail": {
    url: "https://images.pexels.com/photos/19032000/pexels-photo-19032000.jpeg",
    pexelsPage: "https://www.pexels.com/photo/empty-cafe-with-antique-furniture-19032000/",
    author: "Tahir Osman",
  },
  bureaux: {
    url: "https://images.pexels.com/photos/4353719/pexels-photo-4353719.jpeg",
    pexelsPage: "https://www.pexels.com/photo/cozy-interior-with-bookshelves-and-fireplace-4353719/",
    author: "ArtHouse Studio",
  },
}

const MAX_WIDTH = 1920
const QUALITY = 82

async function processOne(slug: string) {
  const src = SOURCES[slug]
  if (!src) {
    console.error(`✗ ${slug} : aucune source définie`)
    return
  }
  console.log(`→ ${slug} : fetch ${src.url}`)
  const res = await fetch(src.url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; valor-immo-asset-fetch/1.0)" },
  })
  if (!res.ok) {
    console.error(`✗ ${slug} : HTTP ${res.status}`)
    return
  }
  const buf = Buffer.from(await res.arrayBuffer())
  const out = await sharp(buf)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
    .toBuffer()
  const destPath = resolve(DEST_DIR, `${slug}.jpg`)
  await writeFile(destPath, out)
  const inKb = (buf.length / 1024).toFixed(0)
  const outKb = (out.length / 1024).toFixed(0)
  const meta = await sharp(out).metadata()
  console.log(`✓ ${slug} : ${meta.width}×${meta.height} ${outKb}KB (source ${inKb}KB) — ${src.author}`)
}

async function main() {
  const slugs = process.argv.slice(2)
  const targets = slugs.length ? slugs : Object.keys(SOURCES)
  for (const slug of targets) {
    await processOne(slug)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
