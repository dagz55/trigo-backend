"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, AlertTriangle } from "lucide-react"
import { GoogleMap } from "@/components/google-map"
import { SimpleMap } from "@/components/simple-map"
import { DirectMap } from "@/components/direct-map"
import { FallbackMap } from "@/components/fallback-map"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ReactGoogleMap } from "@/components/react-google-maps"

export default function ActivityPage() {
  const [hasActivity, setHasActivity] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mapError, setMapError] = useState(false)
  const [mapMode, setMapMode] = useState<"full" | "simple" | "direct" | "react" | "fallback">("react")
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  // Simulate loading activity data
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasActivity(false)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Check if Google Maps API key is available
  useEffect(() => {
    if (!apiKey) {
      console.error("Google Maps API key is missing")
      setMapError(true)
      setMapMode("fallback")
    }
  }, [apiKey])

  // Function to cycle through map modes
  const cycleMapMode = () => {
    if (mapMode === "full") setMapMode("simple")
    else if (mapMode === "simple") setMapMode("direct")
    else if (mapMode === "direct") setMapMode("react")
    else if (mapMode === "react") setMapMode("fallback")
    else setMapMode("full")
  }

  // Render the appropriate map component based on mode
  const renderMap = () => {
    switch (mapMode) {
      case "full":
        return <GoogleMap />
      case "simple":
        return <SimpleMap />
      case "direct":
        return <DirectMap />
      case "react":
        return <ReactGoogleMap />
      case "fallback":
        return <FallbackMap />
    }
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Activity</h1>

      {mapError && (
        <Alert variant="warning" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Map Configuration Issue</AlertTitle>
          <AlertDescription>
            There seems to be an issue with the map configuration. Please check your API key settings.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="current" className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">Current</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : hasActivity ? (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h2 className="font-medium mb-2">Current Ride</h2>
                  <p>You have an active ride in progress.</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground mb-4">
                You don't have any current activity. Here's what's happening around you:
              </p>

              {/* Map mode selector */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Map Mode: {mapMode}</span>
                <button onClick={cycleMapMode} className="text-sm text-primary hover:underline">
                  Try Different Map
                </button>
              </div>

              {/* Render the map based on selected mode */}
              {renderMap()}

              <div className="text-xs text-muted-foreground mt-2">
                <p>Using {mapMode === "fallback" ? "static fallback" : "Google Maps API"} for location services</p>
                {mapMode !== "fallback" && <p>API Key: {apiKey ? "Configured ✓" : "Missing ✗"}</p>}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-4">
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Home to Market</h3>
                  <span className="text-xs text-muted-foreground">Yesterday</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>2.5 km • ₱25.00</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium">Driver:</span>
                  <span className="ml-1">Juan Dela Cruz</span>
                  <span className="ml-auto">★★★★★</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Market to School</h3>
                  <span className="text-xs text-muted-foreground">3 days ago</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>1.8 km • ₱20.00</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium">Driver:</span>
                  <span className="ml-1">Maria Santos</span>
                  <span className="ml-auto">★★★★☆</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

