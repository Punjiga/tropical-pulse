import type React from "react"
import type { Metadata, Viewport } from "next"
import { Quicksand, Nunito } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _quicksand = Quicksand({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })
const _nunito = Nunito({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })

export const metadata: Metadata = {
  title: "TROPICAL PULSE | Smoothies Frescos en Costa Rica",
  description:
    "Descubre los smoothies más frescos y deliciosos de Costa Rica. Ingredientes naturales, sabores tropicales y energía pura. ¡Vive Fresh!",
  keywords: ["smoothies", "Costa Rica", "tropical", "saludable", "bebidas", "frutas"],
  authors: [{ name: "SR STUDIO", url: "https://srstudio.vercel.app" }],
  openGraph: {
    title: "TROPICAL PULSE | Smoothies Frescos",
    description: "Los mejores smoothies tropicales de Costa Rica",
    type: "website",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🥭</text></svg>",
  },
  generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#FDB927",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
