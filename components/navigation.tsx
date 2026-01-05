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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-4 ${scrolled ? "glass shadow-lg pt-0" : "bg-transparent"
        }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <motion.a
            href="#inicio"
            className="flex cursor-pointer items-center gap-2 font-serif text-xl font-bold text-foreground md:text-2xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="text-2xl md:text-3xl"
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.name}
              </motion.a>
            ))}
          </div>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => setIsOpen(true)}
              className="relative cursor-pointer rounded-full bg-primary p-2 text-primary-foreground transition-colors hover:bg-primary/90"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={cartCount > 0 ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
              transition={{ duration: 0.5, repeat: cartCount > 0 ? Number.POSITIVE_INFINITY : 0, repeatDelay: 3 }}
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
                    <motion.span>
                      {cartCount}
                    </motion.span>
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
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
            className="fixed inset-0 top-16 z-40 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col items-center gap-8 px-6 py-4">
              {navLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="cursor-pointer font-serif text-3xl font-bold text-foreground transition-colors hover:text-primary"
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
