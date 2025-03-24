"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"
import { Loader2, MapPin, Navigation } from "lucide-react"

export function RiderDashboard({ user }: { user: any }) {
  const [isOnline, setIsOnline] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<any>(null)
  const [locating, setLocating] = useState(false)
  const [rides, setRides] = useState<any[]>([])
  const { toast } = useToast()

  // Update rider status (online/offline)
  const updateRiderStatus = async (status: boolean) => {
    try {
      const { error } = await supabase.from("profiles").update({ isOnline: status }).eq("id", user.id)

      if (error) throw error

      toast({
        title: status ? "You are now online" : "You are now offline",
        description: status ? "You can now receive ride requests" : "You will not receive new ride requests",
      })
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  // Handle online/offline toggle
  const handleStatusChange = (checked: boolean) => {
    setIsOnline(checked)
    updateRiderStatus(checked)

    if (checked) {
      detectLocation()
    }
  }

  // Get rider's current location
  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support location detection.",
        variant: "destructive",
      })
      return
    }

    setLocating(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setCurrentLocation(loc)
        setLocating(false)

        // Update rider's location in database
        try {
          const { error } = await supabase.from("locations").insert({
            user_id: user.id,
            latitude: loc.lat,
            longitude: loc.lng,
            address: "Current location",
          })

          if (error) throw error
        } catch (error) {
          console.error("Error saving location:", error)
        }
      },
      (error) => {
        console.error("Error getting location:", error)
        setLocating(false)
        toast({
          title: "Location Error",
          description: "Unable to get your location. You must share your location to go online.",
          variant: "destructive",
        })
        setIsOnline(false)
      },
    )
  }

  // Fetch rider's assigned rides
  useEffect(() => {
    const fetchRides = async () => {
      try {
        const { data, error } = await supabase
          .from("rides")
          .select("*")
          .eq("riderId", user.id)
          .order("requestTime", { ascending: false })

        if (error) throw error

        setRides(data || [])
      } catch (error) {
        console.error("Error fetching rides:", error)
      }
    }

    fetchRides()

    // Subscribe to changes
    const ridesSubscription = supabase
      .channel("public:rides")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rides",
          filter: `riderId=eq.${user.id}`,
        },
        () => {
          fetchRides()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(ridesSubscription)
    }
  }, [user.id])

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rider Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch id="online-mode" checked={isOnline} onCheckedChange={handleStatusChange} />
            <Label htmlFor="online-mode">{isOnline ? "Online" : "Offline"}</Label>
          </div>
          <Button variant="outline" onClick={detectLocation} disabled={locating || !isOnline}>
            {locating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Navigation className="w-4 h-4 mr-2" />}
            Update Location
          </Button>
        </div>
      </div>

      {currentLocation && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Current Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary" />
              <div>
                <p>
                  Lat: {currentLocation.lat.toFixed(6)}, Lng: {currentLocation.lng.toFixed(6)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="active">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Rides</TabsTrigger>
          <TabsTrigger value="history">Ride History</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {rides.filter((ride) => ["assigned", "inProgress"].includes(ride.status)).length > 0 ? (
            <div className="grid gap-4">
              {rides
                .filter((ride) => ["assigned", "inProgress"].includes(ride.status))
                .map((ride) => (
                  <RideCard key={ride.id} ride={ride} />
                ))}
            </div>
          ) : (
            <p className="text-center py-12 text-muted-foreground">No active rides at the moment</p>
          )}
        </TabsContent>

        <TabsContent value="history">
          {rides.filter((ride) => ["completed", "cancelled"].includes(ride.status)).length > 0 ? (
            <div className="grid gap-4">
              {rides
                .filter((ride) => ["completed", "cancelled"].includes(ride.status))
                .map((ride) => (
                  <RideCard key={ride.id} ride={ride} isHistory />
                ))}
            </div>
          ) : (
            <p className="text-center py-12 text-muted-foreground">No ride history yet</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Simple ride card component
function RideCard({ ride, isHistory = false }: { ride: any; isHistory?: boolean }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">Ride #{ride.id.slice(0, 8)}...</span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                ride.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : ride.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : ride.status === "inProgress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex">
              <MapPin className="w-5 h-5 mr-2 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Pickup</p>
                <p className="text-sm text-muted-foreground">
                  {ride.pickupLocation.address ||
                    `${ride.pickupLocation.lat.toFixed(6)}, ${ride.pickupLocation.lng.toFixed(6)}`}
                </p>
              </div>
            </div>

            <div className="flex">
              <MapPin className="w-5 h-5 mr-2 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Dropoff</p>
                <p className="text-sm text-muted-foreground">
                  {ride.dropoffLocation.address ||
                    `${ride.dropoffLocation.lat.toFixed(6)}, ${ride.dropoffLocation.lng.toFixed(6)}`}
                </p>
              </div>
            </div>
          </div>

          {!isHistory && (
            <div className="flex space-x-2">
              <Button className="flex-1">{ride.status === "assigned" ? "Start Ride" : "Complete Ride"}</Button>
              <Button variant="outline">Contact Passenger</Button>
            </div>
          )}

          {isHistory && ride.fare && (
            <div className="pt-2 border-t">
              <p className="flex justify-between">
                <span>Fare:</span>
                <span className="font-medium">₱{ride.fare.toFixed(2)}</span>
              </p>
              <p className="flex justify-between text-sm text-muted-foreground">
                <span>Payment:</span>
                <span>{ride.paymentMethod === "cash" ? "Cash" : "Online"}</span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

