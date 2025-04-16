"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"

export default function CheckoutSuccess() {
  const router = useRouter()

  useEffect(() => {
    // Trigger confetti on successful checkout
    confetti({
      particleCount: 200,
      spread: 160,
      origin: { y: 0.6 },
    })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-8 max-w-md w-full text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 flex items-center justify-center mx-auto mb-6"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
        >
          <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-3xl">🥟</span>
          </div>
        </motion.div>

        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for your order. We'll prepare your delicious Filipino food and drinks right away!
        </p>

        <Button
          onClick={() => router.push("/")}
          className="bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-white font-bold"
        >
          Back to Home
        </Button>
      </motion.div>
    </div>
  )
}
