"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api"
import { MapPin, User, Clock, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FallbackMap } from "@/components/fallback-map"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define the container style
const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "0.5rem",
  overflow: "hidden",
}

// Default center (Philippines)
const defaultCenter = {
  lat: 14.5995,
  lng: 120.9842,
}

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

// Declare google variable
declare global {
  interface Window {
    google: any
  }
}

// Update the component interface at the top of the file
interface ReactGoogleMapProps {
  onError?: (error: string) => void
  defaultLocation?: Location
  showLocationAlert?: boolean
}

// Update the component definition
export function ReactGoogleMap({
  onError,
  defaultLocation = defaultCenter,
  showLocationAlert = true,
}: ReactGoogleMapProps) {
  const [userLocation, setUserLocation] = useState<Location | null>(null)
  const [placeInfo, setPlaceInfo] = useState<PlaceInfo | null>(null)
  const [nearbyDrivers, setNearbyDrivers] = useState<Driver[]>([])
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null)
  const [locationDenied, setLocationDenied] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isManualLocation, setIsManualLocation] = useState(false)
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  const geocoderRef = useRef<google.maps.Geocoder | null>(null)

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

  // Load the Google Maps JavaScript API
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: ["places", "geometry"],
  })

  // Function to generate drivers around a location
  const generateDriversAroundLocation = useCallback(
    (center: Location) => {
      if (window.google && window.google.maps && window.google.maps.geometry) {
        const driversWithDistance = mockDrivers.map((driver) => {
          // Generate a random location nearby (within ~2km)
          const randomLat = center.lat + (Math.random() - 0.5) * 0.02
          const randomLng = center.lng + (Math.random() - 0.5) * 0.02
          const driverPos = { lat: randomLat, lng: randomLng }

          // Calculate distance from center
          const distance =
            window.google.maps.geometry.spherical.computeDistanceBetween(
              new window.google.maps.LatLng(center),
              new window.google.maps.LatLng(driverPos),
            ) / 1000 // Convert to km

          return {
            ...driver,
            location: driverPos,
            distance: Number.parseFloat(distance.toFixed(1)),
            estimatedTime: Math.round(distance * 5), // Rough estimate: 5 min per km
          }
        })

        setNearbyDrivers(driversWithDistance)
      }
    },
    [mockDrivers],
  )

  // Function to get place information using Geocoder
  const getPlaceInfo = useCallback((location: Location) => {
    if (window.google && window.google.maps) {
      if (!geocoderRef.current) {
        geocoderRef.current = new window.google.maps.Geocoder()
      }

      geocoderRef.current.geocode({ location }, (results, status) => {
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
        }
      })
    }
  }, [])

  // Get user's current location or use default
  useEffect(() => {
    if (isLoaded && !userLocation) {
      // Set a default location to use if geolocation is denied
      const defaultUserLocation = {
        lat: defaultLocation.lat,
        lng: defaultLocation.lng,
      }

      // Try to get user location, but have a fallback ready
      if (navigator.geolocation) {
        // Set a timeout for geolocation request
        const timeoutId = setTimeout(() => {
          console.log("Geolocation request timed out")
          setUserLocation(defaultUserLocation)
          setLocationError("Location request timed out")
          setLocationDenied(true)
          generateDriversAroundLocation(defaultUserLocation)
          getPlaceInfo(defaultUserLocation)

          if (onError) {
            onError("Location request timed out")
          }
        }, 10000) // 10 second timeout

        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Clear the timeout since we got a response
            clearTimeout(timeoutId)

            const userPos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
            setUserLocation(userPos)
            setLocationDenied(false)
            setLocationError(null)

            // Generate nearby drivers with random distances
            generateDriversAroundLocation(userPos)
            getPlaceInfo(userPos)
          },
          (error) => {
            // Clear the timeout since we got a response (even if it's an error)
            clearTimeout(timeoutId)

            console.log("Error getting location:", error)
            setUserLocation(defaultUserLocation)
            setLocationDenied(true)

            // Set specific error message based on error code
            if (error.code === 1) {
              setLocationError("Location permission denied")
              if (onError) onError("Location permission denied")
            } else if (error.code === 2) {
              setLocationError("Location unavailable")
              if (onError) onError("Location unavailable")
            } else if (error.code === 3) {
              setLocationError("Location request timed out")
              if (onError) onError("Location request timed out")
            } else {
              setLocationError("Error getting location")
              if (onError) onError("Error getting location")
            }

            // Still generate drivers around default location
            generateDriversAroundLocation(defaultUserLocation)
            getPlaceInfo(defaultUserLocation)
          },
          {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 0,
          },
        )
      } else {
        // Browser doesn't support geolocation
        setUserLocation(defaultUserLocation)
        setLocationDenied(true)
        setLocationError("Geolocation not supported")
        if (onError) onError("Geolocation not supported")

        // Still generate drivers around default location
        generateDriversAroundLocation(defaultUserLocation)
        getPlaceInfo(defaultUserLocation)
      }
    }
  }, [isLoaded, userLocation, onError, generateDriversAroundLocation, getPlaceInfo, defaultLocation])

  // Handle map load
  const onLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map)
  }, [])

  // Handle map unmount
  const onUnmount = useCallback(() => {
    setMapRef(null)
  }, [])

  const handleBookRide = useCallback((driverId: string) => {
    // This would be implemented to handle booking logic
    console.log(`Booking ride with driver ${driverId}`)
    // Navigate to booking page or open booking modal
  }, [])

  // Function to handle manual location setting
  const handleSetManualLocation = useCallback(
    (location: Location) => {
      setUserLocation(location)
      setIsManualLocation(true)
      generateDriversAroundLocation(location)
      getPlaceInfo(location)
    },
    [generateDriversAroundLocation, getPlaceInfo],
  )

  // If the API is still loading, show a skeleton
  if (!isLoaded) {
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

  // If there was an error loading the API, show an error message
  if (loadError) {
    // Notify parent component about the error
    if (onError) {
      onError(`Failed to load Google Maps: ${loadError.message}`)
    }

    return (
      <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg text-orange-800">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <h3 className="font-medium">Map Loading Issue</h3>
        </div>
        <p className="mb-2">Error loading Google Maps API: {loadError.message}</p>
        <p className="text-sm mb-3">
          This could be due to:
          <ul className="list-disc list-inside ml-2 mt-1">
            <li>API key restrictions</li>
            <li>Missing API activation</li>
            <li>Network connectivity issues</li>
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
      {/* Google Map Component */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || defaultLocation}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
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
        }}
        onClick={(e) => {
          if (e.latLng) {
            const clickedLocation = {
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            }
            handleSetManualLocation(clickedLocation)
          }
        }}
      >
        {/* User Marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: isManualLocation ? "#f97316" : "#4f46e5", // Orange for manual, blue for GPS
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#ffffff",
            }}
          />
        )}

        {/* Driver Markers */}
        {nearbyDrivers.map((driver) => (
          <Marker
            key={driver.id}
            position={driver.location}
            icon={{
              url: "/placeholder.svg?height=40&width=40",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
            onClick={() => setSelectedDriver(driver)}
          />
        ))}

        {/* Info Window for selected driver */}
        {selectedDriver && (
          <InfoWindow position={selectedDriver.location} onCloseClick={() => setSelectedDriver(null)}>
            <div className="p-2">
              <h3 className="font-medium">{selectedDriver.name}</h3>
              <p className="text-sm">{selectedDriver.vehicle}</p>
              <p className="text-sm">Rating: {selectedDriver.rating} ★</p>
              <p className="text-sm">{selectedDriver.distance} km away</p>
              <p className="text-sm">~{selectedDriver.estimatedTime} mins</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Location Permission Alert */}
      {locationDenied && showLocationAlert && (
        <Alert variant="warning" className="mt-2">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Using approximate location</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              {locationError === "Location permission denied"
                ? "Location access was denied. We're showing an approximate location instead."
                : "We couldn't access your precise location. You can still use the app, but distances may not be accurate."}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  if (navigator.permissions) {
                    navigator.permissions.query({ name: "geolocation" }).then((result) => {
                      if (result.state === "denied") {
                        alert("Please enable location access in your browser settings and reload the page.")
                      } else {
                        window.location.reload()
                      }
                    })
                  } else {
                    window.location.reload()
                  }
                }}
              >
                Enable Location Access
              </Button>
              <Button
                variant="default"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  if (mapRef) {
                    const center = mapRef.getCenter()
                    if (center) {
                      handleSetManualLocation({
                        lat: center.lat(),
                        lng: center.lng(),
                      })
                    }
                  }
                }}
              >
                <MapPin className="h-3 w-3 mr-1" />
                Use Current Map Center
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {isManualLocation && (
        <Alert variant="default" className="bg-orange-50 border-orange-200 text-orange-800">
          <MapPin className="h-5 w-5 text-orange-500" />
          <AlertTitle>Manual Location Set</AlertTitle>
          <AlertDescription>
            You've manually set your location. Click anywhere on the map to change it.
          </AlertDescription>
        </Alert>
      )}

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

