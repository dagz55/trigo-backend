"use client"

import { motion } from "framer-motion"
import { Code, Terminal, GitBranch, Cloud, Database, Server } from "lucide-react"
import HoneycombBackground from "./HoneycombBackground"
import AnimatedSectionHeader from "./AnimatedSectionHeader"

export default function Tools() {
  const toolCategories = [
    {
      name: "Development Environments & Languages",
      icon: <Code className="w-6 h-6 text-blue-500" />,
      tools: [
        { name: "VS Code", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
        {
          name: "JavaScript",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
        },
        { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
        { name: "Java", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
      ],
    },
    {
      name: "Frameworks & Libraries",
      icon: <Terminal className="w-6 h-6 text-green-500" />,
      tools: [
        {
          name: "Angular",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
        },
        { name: "Django", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
        { name: "Jest", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg" },
        { name: "Perl", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/perl/perl-original.svg" },
      ],
    },
    {
      name: "CI/CD & DevOps",
      icon: <GitBranch className="w-6 h-6 text-red-500" />,
      tools: [
        { name: "Jenkins", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg" },
        { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
        { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
        {
          name: "Kubernetes",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
        },
      ],
    },
    {
      name: "Cloud Platforms",
      icon: <Cloud className="w-6 h-6 text-purple-500" />,
      tools: [
        {
          name: "AWS",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
        },
        {
          name: "Google Cloud",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
        },
        { name: "Azure", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" },
        {
          name: "Digital Ocean",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/digitalocean/digitalocean-original.svg",
        },
      ],
    },
    {
      name: "Databases",
      icon: <Database className="w-6 h-6 text-yellow-500" />,
      tools: [
        {
          name: "PostgreSQL",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
        },
        { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
        { name: "Redis", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
        { name: "MySQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
      ],
    },
    {
      name: "Terminal & Shell",
      icon: <Server className="w-6 h-6 text-blue-500" />,
      tools: [
        { name: "Bash", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg" },
        { name: "Vim", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vim/vim-original.svg" },
        { name: "Linux", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
        { name: "SSH", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ssh/ssh-original.svg" },
      ],
    },
  ]

  return (
    <section id="tools" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"></div>
      <HoneycombBackground opacity={0.05} />

      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSectionHeader title="Tools & Technologies" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {toolCategories.map((category, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {category.icon}
                  <h3 className="text-xl font-semibold ml-2 text-gray-800 dark:text-white">{category.name}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {category.tools.map((tool, toolIndex) => (
                    <motion.div
                      key={toolIndex}
                      className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    >
                      <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-600 rounded-md mr-3 p-1.5">
                        <img
                          src={tool.logo || "/placeholder.svg"}
                          alt={`${tool.name} logo`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tool.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

