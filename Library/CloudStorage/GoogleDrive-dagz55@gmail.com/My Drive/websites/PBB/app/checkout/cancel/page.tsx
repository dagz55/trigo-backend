"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

export default function CheckoutCancel() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-8 max-w-md w-full text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <XCircle className="h-12 w-12 text-red-500" />
        </motion.div>

        <h1 className="text-2xl font-bold mb-4">Payment Cancelled</h1>
        <p className="text-muted-foreground mb-6">
          Your payment was cancelled. No worries, your cart items are still saved!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Home
          </Button>
          <Button
            onClick={() => router.push("/#bestsellers")}
            className="bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-white font-bold"
          >
            Try Again
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
