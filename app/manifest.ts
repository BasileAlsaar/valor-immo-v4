import type { MetadataRoute } from "next"

import { SITE } from "@/lib/site"

// theme_color / background_color lus dans app/globals.css :
// --color-fir-dark = #0F3D2E  (vert sapin, couleur de marque)
// --color-cream    = #F5F2EC  (fond crème de l'app)
// Aucune valeur inventée.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.name,
    description: SITE.homeDescription,
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "fr",
    theme_color: "#0F3D2E",
    background_color: "#F5F2EC",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
