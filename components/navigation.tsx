"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useCart } from "./cart-context"

const navLinks = [
  { name: "Inicio", href: "#inicio" },
  { name: "Menú", href: "#menu" },
  { name: "Build Your Own", href: "#build" },
  { name: "Delivery", href: "#delivery" },
  { name: "Contacto", href: "#contacto" },
]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { items, setIsOpen } = useCart()

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass shadow-lg" : "bg-transparent pt-4"
        }`}
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <motion.a
            href="#inicio"
            className="flex cursor-pointer items-center gap-2 font-serif text-xl font-bold text-foreground md:text-2xl"
          >
            <motion.span
              className="text-2xl md:text-3xl"
            >
              🌴
            </motion.span>
            <span>TROPICAL PULSE</span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="cursor-pointer font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                {link.name}
              </motion.a>
            ))}
          </div>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => setIsOpen(true)}
              className="relative cursor-pointer rounded-full bg-primary p-2 text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
              animate={cartCount > 0 ? { y: [0, -18, 0], scale: [1, 1.2, 1] } : {}}
              transition={cartCount > 0 ? {
                duration: 1,
                repeat: Infinity,
                ease: "anticipate"
              } : {}}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Carrito con ${cartCount} items`}
            >
              <ShoppingCart className="h-5 w-5" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground"
                  >
                    <span>{cartCount}</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="cursor-pointer rounded-lg p-2 text-foreground md:hidden"
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-0 top-0 z-[60] flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl md:hidden"
          >
            {/* Close button inside modal for better UX */}
            <motion.button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-8 right-8 cursor-pointer rounded-full p-2 text-foreground/80 hover:bg-secondary"
            >
              <X className="h-10 w-10" />
            </motion.button>

            <div className="flex w-full flex-col items-center gap-8 px-6 py-4">
              <motion.span
                className="text-6xl mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                🌴
              </motion.span>
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center cursor-pointer font-serif text-4xl font-bold text-foreground transition-all hover:text-primary hover:scale-110"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
