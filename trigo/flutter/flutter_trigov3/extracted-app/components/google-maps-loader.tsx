"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

declare global {
  interface Window {
    googleMapsLoaded: boolean
    initGoogleMaps: () => void
  }
}

export default function GoogleMapsLoader() {
  const { toast } = useToast()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // If already loaded, do nothing
    if (window.googleMapsLoaded) {
      setIsLoaded(true)
      return
    }

    // Define callback function
    window.initGoogleMaps = () => {
      window.googleMapsLoaded = true
      setIsLoaded(true)
    }

    // Create script element
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`
    script.async = true
    script.defer = true

    // Add error handler
    script.onerror = () => {
      toast({
        title: "Google Maps Error",
        description: "Failed to load Google Maps. Please refresh the page and try again.",
        variant: "destructive",
      })
    }

    // Append to document
    document.head.appendChild(script)

    // No cleanup - we want the script to stay loaded
  }, [toast])

  return null
}

