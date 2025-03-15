"use client"

import { motion } from "framer-motion"
import { Server, Shield, GitPullRequest, Cloud, BrainCircuit, Bot } from "lucide-react"
import Image from "next/image"
import HoneycombBackground from "./HoneycombBackground"

export default function Services() {
  const services = [
    {
      icon: <GitPullRequest className="w-12 h-12 text-red-500" />,
      title: "Premium CI/CD Pipeline Implementation",
      description:
        "Design and implementation of enterprise-grade CI/CD pipelines using Jenkins, GitLab CI, and GitHub Actions for continuous integration and deployment.",
    },
    {
      icon: <Shield className="w-12 h-12 text-gray-500" />,
      title: "DevSecOps & Security Management",
      description:
        "Integration of security practices throughout the development lifecycle with robust patch management to protect critical systems.",
    },
    {
      icon: <BrainCircuit className="w-12 h-12 text-blue-500" />,
      title: "AI-Powered DevOps Solutions",
      description:
        "Implementation of AI-driven automation, monitoring, and optimization systems to enhance operational efficiency and decision-making.",
    },
    {
      icon: <Cloud className="w-12 h-12 text-gray-500" />,
      title: "Enterprise Cloud Architecture",
      description:
        "Design, implementation, and management of scalable cloud infrastructure with Infrastructure as Code practices for maximum reliability.",
    },
    {
      icon: <Bot className="w-12 h-12 text-purple-500" />,
      title: "Custom AI Agent Development",
      description:
        "Creation of specialized AI agents for automated operations, monitoring, and intelligent system management tailored to your specific needs.",
    },
    {
      icon: <Server className="w-12 h-12 text-red-500" />,
      title: "High-Quality Unix/Linux Administration",
      description:
        "Expert management of HPUX, AIX, Solaris, and RHEL servers with focus on performance, security, and reliability.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section
      id="services"
      className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 overflow-hidden relative"
    >
      <HoneycombBackground opacity={0.05} />

      <div className="container mx-auto px-6 relative z-10">
        <motion.h2
          className="text-4xl font-bold mb-12 text-center text-gray-800 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          My Services
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-red-500"
              variants={itemVariants}
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.3 },
              }}
            >
              <div className="flex items-center mb-4">
                {service.icon}
                <h3 className="text-xl font-semibold ml-4 dark:text-white">{service.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="absolute top-0 left-0 w-64 h-64 -mt-32 -ml-32 opacity-20">
        <Image src="/placeholder.svg?height=256&width=256" alt="Decorative background" width={256} height={256} />
      </div>
    </section>
  )
}

