"use client"

import { useState, useEffect } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FallbackMap } from "@/components/fallback-map"

export function DirectMap() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mapInitialized, setMapInitialized] = useState(false)
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  useEffect(() => {
    if (!apiKey) {
      setError("Google Maps API key is missing")
      setIsLoading(false)
      return
    }

    // Create the map container element directly
    const mapContainer = document.createElement("div")
    mapContainer.id = "direct-map-container"
    mapContainer.style.width = "100%"
    mapContainer.style.height = "300px"
    mapContainer.className = "rounded-lg overflow-hidden border"

    // Find the parent element where we'll append our map
    const parentElement = document.getElementById("direct-map-parent")

    if (!parentElement) {
      setError("Map parent element not found")
      setIsLoading(false)
      return
    }

    // Clear any existing content and append our new container
    parentElement.innerHTML = ""
    parentElement.appendChild(mapContainer)

    console.log("Created map container:", mapContainer)

    let isMounted = true

    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey,
          version: "weekly",
        })

        const google = await loader.load()

        // Get the container again to make sure it exists
        const container = document.getElementById("direct-map-container")

        if (!container) {
          throw new Error("Map container not found after Google Maps loaded")
        }

        // Create a simple map
        new google.maps.Map(container, {
          center: { lat: 14.5995, lng: 120.9842 }, // Philippines
          zoom: 10,
        })

        if (isMounted) {
          setMapInitialized(true)
          setIsLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error initializing map:", err)
          setError(`Failed to load map: ${err instanceof Error ? err.message : String(err)}`)
          setIsLoading(false)
        }
      }
    }

    // Short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initMap()
    }, 500)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [apiKey])

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

  // This div will be replaced by our dynamically created map container
  return <div id="direct-map-parent" className="h-[300px] w-full" />
}

