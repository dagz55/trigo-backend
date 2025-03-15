"use client"

import { motion } from "framer-motion"
import { Terminal, Server, Shield, Cpu } from "lucide-react"
import Image from "next/image"
import HoneycombBackground from "./HoneycombBackground"

export default function About() {
  const skills = [
    {
      icon: <Terminal className="w-8 h-8 text-red-500" />,
      title: "Unix/Linux",
      description: "Linux, HPUX, AIX, Solaris, RHEL",
    },
    {
      icon: <Server className="w-8 h-8 text-gray-500" />,
      title: "Automation",
      description: "Ansible, Shell Scripting, CI/CD",
    },
    {
      icon: <Shield className="w-8 h-8 text-red-500" />,
      title: "Security",
      description: "DevSecOps, Patch Management",
    },
    {
      icon: <Cpu className="w-8 h-8 text-gray-500" />,
      title: "AI Integration",
      description: "ML Ops, AI Agents, Automation",
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 overflow-hidden relative"
    >
      <HoneycombBackground opacity={0.05} />

      <div className="container mx-auto px-6 relative z-10">
        <motion.h2
          className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          About Me
        </motion.h2>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div
            className="md:w-1/2 mb-8 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              As a seasoned DevSecOps Engineer and CI/CD Specialist, I deliver premium quality solutions by designing,
              implementing, and maintaining robust server infrastructures and automated deployment pipelines. With
              extensive experience across HPUX, AIX, Solaris, and RHEL environments, I ensure optimal system
              performance, security, and reliability.
            </p>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              My expertise includes system administration, CI/CD pipeline implementation, AI-powered automation, and
              resolving complex infrastructure challenges. I'm committed to delivering exceptional quality in every
              project, combining traditional IT expertise with cutting-edge AI technologies to create innovative
              solutions. Today I'm working on multiple high-value projects - building enterprise-grade software
              applications, maintaining high availability infrastructure, and implementing AI-driven automation systems.
            </p>
          </motion.div>
          <motion.div
            className="md:w-1/2 grid grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                variants={itemVariants}
              >
                {skill.icon}
                <h3 className="text-xl font-semibold mt-4 mb-2 dark:text-white">{skill.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{skill.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-64 h-64 -mb-32 -mr-32 opacity-20">
        <Image src="/placeholder.svg?height=256&width=256" alt="Decorative background" width={256} height={256} />
      </div>
    </section>
  )
}

