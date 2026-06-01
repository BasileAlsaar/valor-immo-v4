import type { Metadata } from "next"
import {
  Anton,
  Inter,
  Cormorant_Garamond,
  JetBrains_Mono,
} from "next/font/google"
import "./globals.css"

import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { JsonLdScript } from "@/components/seo/json-ld-script"
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld"
import { SITE } from "@/lib/site"

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["italic"],
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.baseline} · Paris`,
    template: `%s · ${SITE.name}`,
  },
  description:
    "Transaction, location et gestion d'actifs commerciaux à Paris : boutiques, bureaux, immeubles, hôtellerie, logistique.",
  alternates: { canonical: SITE.url },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.baseline} · Paris`,
    description:
      "Transaction, location et gestion d'actifs commerciaux à Paris : boutiques, bureaux, immeubles, hôtellerie, logistique.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.baseline}`,
    description:
      "Immobilier commercial et professionnel à Paris.",
  },
  icons: { icon: "/favicon.ico" },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      className={`${anton.variable} ${inter.variable} ${cormorant.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <JsonLdScript data={organizationJsonLd()} />
        <JsonLdScript data={websiteJsonLd()} />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
