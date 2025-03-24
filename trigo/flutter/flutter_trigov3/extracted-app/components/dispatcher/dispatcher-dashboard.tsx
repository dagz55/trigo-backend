"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Phone, MessageCircle, UserCheck } from "lucide-react"

export function DispatcherDashboard({ user }: { user: any }) {
  const [newRides, setNewRides] = useState<any[]>([])
  const [assignedRides, setAssignedRides] = useState<any[]>([])
  const [availableRiders, setAvailableRiders] = useState<any[]>([])
  const { toast } = useToast()

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch new ride requests
        const { data: ridesData, error: ridesError } = await supabase
          .from("rides")
          .select("*")
          .eq("status", "requested")
          .order("requestTime", { ascending: true })

        if (ridesError) throw ridesError
        setNewRides(ridesData || [])

        // Fetch assigned rides
        const { data: assignedData, error: assignedError } = await supabase
          .from("rides")
          .select("*, profiles(*)")
          .in("status", ["assigned", "inProgress"])
          .order("requestTime", { ascending: true })

        if (assignedError) throw assignedError
        setAssignedRides(assignedData || [])

        // Fetch available riders
        const { data: ridersData, error: ridersError } = await supabase
          .from("profiles")
          .select("*, locations(*)")
          .eq("role", "rider")
          .eq("isOnline", true)
          .eq("isAvailable", true)

        if (ridersError) throw ridersError
        setAvailableRiders(ridersData || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()

    // Set up subscriptions
    const ridesSubscription = supabase
      .channel("public:rides")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rides",
        },
        () => {
          fetchData()
        },
      )
      .subscribe()

    const ridersSubscription = supabase
      .channel("public:profiles")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: "role=eq.rider",
        },
        () => {
          fetchData()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(ridesSubscription)
      supabase.removeChannel(ridersSubscription)
    }
  }, [])

  // Assign a rider to a ride
  const assignRider = async (rideId: string, riderId: string) => {
    try {
      // Update the ride record
      const { error: rideError } = await supabase
        .from("rides")
        .update({
          riderId,
          dispatcherId: user.id,
          status: "assigned",
        })
        .eq("id", rideId)

      if (rideError) throw rideError

      // Update rider availability
      const { error: riderError } = await supabase.from("profiles").update({ isAvailable: false }).eq("id", riderId)

      if (riderError) throw riderError

      toast({
        title: "Rider Assigned",
        description: "The rider has been successfully assigned to this trip",
      })
    } catch (error: any) {
      toast({
        title: "Error Assigning Rider",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Dispatcher Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="new">
            <TabsList className="mb-4">
              <TabsTrigger value="new">
                New Requests
                {newRides.length > 0 && (
                  <Badge className="ml-2 bg-primary" variant="secondary">
                    {newRides.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="active">Active Rides</TabsTrigger>
            </TabsList>

            <TabsContent value="new">
              {newRides.length > 0 ? (
                <div className="grid gap-4">
                  {newRides.map((ride) => (
                    <Card key={ride.id}>
                      <CardContent className="pt-6">
                        <div className="flex flex-col space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">New Ride Request</span>
                            <Badge variant="outline">{new Date(ride.requestTime).toLocaleTimeString()}</Badge>
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

                          <div className="flex space-x-2">
                            <Button className="flex-1" onClick={() => assignRider(ride.id, availableRiders[0]?.id)}>
                              <UserCheck className="w-4 h-4 mr-2" />
                              Assign Rider
                            </Button>
                            <Button variant="outline">
                              <Phone className="w-4 h-4 mr-2" />
                              Contact
                            </Button>
                            <Button variant="outline">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center py-12 text-muted-foreground">No new ride requests</p>
              )}
            </TabsContent>

            <TabsContent value="active">
              {assignedRides.length > 0 ? (
                <div className="grid gap-4">
                  {assignedRides.map((ride) => (
                    <Card key={ride.id}>
                      <CardContent className="pt-6">
                        <div className="flex flex-col space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Ride #{ride.id.slice(0, 8)}...</span>
                            <Badge variant={ride.status === "inProgress" ? "default" : "secondary"}>
                              {ride.status === "inProgress" ? "In Progress" : "Assigned"}
                            </Badge>
                          </div>

                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                              <UserCheck className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{ride.profiles?.name || "Assigned Rider"}</p>
                              <p className="text-xs text-muted-foreground">{ride.profiles?.phone || "No phone"}</p>
                            </div>
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

                          <div className="flex space-x-2">
                            <Button variant="outline">
                              <Phone className="w-4 h-4 mr-2" />
                              Call Rider
                            </Button>
                            <Button variant="outline">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center py-12 text-muted-foreground">No active rides at the moment</p>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Available Riders</CardTitle>
              <CardDescription>{availableRiders.length} riders currently online</CardDescription>
            </CardHeader>
            <CardContent>
              {availableRiders.length > 0 ? (
                <div className="space-y-4">
                  {availableRiders.map((rider) => (
                    <div key={rider.id} className="flex items-center p-2 border rounded-md">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <UserCheck className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">{rider.name || "Rider"}</p>
                        <p className="text-xs text-muted-foreground">{rider.phone || "No phone"}</p>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        Online
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">No riders available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

