"use client"

import Image from "next/image"
import { Github, Linkedin, Mail, ArrowDown, Terminal, Server, Cloud, Cpu } from "lucide-react"
import { motion } from "framer-motion"
import HoneycombBackground from "./HoneycombBackground"

const FloatingIcon = ({
  icon: Icon,
  delay,
  x,
  y,
  color,
}: { icon: any; delay: number; x: number; y: number; color: string }) => (
  <motion.div
    className="absolute text-primary"
    initial={{ opacity: 0, x: 0, y: 0 }}
    animate={{ opacity: 0.7, x, y }}
    transition={{
      delay,
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse",
    }}
  >
    <Icon className={`w-8 h-8 ${color}`} />
  </motion.div>
)

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300"
    >
      {/* Honeycomb Background */}
      <HoneycombBackground opacity={0.07} />

      {/* Animated Gradient */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-gray-500 to-red-600 animate-gradient-x"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingIcon icon={Terminal} delay={0} x={-20} y={-30} color="text-red-500" />
        <FloatingIcon icon={Server} delay={1.5} x={30} y={-20} color="text-gray-500" />
        <FloatingIcon icon={Cloud} delay={1} x={-10} y={20} color="text-red-400" />
        <FloatingIcon icon={Github} delay={2} x={20} y={30} color="text-gray-600" />
        <FloatingIcon icon={Cpu} delay={2.5} x={-25} y={10} color="text-blue-500" />
      </div>

      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div
            className="lg:w-1/2 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-500 dark:from-red-500 dark:to-red-400">
                Robert Suarez
              </h1>
            </motion.div>
            <motion.h2
              className="text-2xl md:text-3xl font-semibold mb-6 text-gray-700 dark:text-gray-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              DevSecOps Engineer | CI/CD Specialist | AI Solutions Architect
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Delivering premium quality infrastructure and automation solutions with over 15 years of expertise in
              system administration, CI/CD implementation, and AI-powered DevOps practices across various industries.
            </motion.p>
            <motion.div
              className="flex justify-center lg:justify-start space-x-4 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.a
                href="#"
                className="p-3 rounded-full bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 transition-colors duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                aria-label="GitHub Profile"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/robert-suarez-10yearit"
                className="p-3 rounded-full bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 transition-colors duration-300 shadow-lg hover:shadow-xl"
                aria-label="LinkedIn Profile"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </motion.a>
              <motion.a
                href="mailto:suarez_rnm@yahoo.com"
                className="p-3 rounded-full bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 transition-colors duration-300 shadow-lg hover:shadow-xl"
                aria-label="Email Contact"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </motion.a>
            </motion.div>
            <motion.button
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Learn More
              <ArrowDown className="w-4 h-4" />
            </motion.button>
          </motion.div>

          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto animate-float">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-gray-400 dark:from-red-600 dark:to-gray-600 rounded-3xl transform rotate-6 opacity-50"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-red-400 dark:from-gray-600 dark:to-red-600 rounded-3xl transform -rotate-6 opacity-50"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0812.jpg-jQSxWaycmtpBR7IUnsPV8C8L3vlrQ2.jpeg"
                  alt="Robert Suarez"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="w-1 h-12 bg-gradient-to-b from-red-600 to-red-500 dark:from-red-500 dark:to-red-400 rounded-full animate-pulse"></div>
      </motion.div>
    </section>
  )
}

