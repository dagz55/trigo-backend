"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, User, Clock, AlertTriangle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { FallbackMap } from "@/components/fallback-map"

interface Location {
  lat: number
  lng: number
}

interface PlaceInfo {
  city: string
  municipality: string
  areaCode: string
  street: string
  landmark: string
  formattedAddress: string
}

interface Driver {
  id: string
  name: string
  rating: number
  location: Location
  distance: number
  estimatedTime: number
  vehicle: string
}

export function GoogleMap() {
  // Create a state to track when the DOM is ready
  const [domReady, setDomReady] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [userLocation, setUserLocation] = useState<Location | null>(null)
  const [placeInfo, setPlaceInfo] = useState<PlaceInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nearbyDrivers, setNearbyDrivers] = useState<Driver[]>([])
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  // Mock data for nearby drivers
  const mockDrivers: Omit<Driver, "distance" | "estimatedTime">[] = [
    {
      id: "1",
      name: "Juan Dela Cruz",
      rating: 4.8,
      location: { lat: 0, lng: 0 }, // Will be updated based on user location
      vehicle: "Tricycle #123",
    },
    {
      id: "2",
      name: "Maria Santos",
      rating: 4.9,
      location: { lat: 0, lng: 0 }, // Will be updated based on user location
      vehicle: "Tricycle #456",
    },
    {
      id: "3",
      name: "Pedro Reyes",
      rating: 4.7,
      location: { lat: 0, lng: 0 }, // Will be updated based on user location
      vehicle: "Tricycle #789",
    },
  ]

  // Set domReady to true after component mounts
  useEffect(() => {
    setDomReady(true)
    console.log("Component mounted, DOM should be ready")
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
      let googleMapsInstance: any = null
      let mapInstance: google.maps.Map | null = null

      const initMap = async () => {
        try {
          console.log("Initializing Google Maps with container:", mapContainerRef.current)

          const loader = new Loader({
            apiKey,
            version: "weekly",
            libraries: ["places", "geometry"],
          })

          // Load Google Maps API
          googleMapsInstance = await loader.load()
          console.log("Google Maps loaded successfully")

          // Check if component is still mounted and ref is still available
          if (!isMounted || !mapContainerRef.current) {
            console.error("Component unmounted or map container not available after Google Maps loaded")
            return
          }

          // Default to Philippines if location not available
          const defaultLocation = { lat: 14.5995, lng: 120.9842 }

          // Create map instance
          mapInstance = new googleMapsInstance.maps.Map(mapContainerRef.current, {
            center: defaultLocation,
            zoom: 15,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            zoomControl: true,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          })

          if (!isMounted) return
          setMap(mapInstance)
          console.log("Map instance created")

          // Get user's current location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                if (!isMounted || !mapInstance) return

                const userPos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                }
                console.log("User position:", userPos)
                setUserLocation(userPos)

                mapInstance.setCenter(userPos)

                // Add marker for user location
                new googleMapsInstance.maps.Marker({
                  position: userPos,
                  map: mapInstance,
                  icon: {
                    path: googleMapsInstance.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "#4f46e5",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "#ffffff",
                  },
                })

                // Get place information
                const geocoder = new googleMapsInstance.maps.Geocoder()
                geocoder.geocode({ location: userPos }, (results, status) => {
                  if (!isMounted) return

                  if (status === "OK" && results && results[0]) {
                    const addressComponents = results[0].address_components

                    // Extract address components
                    const extractAddressComponent = (type: string) => {
                      const component = addressComponents.find((component) => component.types.includes(type))
                      return component ? component.long_name : "Unknown"
                    }

                    const placeData: PlaceInfo = {
                      city: extractAddressComponent("locality"),
                      municipality: extractAddressComponent("administrative_area_level_2"),
                      areaCode: extractAddressComponent("postal_code"),
                      street: extractAddressComponent("route"),
                      landmark: "Nearest landmark", // This would require additional API calls
                      formattedAddress: results[0].formatted_address,
                    }

                    setPlaceInfo(placeData)

                    // Generate nearby drivers with random distances
                    const driversWithDistance = mockDrivers.map((driver) => {
                      // Generate a random location nearby (within ~2km)
                      const randomLat = userPos.lat + (Math.random() - 0.5) * 0.02
                      const randomLng = userPos.lng + (Math.random() - 0.5) * 0.02
                      const driverPos = { lat: randomLat, lng: randomLng }

                      // Calculate distance
                      const distance =
                        googleMapsInstance.maps.geometry.spherical.computeDistanceBetween(
                          new googleMapsInstance.maps.LatLng(userPos),
                          new googleMapsInstance.maps.LatLng(driverPos),
                        ) / 1000 // Convert to km

                      // Add driver marker
                      new googleMapsInstance.maps.Marker({
                        position: driverPos,
                        map: mapInstance,
                        icon: {
                          url: "/placeholder.svg?height=40&width=40",
                          scaledSize: new googleMapsInstance.maps.Size(40, 40),
                        },
                        title: driver.name,
                      })

                      return {
                        ...driver,
                        location: driverPos,
                        distance: Number.parseFloat(distance.toFixed(1)),
                        estimatedTime: Math.round(distance * 5), // Rough estimate: 5 min per km
                      }
                    })

                    setNearbyDrivers(driversWithDistance)
                  }
                })
              },
              (error) => {
                if (!isMounted) return
                console.error("Error getting location:", error)
                setError("Unable to get your location. Please enable location services.")
              },
            )
          } else {
            if (!isMounted) return
            setError("Geolocation is not supported by your browser")
          }
        } catch (err) {
          if (!isMounted) return
          console.error("Error initializing Google Maps:", err)
          setError(`Failed to load Google Maps: ${err instanceof Error ? err.message : String(err)}`)
        } finally {
          if (isMounted) {
            setIsLoading(false)
          }
        }
      }

      // Start initialization
      initMap()

      // Cleanup function
      return () => {
        isMounted = false
        if (mapInstance) {
          // Clean up map instance if needed
          mapInstance = null
        }
      }
    }, 500) // Short delay to ensure DOM is ready

    return () => {
      clearTimeout(timer)
    }
  }, [apiKey, domReady])

  const handleBookRide = useCallback((driverId: string) => {
    // This would be implemented to handle booking logic
    console.log(`Booking ride with driver ${driverId}`)
    // Navigate to booking page or open booking modal
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
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
        <p className="text-sm mb-3">
          This could be due to:
          <ul className="list-disc list-inside ml-2 mt-1">
            <li>API key restrictions</li>
            <li>Missing API activation</li>
            <li>Network connectivity issues</li>
            <li>Location permission denied</li>
          </ul>
        </p>
        <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
          Retry Loading Map
        </Button>
        <div className="mt-4">
          <FallbackMap />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* This is the map container */}
      <div
        ref={mapContainerRef}
        className="h-[300px] w-full rounded-lg overflow-hidden border"
        id="google-map-container" // Adding ID for additional reference
      />

      {placeInfo && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Your Location</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Address:</span> {placeInfo.formattedAddress}
              </p>
              <p>
                <span className="font-medium">City:</span> {placeInfo.city}
              </p>
              <p>
                <span className="font-medium">Municipality:</span> {placeInfo.municipality}
              </p>
              {placeInfo.areaCode !== "Unknown" && (
                <p>
                  <span className="font-medium">Area Code:</span> {placeInfo.areaCode}
                </p>
              )}
              {placeInfo.street !== "Unknown" && (
                <p>
                  <span className="font-medium">Street:</span> {placeInfo.street}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {nearbyDrivers.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Available Drivers Nearby</h3>
          {nearbyDrivers.map((driver) => (
            <Card key={driver.id} className="hover:border-primary transition-colors">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{driver.name}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-3 w-3 mr-1" />
                      <span>{driver.vehicle}</span>
                      <span className="mx-1">•</span>
                      <span>{driver.rating} ★</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{driver.distance} km away</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>~{driver.estimatedTime} mins</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-2" size="sm" onClick={() => handleBookRide(driver.id)}>
                  Book Ride
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

