"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronRight, ChevronLeft } from "lucide-react"
import { useCart } from "./cart-context"
import { useToast } from "@/hooks/use-toast"

const bases = [
  { id: "water", name: "Agua de Coco", emoji: "🥥", price: 500 },
  { id: "almond", name: "Leche de Almendras", emoji: "🥛", price: 600 },
  { id: "yogurt", name: "Yogurt Griego", emoji: "🥄", price: 700 },
  { id: "oat", name: "Leche de Avena", emoji: "🌾", price: 550 },
]

const fruits = [
  { id: "mango", name: "Mango", emoji: "🥭", price: 400 },
  { id: "strawberry", name: "Fresa", emoji: "🍓", price: 450 },
  { id: "banana", name: "Banano", emoji: "🍌", price: 300 },
  { id: "pineapple", name: "Piña", emoji: "🍍", price: 350 },
  { id: "blueberry", name: "Arándanos", emoji: "🫐", price: 500 },
  { id: "kiwi", name: "Kiwi", emoji: "🥝", price: 400 },
]

const addons = [
  { id: "protein", name: "Proteína Whey", emoji: "💪", price: 800 },
  { id: "spinach", name: "Espinaca", emoji: "🥬", price: 300 },
  { id: "chia", name: "Semillas de Chía", emoji: "🌱", price: 400 },
  { id: "honey", name: "Miel Natural", emoji: "🍯", price: 350 },
  { id: "peanut", name: "Mantequilla de Maní", emoji: "🥜", price: 450 },
  { id: "ginger", name: "Jengibre", emoji: "🫚", price: 250 },
]

const steps = ["Base", "Frutas", "Add-ons"]

