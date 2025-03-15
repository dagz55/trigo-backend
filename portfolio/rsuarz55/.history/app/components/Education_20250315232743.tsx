"use client"

import { motion } from "framer-motion"
import { Award, Calendar, GraduationCap } from "lucide-react"
import Image from "next/image"
import AnimatedSectionHeader from "./AnimatedSectionHeader"
import HoneycombBackground from "./HoneycombBackground"

export default function Education() {
  const education = [
    {
      degree: "Bachelor of Science in Information Technology",
      institution: "Mapua Institute of Technology",
      logo: "/company-logos/mapua.png",
      period: "2002 – 2006",
      achievements: [
        "Completed comprehensive IT curriculum",
        "Developed strong foundation in computer systems and networking",
        "Gained practical experience through academic projects",
        "Specialized in System Administration and Network Infrastructure",
      ],
    },
  ]

  return (
    <section
      id="education"
      className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 overflow-hidden relative"
    >
      <HoneycombBackground opacity={0.05} />

      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSectionHeader title="Education" />
        <div className="max-w-3xl mx-auto">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-red-200 dark:bg-red-700 rounded-br-full z-0 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-20 h-20 relative mr-5 bg-white dark:bg-gray-700 rounded-lg p-2 shadow-md flex items-center justify-center">
                    <img
                      src={edu.logo}
                      alt={edu.institution}
                      className="w-16 h-16 object-contain max-w-full max-h-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2 dark:text-white flex items-center">
                      <GraduationCap className="w-6 h-6 mr-2" />
                      {edu.degree}
                    </h3>
                    <p className="text-xl text-gray-600 dark:text-gray-300">{edu.institution}</p>
                    <p className="text-gray-600 dark:text-gray-300 flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      {edu.period}
                    </p>
                  </div>
                </div>
                <h4 className="text-lg font-medium mb-2 dark:text-gray-200 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Key Achievements:
                </h4>
                <ul className="list-disc list-inside space-y-2">
                  {edu.achievements.map((achievement, idx) => (
                    <li key={idx} className="text-gray-700 dark:text-gray-300">
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute top-0 left-0 w-64 h-64 -mt-32 -ml-32 opacity-20">
        <Image src="/placeholder.svg?height=256&width=256" alt="Decorative background" width={256} height={256} />
      </div>
    </section>
  )
}

