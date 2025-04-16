"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, FlameIcon as Fire } from "lucide-react"
import Image from "next/image"

interface Shake {
  id: string
  name: string
  description: string
  image: string
  price: number
  color: string
  isVIP?: boolean
}

interface BestsellerCarouselProps {
  shakes: Shake[]
  onSelectShake: (shake: Shake) => void
  selectedShake: Shake | null
}

export default function BestsellerCarousel({ shakes, onSelectShake, selectedShake }: BestsellerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(4)
  const containerRef = useRef<HTMLDivElement>(null)

  // Update visible count based on container width
  useEffect(() => {
    const updateVisibleCount = () => {
      if (!containerRef.current) return
      const width = containerRef.current.offsetWidth
      if (width < 640) setVisibleCount(2)
      else if (width < 1024) setVisibleCount(3)
      else setVisibleCount(4)
    }

    updateVisibleCount()
    window.addEventListener("resize", updateVisibleCount)
    return () => window.removeEventListener("resize", updateVisibleCount)
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, shakes.length - visibleCount + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, shakes.length - visibleCount) : prev - 1))
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-4"
          initial={false}
          animate={{ x: `-${currentIndex * (100 / visibleCount)}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {shakes.map((shake) => (
            <motion.div
              key={shake.id}
              className={`flex-none w-1/2 sm:w-1/3 lg:w-1/4`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Card
                className={`overflow-hidden cursor-pointer transition-all ${
                  selectedShake?.id === shake.id ? "ring-4 ring-pink-500" : ""
                }`}
                onClick={() => onSelectShake(shake)}
              >
                <div className={`h-40 ${shake.color} relative`}>
                  {shake.isVIP && (
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-orange-500 z-10">
                      <Fire className="h-3 w-3 mr-1" /> VIP
                    </Badge>
                  )}
                  <Image
                    src={shake.image || "/placeholder.svg"}
                    alt={shake.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg font-sans">{shake.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 h-10 mb-2">{shake.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold">₱{shake.price.toFixed(2)}</p>
                    <Badge variant="outline" className="text-xs">
                      Mark's Creation
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {shakes.length > visibleCount && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 rounded-full bg-white dark:bg-gray-800 shadow-md"
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 rounded-full bg-white dark:bg-gray-800 shadow-md"
            onClick={nextSlide}
            disabled={currentIndex >= shakes.length - visibleCount}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}
    </div>
  )
}
