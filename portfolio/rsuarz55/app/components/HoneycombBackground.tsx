"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface HoneycombBackgroundProps {
  className?: string
  color?: string
  darkColor?: string
  opacity?: number
}

export default function HoneycombBackground({
  className = "",
  color = "#ef4444",
  darkColor = "#dc2626",
  opacity = 0.05,
}: HoneycombBackgroundProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currentColor, setCurrentColor] = useState(color)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      setCurrentColor(theme === "dark" ? darkColor : color)
    }
  }, [theme, mounted, color, darkColor])

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden pointer-events-none ${className}`}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
        <defs>
          <pattern
            id="honeycomb-pattern"
            width="56"
            height="100"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(2) rotate(0)"
          >
            <path
              d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66Z M28 33L56 16L56 50L28 66L0 50L0 16L28 33Z"
              fill="none"
              stroke={currentColor}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#honeycomb-pattern)" />
      </svg>
    </div>
  )
}

