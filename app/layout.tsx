import type React from "react"
import type { Metadata, Viewport } from "next"
import { Quicksand, Nunito } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _quicksand = Quicksand({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })
const _nunito = Nunito({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })

export const metadata: Metadata = {
  title: "TROPICAL PULSE | Los Smoothies más Frescos y Naturales de Costa Rica",
  description:
    "Disfruta de la explosión tropical de TROPICAL PULSE. Smoothies 100% naturales, bowls energéticos y bebidas personalizadas en Costa Rica. ¡Vive la experiencia Fresh!",
  keywords: ["smoothies costa rica", "bebidas naturales", "tropical pulse", "smoothies saludables", "jugos frescos", "batidos naturales"],
  authors: [{ name: "SR STUDIO", url: "https://srstudio.vercel.app" }],
  openGraph: {
    title: "TROPICAL PULSE | Explosión Tropical de Sabor",
    description: "Smoothies 100% naturales y personalizados. ¡Pide el tuyo ahora!",
    type: "website",
    url: "https://tropical-pulse.vercel.app",
    siteName: "Tropical Pulse",
  },
  twitter: {
    card: "summary_large_image",
    title: "TROPICAL PULSE | Vive Fresh",
    description: "Los smoothies más frescos de Costa Rica en un solo lugar.",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🥭</text></svg>",
  },
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
