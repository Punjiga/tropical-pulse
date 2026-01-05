"use client"

import { motion } from "framer-motion"
import { useCart } from "./cart-context"
import { useToast } from "@/hooks/use-toast"

const manosas = [
  {
    id: "green-goddess",
    name: "Green Goddess",
    emoji: "🥬",
    description: "Espinaca, manzana verde, pepino y jengibre. El detox perfecto.",
    price: 4500,
    color: "#4CAF50",
    category: "Detox",
  },
  {
    id: "purple-power",
    name: "Purple Power",
    emoji: "🍇",
    description: "Uvas, arándanos, açaí y leche de almendras. Antioxidantes al máximo.",
    price: 5200,
    color: "#9C27B0",
    category: "Energía",
  },
  {
    id: "tropical-thunder",
    name: "Tropical Thunder",
    emoji: "⚡",
    description: "Mango, maracuyá, naranja y cúrcuma. Explosión de energía tropical.",
    price: 4800,
    color: "#FF6B35",
    category: "Energía",
  },
]

export function ManosasSection() {
  const { addItem, setIsOpen } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (item: (typeof manosas)[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      emoji: item.emoji,
      price: item.price,
      color: item.color,
    })

    toast({
      description: (
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-xl shadow-sm"
            style={{ backgroundColor: `${item.color}20`, color: item.color }}
          >
            {item.emoji}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base">¡Agregado con éxito!</span>
            <span className="text-sm text-foreground/80">{item.name} está en tu carrito.</span>
          </div>
        </div>
      ),
      duration: 3000,
      className: "border-l-4",
      style: { borderLeftColor: item.color }
    })
  }

  return (
    <section id="manosas" className="bg-secondary/30 px-6 py-20 md:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-12 text-center md:mb-16"
        >
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-5xl">
            Las <span className="text-primary">Mañosas</span> del Mes
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-foreground/70">
            Nuestras creaciones premium más populares. Sabores únicos que te transportarán al paraíso tropical.
          </p>
        </motion.div>

        <div className="grid gap-12 md:grid-cols-3">
          {manosas.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.15 }}
              style={{ "--glow-color": `${item.color}60` } as React.CSSProperties}
              className="neon-glow rounded-2xl bg-card shadow-lg transition-all"
            >
              {/* Card Header with Emoji - Moved overflow-hidden here */}
              <div
                className="relative flex h-48 items-center justify-center overflow-hidden rounded-t-2xl"
                style={{ background: `linear-gradient(135deg, ${item.color}20, ${item.color}40)` }}
              >
                <motion.span
                  className="emoji-shadow text-8xl"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.emoji}
                </motion.span>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-card-foreground">{item.name}</h3>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold text-accent-foreground"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.category}
                  </span>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl font-bold" style={{ color: item.color }}>
                    ₡{item.price.toLocaleString()}
                  </span>
                  <motion.button
                    onClick={() => handleAddToCart(item)}
                    className="btn-refreshing relative overflow-hidden cursor-pointer rounded-full border-2 px-6 py-2 font-semibold transition-all"
                    style={{
                      "--fill-color": item.color,
                      "--hover-text": "white",
                      borderColor: item.color,
                      color: item.color
                    } as React.CSSProperties}
                  >
                    Agregar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
