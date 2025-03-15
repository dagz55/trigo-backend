"use client"

import { motion } from "framer-motion"

interface AnimatedSectionHeaderProps {
  title: string
}

export default function AnimatedSectionHeader({ title }: AnimatedSectionHeaderProps) {
  return (
    <motion.div
      className="mb-12 relative"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.h2
        className="text-4xl font-bold text-center text-gray-800 dark:text-white relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>
      <motion.div
        className="absolute left-1/2 -bottom-2 h-1 w-24 bg-red-500 transform -translate-x-1/2"
        initial={{ width: 0 }}
        whileInView={{ width: 100 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
      />
    </motion.div>
  )
}

