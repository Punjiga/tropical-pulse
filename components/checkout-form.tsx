"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, Check, Loader2, CreditCard, Banknote, Smartphone } from "lucide-react"
import confetti from "canvas-confetti"

interface CheckoutFormProps {
  onBack: () => void
  onSuccess: () => void
  total: number
}

type Step = "info" | "payment" | "confirmation"

export function CheckoutForm({ onBack, onSuccess, total }: CheckoutFormProps) {
  const [step, setStep] = useState<Step>("info")
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  })

  const validateInfo = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Nombre requerido"
    if (!formData.email.trim()) newErrors.email = "Email requerido"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email inválido"
    if (!formData.phone.trim()) newErrors.phone = "Teléfono requerido"
    if (!formData.address.trim()) newErrors.address = "Dirección requerida"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateInfo()) {
      setStep("payment")
    }
  }

  const handlePaymentSubmit = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setStep("confirmation")
    setIsLoading(false)
    fireConfetti()
  }

  const fireConfetti = () => {
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#FDB927", "#4CAF50", "#FF6B35"],
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#FDB927", "#4CAF50", "#FF6B35"],
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }

  const handleFinalize = () => {
    onSuccess()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }))
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <motion.button
          onClick={step === "info" ? onBack : () => setStep("info")}
          className="cursor-pointer rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>
        <span className="text-sm font-medium text-muted-foreground">
          Paso {step === "info" ? 1 : step === "payment" ? 2 : 3} de 3
        </span>
      </div>

      <AnimatePresence mode="wait">
        {step === "info" && (
          <motion.form
            key="info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleInfoSubmit}
            className="flex flex-1 flex-col space-y-4"
          >
            <h3 className="mb-2 font-serif text-xl font-bold text-card-foreground">Información de Entrega</h3>

            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full rounded-lg border bg-card px-4 py-3 text-card-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? "border-destructive" : "border-input"
                  }`}
                placeholder="Nombre completo"
              />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full rounded-lg border bg-card px-4 py-3 text-card-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? "border-destructive" : "border-input"
                  }`}
                placeholder="Email"
              />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>

            <div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full rounded-lg border bg-card px-4 py-3 text-card-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${errors.phone ? "border-destructive" : "border-input"
                  }`}
                placeholder="Teléfono"
              />
              {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
            </div>

            <div>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full rounded-lg border bg-card px-4 py-3 text-card-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${errors.address ? "border-destructive" : "border-input"
                  }`}
                placeholder="Dirección exacta"
              />
              {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
            </div>

            <div>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                className="w-full rounded-lg border border-input bg-card px-4 py-3 text-card-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Notas adicionales (opcional)"
              />
            </div>

            <div className="mt-auto border-t border-border pt-4">
              <motion.button
                type="submit"
                className="w-full cursor-pointer rounded-full bg-primary py-4 font-semibold text-primary-foreground transition-all hover:bg-primary/80"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continuar al Pago
              </motion.button>
            </div>
          </motion.form>
        )}

        {step === "payment" && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-1 flex-col"
          >
            <h3 className="mb-6 font-serif text-xl font-bold text-card-foreground">Método de Pago</h3>

            <div className="space-y-3">
              {[
                { id: "card", label: "Tarjeta de Crédito/Débito", icon: CreditCard },
                { id: "sinpe", label: "SINPE Móvil", icon: Smartphone },
                { id: "cash", label: "Efectivo", icon: Banknote },
              ].map((method) => (
                <motion.div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all ${paymentMethod === method.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <method.icon
                    className={`h-6 w-6 ${paymentMethod === method.id ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <span className="font-medium text-card-foreground">{method.label}</span>
                  {paymentMethod === method.id && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                      <Check className="h-5 w-5 text-primary" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-auto border-t border-border pt-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-medium text-card-foreground">Total a pagar:</span>
                <span className="font-serif text-2xl font-bold text-primary">₡{total.toLocaleString()}</span>
              </div>
              <motion.button
                onClick={handlePaymentSubmit}
                disabled={isLoading}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent py-4 font-semibold text-accent-foreground transition-all hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-70"
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  "Confirmar Pedido"
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === "confirmation" && (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-1 flex-col items-center justify-center text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600"
            >
              <Check className="h-10 w-10" />
            </motion.div>
            <h3 className="mb-2 font-serif text-2xl font-bold text-card-foreground">¡Pedido Confirmado!</h3>
            <p className="mb-8 max-w-[250px] text-muted-foreground">
              Gracias por tu compra, {formData.name.split(" ")[0]}. Prepararemos tus smoothies con amor.
            </p>
            <motion.button
              onClick={handleFinalize}
              className="w-full cursor-pointer rounded-full bg-primary py-4 font-semibold text-primary-foreground transition-all hover:bg-primary/80"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Volver al Inicio
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
