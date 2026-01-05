import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ManosasSection } from "@/components/manosas-section"
import { MenuSection } from "@/components/menu-section"
import { BuildYourOwn } from "@/components/build-your-own"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/components/cart-context"
import { CartSidebar } from "@/components/cart-sidebar"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <CartProvider>
      <main className="min-h-screen bg-background">
        <Navigation />
        <HeroSection />
        <ManosasSection />
        <MenuSection />
        <BuildYourOwn />
        <Footer />
        <CartSidebar />
        <Toaster />
      </main>
    </CartProvider>
  )
}
