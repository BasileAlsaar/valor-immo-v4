import type { Metadata, Viewport } from "next"
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
import { RegisterPWA } from "@/components/pwa/register-pwa"
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
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  title: {
    default: SITE.homeTitle,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.homeDescription,
  alternates: { canonical: SITE.url },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.homeTitle,
    description: SITE.homeDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.homeTitle,
    description: SITE.homeDescription,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE.name,
  },
}

// themeColor lu dans app/globals.css → --color-fir-dark #0F3D2E
export const viewport: Viewport = {
  themeColor: "#0F3D2E",
  width: "device-width",
  initialScale: 1,
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
        <RegisterPWA />
      </body>
    </html>
  )
}
