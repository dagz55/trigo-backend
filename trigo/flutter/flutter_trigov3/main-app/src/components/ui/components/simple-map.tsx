"use client"

import { useState, useEffect, useRef } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FallbackMap } from "@/components/fallback-map"

export function SimpleMap() {
  // Create a state to track when the DOM is ready
  const [domReady, setDomReady] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  // Set domReady to true after component mounts
  useEffect(() => {
    setDomReady(true)
    console.log("SimpleMap component mounted, DOM should be ready")
  }, [])

  // Initialize Google Maps only after DOM is ready
  useEffect(() => {
    // Don't proceed if DOM is not ready
    if (!domReady) {
      console.log("DOM not ready yet, waiting...")
      return
    }

    // Don't proceed if the API key is missing
    if (!apiKey) {
      console.error("API key is missing")
      setError("Google Maps API key is missing")
      setIsLoading(false)
      return
    }

    console.log("DOM is ready, checking map container ref...")
    console.log("Map container ref:", mapContainerRef.current)

    // Wait a bit to ensure the ref is attached
    const timer = setTimeout(() => {
      // Don't proceed if the map container ref is not available
      if (!mapContainerRef.current) {
        console.error("Map container ref is not available after timeout")
        setError("Map container not available")
        setIsLoading(false)
        return
      }

      let isMounted = true

      const initMap = async () => {
        try {
          console.log("Initializing simple map with container:", mapContainerRef.current)

          const loader = new Loader({
            apiKey,
            version: "weekly",
          })

          const google = await loader.load()

          // Check if component is still mounted and ref is still available
          if (!isMounted || !mapContainerRef.current) {
            console.error("Component unmounted or map container not available after Google Maps loaded")
            return
          }

          // Create a simple map
          new google.maps.Map(mapContainerRef.current, {
            center: { lat: 14.5995, lng: 120.9842 }, // Philippines
            zoom: 10,
          })

          setIsLoading(false)
        } catch (err) {
          if (!isMounted) return
          console.error("Error initializing map:", err)
          setError(`Failed to load map: ${err instanceof Error ? err.message : String(err)}`)
          setIsLoading(false)
        }
      }

      // Initialize the map
      initMap()

      // Cleanup
      return () => {
        isMounted = false
      }
    }, 500) // Short delay to ensure DOM is ready

    return () => {
      clearTimeout(timer)
    }
  }, [apiKey, domReady])

  if (isLoading) {
    return (
      <div className="h-[300px] w-full rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg text-orange-800">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <h3 className="font-medium">Map Loading Issue</h3>
        </div>
        <p className="mb-2">{error}</p>
        <Button variant="outline" className="w-full mb-4" onClick={() => window.location.reload()}>
          Retry Loading Map
        </Button>
        <FallbackMap />
      </div>
    )
  }

  return (
    <div
      ref={mapContainerRef}
      className="h-[300px] w-full rounded-lg overflow-hidden border"
      id="simple-map-container" // Adding ID for additional reference
    />
  )
}

