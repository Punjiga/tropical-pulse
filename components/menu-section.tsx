"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "./cart-context"
import { useToast } from "@/hooks/use-toast"

const menuItems = [
  {
    id: "mango-madness",
    name: "Mango Madness",
    emoji: "🥭",
    description: "Mango fresco con yogurt griego y miel.",
    price: 3800,
    color: "#FFB347",
    category: "Energía",
  },
  {
    id: "berry-blast",
    name: "Berry Blast",
    emoji: "🍓",
    description: "Mix de fresas, frambuesas y arándanos.",
    price: 4200,
    color: "#DC143C",
    category: "Detox",
  },
  {
    id: "coco-paradise",
    name: "Coco Paradise",
    emoji: "🥥",
    description: "Agua de coco, piña y leche de coco.",
    price: 3500,
    color: "#D2691E",
    category: "Proteína",
  },
  {
    id: "pineapple-dream",
    name: "Pineapple Dream",
    emoji: "🍍",
    description: "Piña tropical con espinaca baby.",
    price: 3600,
    color: "#FFD700",
    category: "Detox",
  },
  {
    id: "strawberry-sunrise",
    name: "Strawberry Sunrise",
    emoji: "🌅",
    description: "Fresas con naranja y zanahoria.",
    price: 3900,
    color: "#FF6347",
    category: "Energía",
  },
  {
    id: "kiwi-kick",
    name: "Kiwi Kick",
    emoji: "🥝",
    description: "Kiwi con limón y menta fresca.",
    price: 3700,
    color: "#9ACD32",
    category: "Detox",
  },
  {
    id: "banana-boost",
    name: "Banana Boost",
    emoji: "🍌",
    description: "Banano con mantequilla de maní y avena.",
    price: 4000,
    color: "#FFE135",
    category: "Proteína",
  },
  {
    id: "watermelon-wave",
    name: "Watermelon Wave",
    emoji: "🍉",
    description: "Sandía refrescante con menta y limón.",
    price: 3400,
    color: "#FF6B6B",
    category: "Detox",
  },
  {
    id: "passion-punch",
    name: "Passion Punch",
    emoji: "💜",
    description: "Maracuyá con guayaba y naranja.",
    price: 4100,
    color: "#9370DB",
    category: "Energía",
  },
  {
    id: "green-goddess",
    name: "Green Goddess",
    emoji: "🥑",
    description: "Aguacate, espinaca, piña y leche de almendra.",
    price: 4500,
    color: "#4CAF50",
    category: "Detox",
  },
  {
    id: "citrus-splash",
    name: "Citrus Splash",
    emoji: "🍊",
    description: "Naranja, toronja y jengibre.",
    price: 3800,
    color: "#FFA500",
    category: "Energía",
  },
  {
    id: "choco-power",
    name: "Choco Power",
    emoji: "🍫",
    description: "Cacao, banano y proteína de chocolate.",
    price: 4300,
    color: "#8D6E63",
    category: "Proteína",
  },
  // New Drinks Requested
  {
    id: "blue-lagoon",
    name: "Blue Lagoon",
    emoji: "🫐",
    description: "Espirulina azul, piña y leche de coco.",
    price: 4400,
    color: "#00BFFF",
    category: "Detox",
  },
  {
    id: "dragon-fire",
    name: "Dragon Fire",
    emoji: "🐉",
    description: "Pitahaya rosada, fresa y limón.",
    price: 4600,
    color: "#FF1493",
    category: "Energía",
  },
  {
    id: "vanilla-sky",
    name: "Vanilla Sky",
    emoji: "🍦",
    description: "Vainilla, dátiles, almendras y canela.",
    price: 4100,
    color: "#F3E5AB",
    category: "Proteína",
  },
]

