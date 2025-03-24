"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { MapPin, Navigation, ArrowRight, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function PassengerBooking() {
  const [step, setStep] = useState(1)
  const [pickupLocation, setPickupLocation] = useState<any>(null)
  const [dropoffLocation, setDropoffLocation] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [locating, setLocating] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [manualMode, setManualMode] = useState(false)
  const [manualLat, setManualLat] = useState("")
  const [manualLng, setManualLng] = useState("")
  const [locationError, setLocationError] = useState<string | null>(null)

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser. Please enter your location manually.")
      setManualMode(true)
      return
    }

    setLocating(true)
    setLocationError(null)
    setPermissionDenied(false)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPickupLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLocating(false)
      },
      (error) => {
        console.error("Error getting location:", error)
        setLocating(false)

        if (error.code === 1) {
          // Permission denied
          setPermissionDenied(true)
          setLocationError(
            "You've denied access to your location. You can enter coordinates manually or try again after enabling location services.",
          )
        } else if (error.code === 2) {
          // Position unavailable
          setLocationError(
            "Unable to determine your location. Please check your device's location settings or enter your location manually.",
          )
        } else if (error.code === 3) {
          // Timeout
          setLocationError("Location request timed out. Please try again or enter your location manually.")
        } else {
          // Generic error
          setLocationError("Unable to get your location. Please try again or enter your location manually.")
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const lat = Number.parseFloat(manualLat)
      const lng = Number.parseFloat(manualLng)

      if (isNaN(lat) || isNaN(lng)) {
        setLocationError("Please enter valid latitude and longitude values.")
        return
      }

      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        setLocationError("Latitude must be between -90 and 90, and longitude must be between -180 and 180.")
        return
      }

      setPickupLocation({ lat, lng })
      setManualMode(false)
      setLocationError(null)
    } catch (error) {
      setLocationError("Failed to set location. Please check your input and try again.")
    }
  }

  const handleNextStep = () => {
    if (step === 1 && !pickupLocation) {
      setLocationError("Please detect your location or enter it manually first")
      return
    }

    if (step === 2 && !dropoffLocation) {
      setLocationError("Please enter your destination")
      return
    }

    setLocationError(null)

    if (step < 3) {
      setStep(step + 1)
    } else {
      // Submit booking
      setBookingComplete(true)
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  if (bookingComplete) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Booking Successful!</CardTitle>
          <CardDescription>
            Your ride request has been submitted. A dispatcher will assign you a driver shortly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 rounded-md text-green-700 text-center">
            <p className="font-medium">Booking Reference: TRG-{Math.floor(Math.random() * 10000)}</p>
            <p className="text-sm">Please keep this reference number</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Pickup Location</h3>
            <p className="text-sm text-muted-foreground">
              Lat: {pickupLocation.lat.toFixed(6)}, Lng: {pickupLocation.lng.toFixed(6)}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Destination</h3>
            <p className="text-sm text-muted-foreground">{dropoffLocation}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Passenger Details</h3>
            <p className="text-sm text-muted-foreground">{name}</p>
            <p className="text-sm text-muted-foreground">{phone}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setBookingComplete(false)
              setStep(1)
              setPickupLocation(null)
              setDropoffLocation("")
              setName("")
              setPhone("")
            }}
          >
            Book Another Ride
          </Button>
          <Link href="/auth">
            <Button>Sign In / Register</Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Book a Ride</CardTitle>
        <CardDescription>
          {step === 1 && "Let us know your current location"}
          {step === 2 && "Where would you like to go?"}
          {step === 3 && "Enter your contact details"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {locationError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Location Error</AlertTitle>
            <AlertDescription>{locationError}</AlertDescription>
          </Alert>
        )}

        {permissionDenied && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Location Permission Denied</AlertTitle>
            <AlertDescription>
              <p className="mb-2">You've denied access to your location. To enable location services:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Click the lock/info icon in your browser's address bar</li>
                <li>Find "Location" or "Site settings" and allow access</li>
                <li>Refresh the page and try again</li>
              </ul>
              <p className="mt-2">Alternatively, you can enter your coordinates manually below.</p>
            </AlertDescription>
          </Alert>
        )}

        {step === 1 && !manualMode && (
          <div className="space-y-4">
            <div className="w-full h-[200px] rounded-md bg-muted flex items-center justify-center mb-4">
              <MapPin className="w-12 h-12 text-muted-foreground" />
            </div>

            <div className="flex space-x-2">
              <Button onClick={detectLocation} className="flex-1" disabled={locating}>
                <Navigation className="w-4 h-4 mr-2" />
                {locating ? "Detecting..." : "Detect My Location"}
              </Button>
              <Button variant="outline" onClick={() => setManualMode(true)}>
                Enter Manually
              </Button>
            </div>

            {pickupLocation && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p>Latitude: {pickupLocation.lat.toFixed(6)}</p>
                <p>Longitude: {pickupLocation.lng.toFixed(6)}</p>
              </div>
            )}
          </div>
        )}

        {step === 1 && manualMode && (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="text"
                  placeholder="e.g., 14.5995"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="text"
                  placeholder="e.g., 120.9842"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                Set Location
              </Button>
              <Button type="button" variant="outline" onClick={() => setManualMode(false)}>
                Cancel
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>You can find your coordinates using Google Maps:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Open Google Maps</li>
                <li>Right-click on your location</li>
                <li>Select "What's here?"</li>
                <li>Copy the coordinates shown at the bottom</li>
              </ol>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dropoff">Where are you going?</Label>
              <Input
                id="dropoff"
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
                placeholder="Enter your destination"
                required
              />
            </div>

            {pickupLocation && (
              <div className="p-3 bg-muted rounded-md">
                <p className="font-medium">Pickup Location</p>
                <p className="text-sm text-muted-foreground">
                  Lat: {pickupLocation.lat.toFixed(6)}, Lng: {pickupLocation.lng.toFixed(6)}
                </p>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="p-3 bg-muted rounded-md space-y-2">
              <div>
                <p className="font-medium">Pickup Location</p>
                <p className="text-sm text-muted-foreground">
                  Lat: {pickupLocation.lat.toFixed(6)}, Lng: {pickupLocation.lng.toFixed(6)}
                </p>
              </div>
              <div>
                <p className="font-medium">Destination</p>
                <p className="text-sm text-muted-foreground">{dropoffLocation}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={handlePrevStep}>
            Back
          </Button>
        ) : (
          <Link href="/">
            <Button variant="outline">Cancel</Button>
          </Link>
        )}

        <Button onClick={handleNextStep}>
          {step < 3 ? (
            <>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            "Book Ride"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

