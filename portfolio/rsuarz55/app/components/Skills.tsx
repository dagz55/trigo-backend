"use client"

import { motion } from "framer-motion"
import {
  Code,
  Terminal,
  Shield,
  HardDrive,
  GitPullRequest,
  Cpu,
  Cloud,
  Bot,
  BrainCircuit,
  Sparkles,
} from "lucide-react"
import AnimatedSectionHeader from "./AnimatedSectionHeader"
import HoneycombBackground from "./HoneycombBackground"

const SkillIcon = ({ icon: Icon, color }: { icon: any; color: string }) => (
  <div className={`p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg`}>
    <Icon className={`w-6 h-6 ${color}`} />
  </div>
)

const skills = [
  {
    icon: Terminal,
    name: "Unix/Linux Administration",
    tech: "HPUX, AIX, Solaris, RHEL",
    description:
      "Expert in managing and maintaining various Unix and Linux operating systems with focus on performance and security.",
    color: "text-red-500",
  },
  {
    icon: GitPullRequest,
    name: "CI/CD Pipeline Implementation",
    tech: "Jenkins, GitLab CI, GitHub Actions",
    description: "Building and maintaining automated CI/CD pipelines for continuous integration and deployment.",
    color: "text-gray-500",
  },
  {
    icon: Shield,
    name: "DevSecOps",
    tech: "Security Integration, Compliance",
    description:
      "Implementing security practices throughout the development lifecycle to ensure secure and compliant systems.",
    color: "text-red-500",
  },
  {
    icon: BrainCircuit,
    name: "AI Systems Integration",
    tech: "LLMs, ML Ops, AI Agents",
    description:
      "Integrating AI capabilities into existing systems and workflows to enhance automation and decision-making.",
    color: "text-blue-500",
  },
  {
    icon: Code,
    name: "Scripting & Automation",
    tech: "Shell Scripting, Ansible, Python",
    description: "Creating scripts and automation workflows to streamline system administration tasks.",
    color: "text-red-500",
  },
  {
    icon: Bot,
    name: "AI Agent Development",
    tech: "LangChain, Vector DBs, RAG",
    description:
      "Building specialized AI agents for automated operations, monitoring, and intelligent system management.",
    color: "text-purple-500",
  },
  {
    icon: Cloud,
    name: "Cloud Infrastructure",
    tech: "AWS, Azure, GCP",
    description: "Designing and managing cloud-based infrastructure for scalable and resilient applications.",
    color: "text-red-500",
  },
  {
    icon: HardDrive,
    name: "Storage Management",
    tech: "File Systems, Backup Solutions",
    description: "Configuring and maintaining storage systems and implementing reliable backup strategies.",
    color: "text-gray-500",
  },
  {
    icon: Sparkles,
    name: "Prompt Engineering",
    tech: "LLM Optimization, AI Workflows",
    description:
      "Crafting effective prompts and workflows to maximize the utility of AI systems in operational contexts.",
    color: "text-yellow-500",
  },
  {
    icon: Cpu,
    name: "Infrastructure as Code",
    tech: "Terraform, CloudFormation",
    description: "Managing infrastructure through code for consistent and repeatable deployments.",
    color: "text-gray-500",
  },
]

export default function Skills() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="skills" className="py-20 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>

      <HoneycombBackground opacity={0.06} />

      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSectionHeader title="Skills & Expertise" />
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {skills.map((skill, index) => (
            <motion.div key={index} variants={itemVariants} whileHover={{ y: -10, transition: { duration: 0.3 } }}>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group border-t-4 border-red-500">
                <div className="flex items-center mb-4">
                  <SkillIcon icon={skill.icon} color={skill.color} />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                      {skill.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{skill.tech}</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{skill.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

