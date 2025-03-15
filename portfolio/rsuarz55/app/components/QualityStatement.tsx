"use client"

import { motion } from "framer-motion"
import { Award, Star, CheckCircle, Zap } from "lucide-react"

export default function QualityStatement() {
  const qualities = [
    {
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      title: "Premium Quality",
      description:
        "Every project is delivered with meticulous attention to detail and the highest standards of excellence.",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      title: "Reliable Solutions",
      description: "Dependable, robust systems that stand the test of time and evolve with your business needs.",
    },
    {
      icon: <Award className="w-8 h-8 text-red-500" />,
      title: "Expert Craftsmanship",
      description: "Leveraging 15+ years of experience to build sophisticated, enterprise-grade infrastructure.",
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-500" />,
      title: "Innovative Approach",
      description:
        "Combining traditional expertise with cutting-edge technologies like AI to solve complex challenges.",
    },
  ]

  return (
    <section id="quality" className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"></div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Premium Quality Work</h2>
          <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            I deliver exceptional results through a commitment to excellence, innovation, and attention to detail.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {qualities.map((quality, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-red-500 flex flex-col items-center text-center"
            >
              <div className="mb-4 p-3 rounded-full bg-gray-100 dark:bg-gray-700">{quality.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">{quality.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{quality.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

