"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

const floatingFruits = [
  { emoji: "🍊", x: "10%", y: "20%", delay: 0 },
  { emoji: "🍋", x: "85%", y: "15%", delay: 0.5 },
  { emoji: "🥝", x: "15%", y: "70%", delay: 1 },
  { emoji: "🍓", x: "80%", y: "65%", delay: 1.5 },
  { emoji: "🥭", x: "50%", y: "10%", delay: 2 },
  { emoji: "🍍", x: "90%", y: "40%", delay: 0.8 },
  { emoji: "🫐", x: "5%", y: "45%", delay: 1.2 },
]

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 px-6"
    >
      {/* Floating Fruits (Parallax) */}
      {floatingFruits.map((fruit, index) => (
        <motion.div
          key={index}
          className="emoji-shadow pointer-events-none absolute text-4xl md:text-6xl will-change-transform"
          style={{ left: fruit.x, top: fruit.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 0.6,
            scale: 1,
            y: [0, -20, 0],
          }}
          transition={{
            opacity: { duration: 0.5, delay: fruit.delay },
            scale: { duration: 0.5, delay: fruit.delay },
            y: {
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: fruit.delay,
              repeatType: "mirror",
            },
          }}
        >
          {fruit.emoji}
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <motion.h1
            className="font-serif text-5xl font-bold text-foreground md:text-7xl lg:text-8xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-primary">Vive</span> Fresh
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-foreground/70 md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Descubre los smoothies más frescos y deliciosos de Costa Rica. Ingredientes naturales, sabores tropicales y
            energía pura.
          </motion.p>

          <motion.a
            href="#menu"
            className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/80 hover:shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Ver Menú</span>
            <span className="text-xl">🍹</span>
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.a
        href="#manosas"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer text-foreground/50"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        aria-label="Scroll down"
      >
        <ChevronDown className="h-8 w-8" />
      </motion.a>
    </section>
  )
}
