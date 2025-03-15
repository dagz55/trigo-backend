"use client"

import { motion } from "framer-motion"
import { Award, CheckCircle } from "lucide-react"
import HoneycombBackground from "./HoneycombBackground"
import AnimatedSectionHeader from "./AnimatedSectionHeader"

export default function Badges() {
  const certifications = [
    {
      name: "Google Cloud Professional Cloud Architect",
      image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
      issuer: "Google Cloud",
      date: "2023",
      color: "from-blue-500 to-green-500",
    },
    {
      name: "Google Cloud Associate Cloud Engineer",
      image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
      issuer: "Google Cloud",
      date: "2022",
      color: "from-blue-400 to-green-400",
    },
    {
      name: "Microsoft Certified: Azure Solutions Architect Expert",
      image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
      issuer: "Microsoft",
      date: "2023",
      color: "from-blue-600 to-indigo-600",
    },
    {
      name: "Microsoft Certified: DevOps Engineer Expert",
      image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
      issuer: "Microsoft",
      date: "2022",
      color: "from-blue-500 to-indigo-500",
    },
    {
      name: "AWS Certified Solutions Architect",
      image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
      issuer: "Amazon Web Services",
      date: "2021",
      color: "from-orange-500 to-yellow-500",
    },
    {
      name: "Red Hat Certified Engineer (RHCE)",
      image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redhat/redhat-original.svg",
      issuer: "Red Hat",
      date: "2020",
      color: "from-red-600 to-red-500",
    },
  ]

  return (
    <section id="badges" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
      <HoneycombBackground opacity={0.06} />

      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSectionHeader title="Certifications & Badges" />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
        >
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className={`h-3 bg-gradient-to-r ${cert.color}`}></div>
              <div className="p-6 flex items-center">
                <div className="flex-shrink-0 mr-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-3">
                    <img
                      src={cert.image || "/placeholder.svg"}
                      alt={cert.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{cert.name}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-300">
                    <Award className="w-4 h-4 mr-1" />
                    <span>{cert.issuer}</span>
                    <span className="mx-2">•</span>
                    <span>{cert.date}</span>
                  </div>
                  <div className="mt-2 flex items-center text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-xs">Verified</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