export function BuildYourOwn() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedBase, setSelectedBase] = useState<string | null>(null)
  const [selectedFruits, setSelectedFruits] = useState<string[]>([])
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const { addItem, setIsOpen } = useCart()
  const { toast } = useToast()

  const calculatePrice = () => {
    let total = 0
    if (selectedBase) {
      total += bases.find((b) => b.id === selectedBase)?.price || 0
    }
    selectedFruits.forEach((id) => {
      total += fruits.find((f) => f.id === id)?.price || 0
    })
    selectedAddons.forEach((id) => {
      total += addons.find((a) => a.id === id)?.price || 0
    })
    return total
  }

  const toggleFruit = (id: string) => {
    setSelectedFruits((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : prev.length < 3 ? [...prev, id] : prev,
    )
  }

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]))
  }

  const handleAddToCart = () => {
    if (!selectedBase || selectedFruits.length === 0) {
      toast({ title: "¡Falta algo!", description: "Selecciona una base y al menos una fruta.", variant: "destructive" })
      return
    }

    const customName = `Custom: ${selectedFruits.map((id) => fruits.find((f) => f.id === id)?.emoji).join("")}`

    addItem({
      id: `custom-${Date.now()}`,
      name: customName,
      emoji: "🎨",
      price: calculatePrice(),
      color: "#FDB927",
    })

    toast({ title: "¡Smoothie personalizado agregado!", description: "Tu creación está en el carrito." })
    setIsOpen(true)

    // Reset
    setCurrentStep(0)
    setSelectedBase(null)
    setSelectedFruits([])
    setSelectedAddons([])
  }

  const canProceed = () => {
    if (currentStep === 0) return selectedBase !== null
    if (currentStep === 1) return selectedFruits.length > 0
    return true
  }

  return (
    <section id="build" className="bg-gradient-to-br from-primary/5 via-background to-accent/5 px-6 py-20 md:py-32">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-12 text-center"
        >
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-5xl">
            Build Your <span className="text-destructive">Own</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-foreground/70">Crea tu smoothie perfecto en 3 simples pasos.</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-10 flex items-center justify-center gap-4">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center gap-2">
              <motion.div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${index <= currentStep ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                animate={{ scale: index === currentStep ? 1.1 : 1 }}
              >
                {index < currentStep ? <Check className="h-5 w-5" /> : index + 1}
              </motion.div>
              <span
                className={`hidden font-medium sm:inline ${index <= currentStep ? "text-foreground" : "text-muted-foreground"}`}
              >
                {step}
              </span>
              {index < steps.length - 1 && <div className="h-0.5 w-8 bg-border" />}
            </div>
          ))}
        </div>

        {/* Price Display */}
        <motion.div
          className="mb-8 text-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.3 }}
          key={calculatePrice()}
        >
          <span className="text-lg text-foreground/70">Total: </span>
          <span className="font-serif text-3xl font-bold text-primary">₡{calculatePrice().toLocaleString()}</span>
        </motion.div>

        {/* Step Content */}
        <motion.div
          layout
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="mb-8 min-h-[300px] rounded-2xl bg-card p-6 shadow-lg overflow-hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            {currentStep === 0 && (
              <motion.div
                key="base"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="mb-6 text-center font-serif text-xl font-bold text-card-foreground">Elige tu Base</h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {bases.map((base) => (
                    <motion.button
                      key={base.id}
                      onClick={() => setSelectedBase(base.id)}
                      className={`cursor-pointer rounded-xl p-4 text-center transition-all ${selectedBase === base.id
                        ? "bg-primary/20 ring-2 ring-primary"
                        : "bg-secondary hover:bg-secondary/80"
                        }`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="emoji-shadow mb-2 block text-4xl">{base.emoji}</span>
                      <span className="block text-sm font-medium text-card-foreground">{base.name}</span>
                      <span className="text-xs text-muted-foreground">₡{base.price}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="fruits"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="mb-2 text-center font-serif text-xl font-bold text-card-foreground">Elige tus Frutas</h3>
                <p className="mb-6 text-center text-sm text-muted-foreground">Máximo 3 frutas</p>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {fruits.map((fruit) => {
                    const isSelected = selectedFruits.includes(fruit.id);
                    const isMaxReached = selectedFruits.length >= 3;
                    const isDisabled = !isSelected && isMaxReached;

                    return (
                      <motion.button
                        key={fruit.id}
                        onClick={() => !isDisabled && toggleFruit(fruit.id)}
                        disabled={isDisabled}
                        className={`cursor-pointer rounded-xl p-4 text-center transition-all ${isSelected
                          ? "bg-accent/20 ring-2 ring-accent"
                          : isDisabled
                            ? "bg-secondary/30 opacity-40 grayscale cursor-not-allowed scale-95"
                            : "bg-secondary hover:bg-secondary/80"
                          }`}
                        whileHover={!isDisabled ? { scale: 1.03 } : {}}
                        whileTap={!isDisabled ? { scale: 0.97 } : {}}
                      >
                        <span className="emoji-shadow mb-2 block text-4xl">{fruit.emoji}</span>
                        <span className="block text-sm font-medium text-card-foreground">{fruit.name}</span>
                        <span className="text-xs text-muted-foreground">₡{fruit.price}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="addons"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="mb-2 text-center font-serif text-xl font-bold text-card-foreground">Agrega Extras</h3>
                <p className="mb-6 text-center text-sm text-muted-foreground">Opcional - mejora tu smoothie</p>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {addons.map((addon) => (
                    <motion.button
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`cursor-pointer rounded-xl p-4 text-center transition-all ${selectedAddons.includes(addon.id)
                        ? "bg-destructive/20 ring-2 ring-destructive"
                        : "bg-secondary hover:bg-secondary/80"
                        }`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="emoji-shadow mb-2 block text-4xl">{addon.emoji}</span>
                      <span className="block text-sm font-medium text-card-foreground">{addon.name}</span>
                      <span className="text-xs text-muted-foreground">₡{addon.price}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <motion.button
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            className={`flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 font-semibold transition-all ${currentStep === 0
              ? "cursor-not-allowed bg-secondary/50 text-muted-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            disabled={currentStep === 0}
            whileHover={currentStep > 0 ? { scale: 1.05 } : {}}
            whileTap={currentStep > 0 ? { scale: 0.95 } : {}}
          >
            <ChevronLeft className="h-5 w-5" />
            Anterior
          </motion.button>

          {currentStep < 2 ? (
            <motion.button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className={`flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 font-semibold transition-all ${canProceed()
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "cursor-not-allowed bg-primary/50 text-primary-foreground/50"
                }`}
              disabled={!canProceed()}
              whileHover={canProceed() ? { scale: 1.05 } : {}}
              whileTap={canProceed() ? { scale: 0.95 } : {}}
            >
              Siguiente
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          ) : (
            <motion.button
              onClick={handleAddToCart}
              className="flex cursor-pointer items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground transition-all hover:bg-accent/90"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Agregar al Carrito 🎉
            </motion.button>
          )}
        </div>
      </div>
    </section>
  )
}
