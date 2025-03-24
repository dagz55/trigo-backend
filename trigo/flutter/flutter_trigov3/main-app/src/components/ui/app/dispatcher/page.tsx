"use client"

import { useState } from "react"
import { ReactGoogleMap } from "@/components/react-google-maps"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function DispatcherPage() {
  const [selectedTab, setSelectedTab] = useState("map")
  const [filterStatus, setFilterStatus] = useState("all")
  const [mapError, setMapError] = useState<string | null>(null)

  // Mock data for active drivers
  const activeDrivers = [
    {
      id: "1",
      name: "Juan Dela Cruz",
      vehicle: "Tricycle #123",
      status: "active",
      lastActive: "Now",
      location: "Barangay San Isidro",
    },
    {
      id: "2",
      name: "Maria Santos",
      vehicle: "Tricycle #456",
      status: "idle",
      lastActive: "2 mins ago",
      location: "Sitio Maunlad",
    },
    {
      id: "3",
      name: "Pedro Reyes",
      vehicle: "Tricycle #789",
      status: "active",
      lastActive: "Now",
      location: "Purok Pagkakaisa",
    },
    {
      id: "4",
      name: "Ana Gonzales",
      vehicle: "Tricycle #101",
      status: "offline",
      lastActive: "1 hour ago",
      location: "Barangay San Isidro",
    },
  ]

  // Filter drivers based on status
  const filteredDrivers =
    filterStatus === "all" ? activeDrivers : activeDrivers.filter((driver) => driver.status === filterStatus)

  const handleMapError = (error: string) => {
    console.error("Map error:", error)
    setMapError(error)
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Dispatcher Dashboard</h1>

      <Tabs defaultValue="map" className="w-full mb-6" onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="list">Driver List</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="mt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Active Tricycles</h2>
              <div className="flex gap-2">
                <Badge
                  variant={filterStatus === "all" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </Badge>
                <Badge
                  variant={filterStatus === "active" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilterStatus("active")}
                >
                  Active
                </Badge>
                <Badge
                  variant={filterStatus === "idle" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilterStatus("idle")}
                >
                  Idle
                </Badge>
              </div>
            </div>

            <>
              {mapError ? (
                <Alert variant="warning" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Map Issue</AlertTitle>
                  <AlertDescription>{mapError}. The map will use default locations instead.</AlertDescription>
                </Alert>
              ) : null}
              <ReactGoogleMap
                onError={handleMapError}
                // Don't show the location alert in the map component since we're already showing one in the dispatcher page
                showLocationAlert={false}
              />
            </>

            <p className="text-sm text-muted-foreground">Showing {filteredDrivers.length} tricycles on the map</p>
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Driver List</h2>
              <div className="flex gap-2">
                <Badge
                  variant={filterStatus === "all" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </Badge>
                <Badge
                  variant={filterStatus === "active" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilterStatus("active")}
                >
                  Active
                </Badge>
                <Badge
                  variant={filterStatus === "idle" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilterStatus("idle")}
                >
                  Idle
                </Badge>
                <Badge
                  variant={filterStatus === "offline" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilterStatus("offline")}
                >
                  Offline
                </Badge>
              </div>
            </div>

            {filteredDrivers.map((driver) => (
              <Card key={driver.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt={driver.name} />
                      <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{driver.name}</h3>
                        <Badge
                          variant={
                            driver.status === "active" ? "default" : driver.status === "idle" ? "secondary" : "outline"
                          }
                        >
                          {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{driver.vehicle}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">{driver.location}</span>
                        <span className="text-xs text-muted-foreground">Last active: {driver.lastActive}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">
                      Contact
                    </Button>
                    <Button size="sm" className="flex-1">
                      Assign Ride
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredDrivers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No drivers match the selected filter</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

