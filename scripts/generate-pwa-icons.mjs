import sharp from "sharp"
import { resolve } from "node:path"

const SOURCE = resolve("public/logo-valor-immo.png")
const BG = { r: 0x0f, g: 0x3d, b: 0x2e, alpha: 1 } // --color-fir-dark #0F3D2E (lu dans app/globals.css)
const PUBLIC_DIR = resolve("public")
const APP_DIR = resolve("app")

async function makeIcon({ size, logoRatio, output }) {
  const logoSize = Math.round(size * logoRatio)
  const logo = await sharp(SOURCE)
    .resize(logoSize, logoSize, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer()

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BG,
    },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(output)

  console.log(`✓ ${output}`)
}

await makeIcon({
  size: 192,
  logoRatio: 0.85,
  output: resolve(PUBLIC_DIR, "icon-192.png"),
})
await makeIcon({
  size: 512,
  logoRatio: 0.85,
  output: resolve(PUBLIC_DIR, "icon-512.png"),
})
await makeIcon({
  size: 512,
  logoRatio: 0.8, // zone safe maskable PWA = 80 % central
  output: resolve(PUBLIC_DIR, "maskable-512.png"),
})
await makeIcon({
  size: 180,
  logoRatio: 0.85,
  output: resolve(APP_DIR, "apple-icon.png"),
})