const categories = ["Todos", "Detox", "Energía", "Proteína"]

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [visibleCount, setVisibleCount] = useState(6)
  const { addItem } = useCart()
  const { toast } = useToast()
  const [isMobile, setIsMobile] = useState(false)

  // Handle Resize Safe for SSR
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      // Only set initial visible count on first load/resize if needed, 
      // but let's keep user control. Just update mobile flag.
    }

    // Initial check
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Adjust visible count when switching to mobile if it was too high/low? 
  // Actually, better to just let the button logic handle it, but initial state 6 is fine.
  // If mobile, we might want to start with 3.
  useEffect(() => {
    if (isMobile && visibleCount > 3 && visibleCount === 6) {
      setVisibleCount(3)
    }
  }, [isMobile])

  const filteredItems =
    activeCategory === "Todos" ? menuItems : menuItems.filter((item) => item.category === activeCategory)

  const visibleItems = filteredItems.slice(0, visibleCount)
  const hasMore = visibleCount < filteredItems.length
  // canCollapse logic: if mobile, show 'see less' if > 3. If desktop, if > 6.
  const canCollapse = visibleCount > (isMobile ? 3 : 6)

  const handleAddToCart = (item: (typeof menuItems)[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      emoji: item.emoji,
      price: item.price,
      color: item.color,
    })

    // Custom "Added successfully" notification
    toast({
      description: (
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-xl shadow-sm"
            style={{ backgroundColor: `${item.color}20`, color: item.color }} // 20 opacity hex
          >
            {item.emoji}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base">¡Agregado con éxito!</span>
            <span className="text-sm text-foreground/80">{item.name} está en tu carrito.</span>
          </div>
        </div>
      ),
      duration: 5000,
      className: "border-l-4",
      style: { borderLeftColor: item.color }
    })
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, filteredItems.length))
  }

  const handleShowLess = () => {
    setVisibleCount(isMobile ? 3 : 6)
    // Smooth scroll back to menu start
    const menuSection = document.getElementById("menu")
    if (menuSection) {
      window.scrollTo({
        top: menuSection.offsetTop - 100,
        behavior: "smooth"
      })
    }
  }

  return (
    <section id="menu" className="px-6 py-20 md:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-12 text-center"
        >
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-5xl">
            Menú <span className="text-accent">Completo</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-foreground/70">
            Explora nuestra variedad de smoothies frescos y deliciosos.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-8 flex flex-wrap justify-center gap-3"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => {
                setActiveCategory(category)
                setVisibleCount(isMobile ? 3 : 6)
              }}
              className={`cursor-pointer rounded-full px-5 py-2 font-medium transition-all ${activeCategory === category
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Menu Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{
                  y: -5,
                  // Neon light effect behind card matching card color
                  boxShadow: `0 0 20px ${item.color}60, 0 0 40px ${item.color}40`
                }}
                className="group cursor-pointer overflow-hidden rounded-xl bg-card shadow-md transition-shadow duration-300"
              >
                {/* Card Header */}
                <div
                  className="relative flex h-32 items-center justify-center transition-colors"
                  style={{ background: `linear-gradient(135deg, ${item.color}30, ${item.color}50)` }}
                >
                  <motion.span
                    className="emoji-shadow text-6xl"
                    whileHover={{ scale: 1.15, rotate: [-5, 5, 0] }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.emoji}
                  </motion.span>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-serif font-bold text-card-foreground">{item.name}</h3>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-medium text-accent-foreground"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.category}
                    </span>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-lg font-bold" style={{ color: item.color }}>
                      ₡{item.price.toLocaleString()}
                    </span>
                    <motion.button
                      onClick={() => handleAddToCart(item)}
                      // Added btn-refreshing class for "fill up" effect
                      className="btn-refreshing relative overflow-hidden cursor-pointer rounded-full border-2 border-primary px-4 py-1.5 text-sm font-semibold text-primary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Agregar
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load More / Show Less */}
        <div className="mt-10 flex justify-center gap-4">
          {hasMore && (
            <motion.button
              onClick={handleLoadMore}
              className="btn-refreshing cursor-pointer rounded-full border-2 border-primary bg-transparent px-6 py-3 font-semibold text-primary transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cargar Más
            </motion.button>
          )}
          {canCollapse && (
            <motion.button
              onClick={handleShowLess}
              className="cursor-pointer rounded-full bg-secondary px-6 py-3 font-semibold text-secondary-foreground transition-all hover:bg-secondary/80"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver Menos
            </motion.button>
          )}
        </div>
      </div>
    </section>
  )
}
