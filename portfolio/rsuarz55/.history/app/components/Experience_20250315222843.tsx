"use client"

import { motion } from "framer-motion"
import { Briefcase, Calendar, Globe, MapPin } from "lucide-react"
import Image from "next/image"
import AnimatedSectionHeader from "./AnimatedSectionHeader"
import HoneycombBackground from "./HoneycombBackground"

export default function Experience() {
  const experiences = [
    {
      company: "Philtech Inc.",
      logo: "/public/", // Temporary placeholder until Philtech logo is fixed
      location: "Philippines",
      period: "September 2022 - Present",
      role: "Lead DevSecOps Engineer & AI Solutions Architect",
      responsibilities: [
        "Implementing and maintaining premium quality CI/CD pipelines using Jenkins and GitLab CI",
        "Integrating AI-powered automation systems to enhance operational efficiency",
        "Developing custom AI agents for system monitoring and management",
        "Implementing system security measures and patch management",
        "Integrating security practices throughout the development lifecycle (DevSecOps)",
        "Delivering high-quality infrastructure solutions for enterprise clients",
      ],
    },
    {
      company: "Ben Edictio Corp.",
      logo: "/placeholder-logo.svg", // Temporary placeholder until Ben Edictio logo is fixed
      location: "Makati, National Capital Region, Philippines",
      period: "August 2021 - August 2022",
      role: "Unix System Engineer & DevOps Specialist",
      responsibilities: [
        "Served as Systems Administrator for HPUX, AIX, Solaris, RHEL servers",
        "Implemented CI/CD workflows for application deployment",
        "Explored AI-driven automation opportunities for routine tasks",
        "Handled escalations for Root Cause Analysis and Problem Management",
        "Implemented patch management and automation using Ansible",
        "Delivered consistently high-quality solutions for critical infrastructure",
      ],
    },
    {
      company: "Hewlett Packard Enterprise",
      logo: "/company-logos/hp.png", // HPE logo
      location: "Philippines",
      period: "February 2016 - January 2018",
      role: "L3 Systems Engineer",
      responsibilities: [
        "Provided advanced technical support for enterprise systems",
        "Implemented automation solutions for deployment and configuration",
        "Resolved complex system issues requiring in-depth knowledge",
        "Implemented and maintained HP enterprise server solutions",
        "Collaborated with global teams for problem resolution",
        "Maintained premium quality standards for all enterprise deployments",
      ],
    },
    {
      company: "Previous Roles",
      logo: "/company-logos/previous-roles.svg", // Previous roles logo
      location: "Philippines",
      period: "2006 - 2016",
      role: "Various System Administration Positions",
      previousCompanies: [
        {
          name: "The Philippine Stock Exchange",
          role: "System Administrator",
          period: "2015-2016",
          logo: "/company-logos/pse.png", // PSE logo
        },
        {
          name: "DANATEQ",
          role: "L2 Lead Systems Engineer",
          period: "2013-2014",
          logo: "/company-logos/danateq.svg", // DANATEQ logo
        },
        {
          name: "Globe Telecom",
          role: "Systems Administrator",
          period: "2009-2012",
          logo: "/company-logos/globe.png", // Globe Telecom logo
        },
        {
          name: "Microbase",
          role: "Systems Administrator",
          period: "2008-2009",
          logo: "/company-logos/microbase.png", // Microbase logo
        },
        {
          name: "Information Professionals, Inc.",
          role: "Desktop Support Engineer",
          period: "2007-2008",
          logo: "/company-logos/ipi.png", // Information Professionals logo
        },
        {
          name: "Expercs Inc.",
          role: "System and Network Administrator",
          period: "2006-2007",
          logo: "/company-logos/expercs.svg", // Expercs Inc. logo
        },
      ],
      responsibilities: [
        "The Philippine Stock Exchange (System Administrator, 2015-2016)",
        "DANATEQ (L2 Lead Systems Engineer, 2013-2014)",
        "Globe Telecom (Systems Administrator, 2009-2012)",
        "Microbase (Systems Administrator, 2008-2009)",
        "Information Professionals, Inc. (Desktop Support Engineer, 2007-2008)",
        "Expercs Inc. (System and Network Administrator, 2006-2007)",
      ],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section
      id="experience"
      className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 overflow-hidden relative"
    >
      <HoneycombBackground opacity={0.05} />

      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSectionHeader title="Professional Experience" />
        <motion.div
          className="space-y-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl relative overflow-hidden group"
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 bg-red-200 dark:bg-red-700 rounded-bl-full z-0 opacity-50 
                transition-transform duration-300 group-hover:scale-110"
              ></div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 relative mr-4 bg-white dark:bg-gray-700 rounded-lg p-2 shadow-md flex items-center justify-center">
                    <img
                      src={exp.logo || "/placeholder.svg?height=60&width=60"}
                      alt={exp.company}
                      className="w-12 h-12 object-contain max-w-full max-h-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold dark:text-white flex items-center">
                      {exp.company === "Freelance" ? <Globe className="w-6 h-6 mr-2 text-red-500" /> : null}
                      {exp.company}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {exp.location}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {exp.period}
                </p>
                <p className="text-xl font-medium mb-4 dark:text-gray-200 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  {exp.role}
                </p>
                {exp.previousCompanies ? (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-3 dark:text-gray-200">Previous Companies:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {exp.previousCompanies.map((prevCompany, idx) => (
                        <div key={idx} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg flex items-center">
                          <div className="w-10 h-10 relative mr-3 bg-white dark:bg-gray-600 rounded p-1 flex-shrink-0 flex items-center justify-center">
                            <img
                              src={prevCompany.logo || "/placeholder.svg?height=40&width=40"}
                              alt={prevCompany.name}
                              className="w-8 h-8 object-contain max-w-full max-h-full"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium dark:text-white">{prevCompany.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {prevCompany.role}, {prevCompany.period}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <ul className="list-none space-y-2">
                    {exp.responsibilities.map((resp, idx) => (
                      <li key={idx} className="text-gray-700 dark:text-gray-300 flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        {resp}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="absolute bottom-0 right-0 w-64 h-64 -mb-32 -mr-32 opacity-20">
        <Image src="/placeholder.svg?height=256&width=256" alt="Decorative background" width={256} height={256} />
      </div>
    </section>
  )
}
