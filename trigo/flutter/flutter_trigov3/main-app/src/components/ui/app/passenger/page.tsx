"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { MapPin, Navigation, Clock, Search, Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PassengerDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [bookingStep, setBookingStep] = useState(0)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery) {
      setBookingStep(1)
    }
  }

  const confirmRide = () => {
    setBookingStep(2)
  }

  const resetBooking = () => {
    setBookingStep(0)
    setSearchQuery("")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="px-4 py-4">
          {bookingStep === 0 && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <form onSubmit={handleSearch} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="pickup" className="text-sm font-medium">
                        Pickup Location
                      </label>
                      <div className="flex items-center border rounded-md px-3 py-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                        <Input
                          id="pickup"
                          placeholder="Current location"
                          className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          defaultValue="My Home"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="destination" className="text-sm font-medium">
                        Destination
                      </label>
                      <div className="flex items-center border rounded-md px-3 py-2">
                        <Navigation className="h-4 w-4 text-muted-foreground mr-2" />
                        <Input
                          id="destination"
                          placeholder="Where are you going?"
                          className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 ml-1"
                            onClick={() => setSearchQuery("")}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Clear</span>
                          </Button>
                        )}
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={!searchQuery}>
                      <Search className="h-4 w-4 mr-2" />
                      Find Tricycles
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3">Saved Places</h3>
                  <div className="space-y-3">
                    <div
                      className="flex items-center gap-3 p-2 hover:bg-muted rounded-md active:bg-muted/80 touch-manipulation"
                      onClick={() => setSearchQuery("Market")}
                    >
                      <div className="rounded-full bg-primary/10 p-2">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Market</p>
                        <p className="text-sm text-muted-foreground">Barangay Center, Main Road</p>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-3 p-2 hover:bg-muted rounded-md active:bg-muted/80 touch-manipulation"
                      onClick={() => setSearchQuery("School")}
                    >
                      <div className="rounded-full bg-primary/10 p-2">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">School</p>
                        <p className="text-sm text-muted-foreground">Elementary School, Education St.</p>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-3 p-2 hover:bg-muted rounded-md active:bg-muted/80 touch-manipulation"
                      onClick={() => setSearchQuery("Health Center")}
                    >
                      <div className="rounded-full bg-primary/10 p-2">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Health Center</p>
                        <p className="text-sm text-muted-foreground">Community Health Center, Health St.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="active">Active Rides</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="mt-4">
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="rounded-full bg-muted p-4 mb-4">
                      <Clock className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Active Rides</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      You don't have any active rides at the moment.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="mt-4 space-y-3">
                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg" alt="Driver" />
                          <AvatarFallback>JR</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">Juan Reyes</h3>
                            <span className="text-xs text-muted-foreground">Yesterday</span>
                          </div>
                          <p className="text-sm">Home to Market</p>
                          <div className="flex items-center mt-1">
                            <span className="text-sm font-medium">₱25.00</span>
                            <div className="flex items-center ml-auto">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg" alt="Driver" />
                          <AvatarFallback>MS</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">Maria Santos</h3>
                            <span className="text-xs text-muted-foreground">3 days ago</span>
                          </div>
                          <p className="text-sm">Home to Health Center</p>
                          <div className="flex items-center mt-1">
                            <span className="text-sm font-medium">₱30.00</span>
                            <div className="flex items-center ml-auto">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <Star className="h-3 w-3 text-muted" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {bookingStep === 1 && (
            <div className="space-y-3">
              <div className="space-y-3">
                <Card className="active:bg-muted/50 touch-manipulation" onClick={confirmRide}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder.svg" alt="Driver" />
                        <AvatarFallback>RD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Ramon Dela Cruz</h3>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm ml-1">4.8</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Tricycle #123</p>
                        <div className="flex items-center mt-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm ml-1">5 mins away</span>
                          <span className="text-sm font-medium ml-auto">₱25.00</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="active:bg-muted/50 touch-manipulation">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder.svg" alt="Driver" />
                        <AvatarFallback>JR</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Juan Reyes</h3>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm ml-1">4.6</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Tricycle #456</p>
                        <div className="flex items-center mt-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm ml-1">8 mins away</span>
                          <span className="text-sm font-medium ml-auto">₱25.00</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="active:bg-muted/50 touch-manipulation">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder.svg" alt="Driver" />
                        <AvatarFallback>MS</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Maria Santos</h3>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm ml-1">4.9</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Tricycle #789</p>
                        <div className="flex items-center mt-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm ml-1">12 mins away</span>
                          <span className="text-sm font-medium ml-auto">₱25.00</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {bookingStep === 2 && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Your Ride is Confirmed!</h3>
                    <Button variant="outline" size="sm" onClick={resetBooking} className="h-8 px-3">
                      Cancel
                    </Button>
                  </div>

                  <div className="bg-muted p-4 rounded-lg mb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src="/placeholder.svg" alt="Driver" />
                        <AvatarFallback>RD</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">Ramon Dela Cruz</h3>
                        <p className="text-sm text-muted-foreground">Tricycle #123</p>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm ml-1">4.8</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="rounded-full bg-primary/10 p-1 mr-2">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-sm">My Home</p>
                      </div>
                      <div className="border-l-2 h-4 ml-3"></div>
                      <div className="flex items-center">
                        <div className="rounded-full bg-primary/10 p-1 mr-2">
                          <Navigation className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-sm">{searchQuery}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Fare</span>
                      <span className="text-sm font-medium">₱25.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Payment Method</span>
                      <span className="text-sm font-medium">Cash</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-center text-muted-foreground">
                      Your driver is on the way. Estimated arrival in 5 minutes.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="relative h-56 rounded-lg overflow-hidden">
                <Image src="/placeholder.svg?height=224&width=400" alt="Map view" fill className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-background/80 p-4 rounded-lg backdrop-blur-sm">
                    <p className="text-center font-medium">Live tracking will appear here</p>
                  </div>
                </div>
              </div>

              <div className="fixed bottom-16 left-0 right-0 p-4 bg-background border-t">
                <Button className="w-full" size="lg">
                  Contact Driver
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

