"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "./cart-context"
import { CheckoutForm } from "./checkout-form"

export function CartSidebar() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, total, clearCart } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col border-l border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl"
          >
            {/* Header */}
            <div className="border-b border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-card-foreground">
                  <ShoppingBag className="h-6 w-6" />
                  Tu Carrito
                </h2>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="cursor-pointer rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Cerrar carrito"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              {/* Shipping Progress */}
              {/* Shipping Progress */}
              <div className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-foreground/80">Meta para Envío Gratis:</span>
                  <span className="font-bold text-primary">₡10,000</span>
                </div>
                {total >= 10000 ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center justify-center gap-2 rounded-lg bg-green-100 p-2 text-center text-sm font-bold text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  >
                    <span>✨</span>
                    ¡Felicidades! Tienes envío GRATIS
                    <span>✨</span>
                  </motion.div>
                ) : (
                  <div className="text-center">
                    <p className="mb-2 text-sm text-muted-foreground">
                      Te faltan <span className="font-bold text-destructive">₡{(10000 - total).toLocaleString()}</span> para envío gratis
                    </p>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((total / 10000) * 100, 100)}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence mode="popLayout">
                {!showCheckout ? (
                  <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {items.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <span className="mb-4 text-6xl">🛒</span>
                        <p className="text-lg font-medium text-card-foreground">Tu carrito está vacío</p>
                        <p className="text-sm text-muted-foreground">¡Agrega algunos smoothies deliciosos!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {items.map((item) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            className="flex items-center gap-4 rounded-xl bg-secondary p-4"
                          >
                            <div
                              className="emoji-shadow flex h-14 w-14 items-center justify-center rounded-lg text-3xl"
                              style={{ background: `linear-gradient(135deg, ${item.color}30, ${item.color}50)` }}
                            >
                              {item.emoji}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-card-foreground">{item.name}</h4>
                              <p className="text-sm font-medium" style={{ color: item.color }}>
                                ₡{item.price.toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <motion.button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="cursor-pointer rounded-full bg-card p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                                aria-label="Reducir cantidad"
                              >
                                <Minus className="h-4 w-4" />
                              </motion.button>
                              <span className="w-6 text-center font-medium text-card-foreground">{item.quantity}</span>
                              <motion.button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="cursor-pointer rounded-full bg-card p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                                aria-label="Aumentar cantidad"
                              >
                                <Plus className="h-4 w-4" />
                              </motion.button>
                              <motion.button
                                onClick={() => removeItem(item.id)}
                                className="ml-2 cursor-pointer rounded-full p-1.5 text-destructive/70 transition-colors hover:text-destructive"
                                aria-label="Eliminar item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <CheckoutForm
                    onBack={() => setShowCheckout(false)}
                    onSuccess={() => {
                      clearCart()
                      setShowCheckout(false)
                      setIsOpen(false)
                    }}
                    total={total}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && !showCheckout && (
              <div className="border-t border-border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-lg font-medium text-card-foreground">Total:</span>
                  <span className="font-serif text-2xl font-bold text-primary">₡{total.toLocaleString()}</span>
                </div>
                <motion.button
                  onClick={() => setShowCheckout(true)}
                  className="w-full cursor-pointer rounded-full bg-primary py-4 font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90"
                >
                  Proceder al Checkout
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
