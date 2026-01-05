"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, Check, Loader2, CreditCard, Banknote, Smartphone, AlertCircle } from "lucide-react"
import confetti from "canvas-confetti"

interface CheckoutFormProps {
  onBack: () => void
  onSuccess: () => void
  total: number // This is the subtotal
}

type Step = "info" | "payment" | "confirmation"

export function CheckoutForm({ onBack, onSuccess, total }: CheckoutFormProps) {
  const [step, setStep] = useState<Step>("info")
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Shipping logic
  const shippingCost = total >= 10000 ? 0 : 2000
  const grandTotal = total + shippingCost

  // Cash payment state
  const [cashOption, setCashOption] = useState<"exact" | "change">("exact")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [changeAmount, setChangeAmount] = useState(0)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  })

  useEffect(() => {
    if (cashOption === "change" && paymentAmount) {
      const amount = Number.parseFloat(paymentAmount)
      if (!isNaN(amount) && amount >= grandTotal) {
        setChangeAmount(amount - grandTotal)
      } else {
        setChangeAmount(0)
      }
    }
  }, [paymentAmount, grandTotal, cashOption])

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

  const validatePayment = () => {
    if (paymentMethod === "card") {
      const newErrors: Record<string, string> = {}
      if (!formData.cardNumber.trim()) newErrors.cardNumber = "Requerido"
      if (!formData.cardExpiry.trim()) newErrors.cardExpiry = "Requerido"
      if (!formData.cardCvv.trim()) newErrors.cardCvv = "Requerido"
      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }
    if (paymentMethod === "cash" && cashOption === "change") {
      const amount = Number.parseFloat(paymentAmount)
      if (isNaN(amount) || amount < grandTotal) {
        setErrors({ paymentAmount: "El monto debe ser mayor o igual al total" })
        return false
      }
    }
    return true
  }

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateInfo()) {
      setStep("payment")
    }
  }

  const handlePaymentSubmit = async () => {
    if (!validatePayment()) return

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

            <div className="space-y-4">
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
            </div>

            {/* Shipping Summary for Info Step */}
            <div className="mt-auto border-t border-border pt-4">
              <div className="mb-2 flex justify-between text-sm text-muted-foreground">
                <span>Subtotal:</span>
                <span>₡{total.toLocaleString()}</span>
              </div>
              <div className="mb-2 flex justify-between text-sm text-muted-foreground">
                <span>Envío ({total >= 10000 ? "Gratis" : "GAM"}):</span>
                <span>{shippingCost === 0 ? "¡Gratis!" : `₡${shippingCost.toLocaleString()}`}</span>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-medium text-card-foreground">Total:</span>
                <span className="font-serif text-2xl font-bold text-primary">₡{grandTotal.toLocaleString()}</span>
              </div>

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

            <div className="mb-6 space-y-3">
              {[
                { id: "card", label: "Tarjeta", icon: CreditCard },
                { id: "sinpe", label: "SINPE Móvil", icon: Smartphone },
                { id: "cash", label: "Efectivo", icon: Banknote },
              ].map((method) => (
                <motion.div
                  key={method.id}
                  onClick={() => {
                    setPaymentMethod(method.id)
                    setErrors({})
                  }}
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

            {/* Simulated Card Form */}
            <AnimatePresence mode="popLayout">
              {paymentMethod === "card" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      maxLength={19}
                      className={`w-full rounded-lg border bg-card px-4 py-3 text-card-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${errors.cardNumber ? "border-destructive" : "border-input"
                        }`}
                      placeholder="0000 0000 0000 0000"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                        maxLength={5}
                        className={`w-full rounded-lg border bg-card px-4 py-3 text-card-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${errors.cardExpiry ? "border-destructive" : "border-input"
                          }`}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        name="cardCvv"
                        value={formData.cardCvv}
                        onChange={handleChange}
                        maxLength={4}
                        className={`w-full rounded-lg border bg-card px-4 py-3 text-card-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${errors.cardCvv ? "border-destructive" : "border-input"
                          }`}
                        placeholder="CVV"
                      />
                    </div>
                  </div>
                  {Object.keys(errors).length > 0 && <p className="text-xs text-destructive">Por favor complete los datos de la tarjeta</p>}
                </motion.div>
              )}

              {/* SINPE Info */}
              {paymentMethod === "sinpe" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-lg bg-secondary p-4 text-sm"
                >
                  <p className="mb-2 font-medium">Realiza tu SINPE Móvil al:</p>
                  <p className="mb-2 text-lg font-bold text-primary">+506 8888-8888</p>
                  <p className="text-muted-foreground">
                    A nombre de Tropical Pulse. Por favor envía el comprobante por WhatsApp al mismo número para confirmar tu
                    pedido.
                  </p>
                </motion.div>
              )}

              {/* Cash Options */}
              {paymentMethod === "cash" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setCashOption("exact")
                        setErrors({})
                      }}
                      className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${cashOption === "exact"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                    >
                      Monto Exacto
                    </button>
                    <button
                      onClick={() => setCashOption("change")}
                      className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${cashOption === "change"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                    >
                      Pagar con...
                    </button>
                  </div>

                  {cashOption === "exact" ? (
                    <div className="flex items-start gap-2 rounded-lg bg-orange-100 p-3 text-xs text-orange-800 dark:bg-orange-900/30 dark:text-orange-200">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <p>Por favor ten listo el monto exacto para entregar al repartidor.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => {
                          setPaymentAmount(e.target.value)
                          setErrors({})
                        }}
                        className={`w-full rounded-lg border bg-card px-4 py-3 text-card-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${errors.paymentAmount ? "border-destructive" : "border-input"
                          }`}
                        placeholder="¿Con cuánto vas a pagar?"
                      />
                      {errors.paymentAmount && <p className="text-xs text-destructive">{errors.paymentAmount}</p>}
                      {changeAmount > 0 && (
                        <div className="rounded-lg bg-secondary p-3 text-center">
                          <p className="text-xs text-muted-foreground">El repartidor debe darte:</p>
                          <p className="text-lg font-bold text-primary">₡{changeAmount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">de vuelto</p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-auto border-t border-border pt-4">
              <div className="mb-2 flex justify-between text-sm text-muted-foreground">
                <span>Subtotal:</span>
                <span>₡{total.toLocaleString()}</span>
              </div>
              <div className="mb-2 flex justify-between text-sm text-muted-foreground">
                <span>Envío:</span>
                <span>{shippingCost === 0 ? "¡Gratis!" : `₡${shippingCost.toLocaleString()}`}</span>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-medium text-card-foreground">Total a pagar:</span>
                <span className="font-serif text-2xl font-bold text-primary">₡{grandTotal.toLocaleString()}</span>
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
            <p className="mb-2 max-w-[250px] text-muted-foreground">
              Gracias por tu compra, {formData.name.split(" ")[0]}.
            </p>
            {/* Payment Specific Confirmation Notes */}
            {paymentMethod === "sinpe" && (
              <p className="mb-6 max-w-[280px] rounded-lg bg-blue-50 p-3 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                Recordá enviar tu comprobante SINPE al WhatsApp <strong>+506 8888-8888</strong>.
              </p>
            )}
            {paymentMethod === "cash" && cashOption === "change" && (
              <p className="mb-6 max-w-[280px] rounded-lg bg-orange-50 p-3 text-xs text-orange-700 dark:bg-orange-900/30 dark:text-orange-200">
                El repartidor llevará <strong>₡{changeAmount.toLocaleString()}</strong> de cambio.
              </p>
            )}

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
