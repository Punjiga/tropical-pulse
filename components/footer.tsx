"use client"

import { motion } from "framer-motion"
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from "lucide-react"

const navLinks = [
  { name: "Inicio", href: "#inicio" },
  { name: "Menú", href: "#menu" },
  { name: "Build Your Own", href: "#build" },
  { name: "Contacto", href: "#contacto" },
]

const socialLinks = [
  { icon: Instagram, href: "https://srstudio.vercel.app", label: "Instagram" },
  { icon: Facebook, href: "https://srstudio.vercel.app", label: "Facebook" },
  { icon: Twitter, href: "https://srstudio.vercel.app", label: "Twitter" },
]

export function Footer() {
  return (
    <footer id="contacto" className="bg-foreground px-6 py-16 text-background">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-4" id="delivery">
          {/* Brand */}
          <div className="md:col-span-2">
            <motion.a
              href="#inicio"
              className="mb-4 inline-flex cursor-pointer items-center gap-2 font-serif text-2xl font-bold"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-3xl">🌴</span>
              <span>TROPICAL PULSE</span>
            </motion.a>
            <p className="mb-6 max-w-md text-background/70">
              Los smoothies más frescos de Costa Rica. Ingredientes naturales, sabores tropicales y energía pura para tu
              día.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer rounded-full bg-background/10 p-2.5 transition-colors hover:bg-primary hover:text-primary-foreground"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-serif text-lg font-bold">Enlaces</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    className="cursor-pointer text-background/70 transition-colors hover:text-background"
                    whileHover={{ x: 4 }}
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-serif text-lg font-bold">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-background/70 transition-colors hover:text-background">
                <MapPin className="h-5 w-5 shrink-0 text-primary" />
                <span>San José, Costa Rica</span>
              </li>
              <li className="flex items-center gap-3 text-background/70 transition-colors hover:text-background">
                <Phone className="h-5 w-5 shrink-0 text-primary" />
                <span>+506 2222 2222</span>
              </li>
              <li className="flex items-center gap-3 text-background/70 transition-colors hover:text-background">
                <Mail className="h-5 w-5 shrink-0 text-primary" />
                <span>hola@tropicalpulse.cr</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-background/20 pt-8 md:flex-row">
          <p className="text-sm text-background/50">© 2026 Tropical Pulse. Todos los derechos reservados.</p>
          <motion.a
            href="https://srstudio.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="group cursor-pointer text-sm font-medium"
            whileHover={{ scale: 1.05 }}
          >
            Realizado por <span className="animated-gradient-text font-bold group-hover:underline">SR STUDIO</span>
          </motion.a>
        </div>
      </div>
    </footer>
  )
}
