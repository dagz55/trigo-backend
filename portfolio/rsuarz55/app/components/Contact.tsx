"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, MapPin, Phone, Send, Loader2 } from "lucide-react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import HoneycombBackground from "./HoneycombBackground"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type FormData = z.infer<typeof formSchema>

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      // Here you would typically send the form data to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      setSubmitSuccess(true)
      reset()
      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.3 } },
  }

  const contactPlatforms = [
    {
      name: "Email",
      value: "dagz55@gmail.com",
      icon: <Mail className="w-6 h-6 text-red-600" />,
      link: "mailto:dagz55@gmail.com",
    },
    {
      name: "Phone",
      value: "09171841002",
      icon: <Phone className="w-6 h-6 text-red-600" />,
      link: "tel:+09171841002",
    },
    {
      name: "Telegram",
      value: "@robertsuarez",
      icon: <img src="/social-icons/telegram.png" width={24} height={24} alt="Telegram" />,
      link: "https://t.me/robertsuarez",
    },
    {
      name: "WhatsApp",
      value: "09171841002",
      icon: <img src="/social-icons/whatsapp.png" width={24} height={24} alt="WhatsApp" />,
      link: "https://wa.me/09171841002",
    },
    {
      name: "WeChat",
      value: "robertsuarez",
      icon: <img src="/social-icons/wechat.png" width={24} height={24} alt="WeChat" />,
      link: "#",
    },
    {
      name: "iMessage",
      value: "09171841002",
      icon: <img src="/social-icons/imessage.png" width={24} height={24} alt="iMessage" />,
      link: "sms:09171841002",
    },
  ]

  return (
    <section
      id="contact"
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
          Get in Touch
        </motion.h2>
        <div className="flex flex-col lg:flex-row gap-12">
          <motion.div
            className="lg:w-1/3"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border-t-4 border-red-500">
              <h3 className="text-2xl font-semibold mb-6 dark:text-white">Contact Information</h3>
              <div className="space-y-6">
                {contactPlatforms.map((platform, index) => (
                  <motion.a
                    key={index}
                    href={platform.link}
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300"
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  >
                    <div className="w-6 h-6 mr-3 flex items-center justify-center">{platform.icon}</div>
                    <div className="ml-3">
                      <div className="font-medium">{platform.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{platform.value}</div>
                    </div>
                  </motion.a>
                ))}
                <motion.div
                  className="flex items-center text-gray-600 dark:text-gray-300 mt-4"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <MapPin className="w-6 h-6 mr-3 text-red-600" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Metro Manila, Philippines</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="lg:w-2/3"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border-t-4 border-red-500"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <motion.input
                    {...register("name")}
                    type="text"
                    whileFocus="focus"
                    variants={inputVariants}
                    className={`w-full px-4 py-2 rounded-md border ${
                      errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    } focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <motion.input
                    {...register("email")}
                    type="email"
                    whileFocus="focus"
                    variants={inputVariants}
                    className={`w-full px-4 py-2 rounded-md border ${
                      errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    } focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <motion.input
                  {...register("subject")}
                  type="text"
                  whileFocus="focus"
                  variants={inputVariants}
                  className={`w-full px-4 py-2 rounded-md border ${
                    errors.subject ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white`}
                />
                {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>}
              </div>
              <div className="mt-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <motion.textarea
                  {...register("message")}
                  rows={4}
                  whileFocus="focus"
                  variants={inputVariants}
                  className={`w-full px-4 py-2 rounded-md border ${
                    errors.message ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white`}
                ></motion.textarea>
                {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
              </div>
              <div className="mt-6">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-300 flex items-center justify-center ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
                  {isSubmitting ? "Sending..." : "Send Message"}
                </motion.button>
              </div>
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md"
                >
                  Message sent successfully!
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-64 h-64 -mb-32 -mr-32 opacity-20">
        <Image src="/placeholder.svg?height=256&width=256" alt="Decorative background" width={256} height={256} />
      </div>
    </section>
  )
}

