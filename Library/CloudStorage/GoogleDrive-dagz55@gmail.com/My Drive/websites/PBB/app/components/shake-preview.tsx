"use client"

import { motion } from "framer-motion"

type AddOn = "Pearls" | "Jelly" | "Chia Seeds" | "Protein Shot" | "Whipped Cream"

interface ShakePreviewProps {
  shake: {
    color: string
    isVIP?: boolean
  }
  sugarLevel: number
  waterLevel: number
  iceLevel: number
  addOns: AddOn[]
  isVIP: boolean
  playingMusic: boolean
}

export default function ShakePreview({
  shake,
  sugarLevel,
  waterLevel,
  iceLevel,
  addOns,
  isVIP,
  playingMusic,
}: ShakePreviewProps) {
  return (
    <motion.div
      className={`w-40 h-64 rounded-3xl ${shake.color} relative overflow-hidden`}
      style={{
        opacity: sugarLevel / 100,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      }}
      animate={
        isVIP && playingMusic
          ? {
              rotate: [0, 1, 0, -1, 0],
              scale: [1, 1.02, 1, 1.02, 1],
            }
          : {}
      }
      transition={{
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
      }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Water level visualization */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-sky-200/50"
        initial={{ height: 0 }}
        animate={{ height: `${waterLevel}%` }}
        transition={{ duration: 0.5 }}
      ></motion.div>

      {/* Ice visualization */}
      {iceLevel > 0 && (
        <div className="absolute top-2 left-2 right-2">
          <div className="flex gap-1 justify-center">
            {Array.from({ length: Math.ceil(iceLevel / 25) }).map((_, i) => (
              <motion.div
                key={i}
                className="w-4 h-4 rounded-full bg-white/70"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              ></motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Add-ons visualization */}
      {addOns.includes("Pearls") && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <div className="flex gap-1 flex-wrap justify-center max-w-[80%]">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-amber-900"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              ></motion.div>
            ))}
          </div>
        </div>
      )}

      {addOns.includes("Whipped Cream") && (
        <motion.div
          className="absolute -top-2 left-0 right-0 h-6 bg-white rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        ></motion.div>
      )}

      {/* VIP glow effect */}
      {isVIP && playingMusic && (
        <motion.div
          className="absolute inset-0 bg-yellow-400/20 rounded-3xl"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        ></motion.div>
      )}

      {/* Straw */}
      <div className="absolute top-0 right-8 w-2 h-16 bg-pink-300 rounded-b-full"></div>
    </motion.div>
  )
}
