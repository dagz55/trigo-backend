"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, MapPin, Navigation, Clock, User, DollarSign, Settings, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MobileNav } from "@/components/mobile-nav"

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(false)
  const [hasRideRequest, setHasRideRequest] = useState(false)
  const [activeRide, setActiveRide] = useState(false)

  const toggleOnline = () => {
    setIsOnline(!isOnline)
    if (!isOnline) {
      // Simulate receiving a ride request after going online
      setTimeout(() => {
        setHasRideRequest(true)
      }, 3000)
    } else {
      setHasRideRequest(false)
      setActiveRide(false)
    }
  }

  const acceptRide = () => {
    setHasRideRequest(false)
    setActiveRide(true)
  }

  const declineRide = () => {
    setHasRideRequest(false)
  }

  const completeRide = () => {
    setActiveRide(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="px-4 py-4">
          <header className="border-b sticky top-0 z-40 bg-background">
            <div className="flex h-14 items-center px-4">
              <Link href="/" className="mr-auto">
                <Button variant="ghost" className="p-0 h-9 w-9">
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">Back to Home</span>
                </Button>
              </Link>
              <h1 className="text-lg font-bold flex-1 text-center">Driver Dashboard</h1>
              <div className="ml-auto">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="Driver" />
                  <AvatarFallback>RD</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={isOnline ? "text-green-500 font-medium" : "text-muted-foreground"}>
                  {isOnline ? "Online" : "Offline"}
                </span>
                <Switch checked={isOnline} onCheckedChange={toggleOnline} />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Today's Earnings</p>
                <p className="text-xl font-bold">₱350.00</p>
              </div>
            </div>

            {hasRideRequest && (
              <Card className="mb-4 border-primary animate-pulse">
                <CardContent className="p-4">
                  <h2 className="text-lg font-medium mb-4">New Ride Request!</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" alt="Passenger" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">Juan Dela Cruz</h3>
                        <div className="flex items-center">
                          <span className="text-sm text-muted-foreground">Passenger Rating:</span>
                          <div className="flex items-center ml-1">
                            <span className="text-sm">4.7</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="rounded-full bg-primary/10 p-1 mr-2">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-sm">Pickup: Juan's Home</p>
                      </div>
                      <div className="border-l-2 h-4 ml-3"></div>
                      <div className="flex items-center">
                        <div className="rounded-full bg-primary/10 p-1 mr-2">
                          <Navigation className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-sm">Destination: Market</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-sm">Est. 10 min ride</span>
                      </div>
                      <span className="font-medium">₱25.00</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" onClick={declineRide}>
                        Decline
                      </Button>
                      <Button onClick={acceptRide}>Accept</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeRide && (
              <Card className="mb-4 border-primary">
                <CardContent className="p-4">
                  <h2 className="text-lg font-medium mb-4">Active Ride</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" alt="Passenger" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">Juan Dela Cruz</h3>
                        <p className="text-sm text-muted-foreground">Passenger</p>
                      </div>
                      <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                        <Phone className="h-4 w-4" />
                        <span className="sr-only">Call passenger</span>
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="rounded-full bg-primary/10 p-1 mr-2">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-sm">Pickup: Juan's Home</p>
                      </div>
                      <div className="border-l-2 h-4 ml-3"></div>
                      <div className="flex items-center">
                        <div className="rounded-full bg-primary/10 p-1 mr-2">
                          <Navigation className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-sm">Destination: Market</p>
                      </div>
                    </div>

                    <div className="relative h-40 rounded-lg overflow-hidden">
                      <Image src="/placeholder.svg?height=160&width=400" alt="Map view" fill className="object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-background/80 p-3 rounded-lg backdrop-blur-sm">
                          <p className="text-center text-sm font-medium">Navigation map will appear here</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-sm">Est. arrival: 5 mins</span>
                      </div>
                      <span className="font-medium">₱25.00</span>
                    </div>

                    <Button onClick={completeRide}>Complete Ride</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {!activeRide && !hasRideRequest && (
              <Tabs defaultValue="earnings" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="earnings">Earnings</TabsTrigger>
                  <TabsTrigger value="stats">Stats</TabsTrigger>
                  <TabsTrigger value="account">Account</TabsTrigger>
                </TabsList>

                <TabsContent value="earnings" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Completed Rides</span>
                          <span className="text-sm">14</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Hours Online</span>
                          <span className="text-sm">6.5</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Average Per Ride</span>
                          <span className="text-sm">₱25.00</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-3">Recent Earnings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b">
                          <div>
                            <p className="font-medium">Monday</p>
                            <p className="text-sm text-muted-foreground">March 1, 2025</p>
                          </div>
                          <span className="font-medium">₱300.00</span>
                        </div>
                        <div className="flex items-center justify-between pb-2 border-b">
                          <div>
                            <p className="font-medium">Sunday</p>
                            <p className="text-sm text-muted-foreground">February 28, 2025</p>
                          </div>
                          <span className="font-medium">₱250.00</span>
                        </div>
                        <div className="flex items-center justify-between pb-2 border-b">
                          <div>
                            <p className="font-medium">Saturday</p>
                            <p className="text-sm text-muted-foreground">February 27, 2025</p>
                          </div>
                          <span className="font-medium">₱400.00</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="stats" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-4">Performance Stats</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-primary/10 p-2">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">Passenger Rating</h4>
                              <span className="text-sm font-medium">4.8/5.0</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2 mt-1">
                              <div className="bg-primary h-2 rounded-full" style={{ width: "96%" }}></div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">On-Time Rate</h4>
                              <span className="text-sm font-medium">92%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2 mt-1">
                              <div className="bg-primary h-2 rounded-full" style={{ width: "92%" }}></div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-primary/10 p-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">Acceptance Rate</h4>
                              <span className="text-sm font-medium">88%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2 mt-1">
                              <div className="bg-primary h-2 rounded-full" style={{ width: "88%" }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-3">Activity Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Total Rides (This Month)</span>
                          <span className="text-sm">142</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Total Hours Online</span>
                          <span className="text-sm">68.5</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Busiest Day</span>
                          <span className="text-sm">Saturday</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Busiest Time</span>
                          <span className="text-sm">4:00 PM - 6:00 PM</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="account" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src="/placeholder.svg" alt="Driver" />
                          <AvatarFallback>RD</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">Ramon Dela Cruz</h3>
                          <p className="text-sm text-muted-foreground">Tricycle #123</p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              Verified Driver
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2 hover:bg-muted rounded-md active:bg-muted/80 touch-manipulation">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Settings className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Account Settings</h4>
                            <p className="text-sm text-muted-foreground">Update your profile and preferences</p>
                          </div>
                          <ChevronLeft className="h-4 w-4 rotate-180 ml-auto text-muted-foreground" />
                        </div>

                        <div className="flex items-center gap-3 p-2 hover:bg-muted rounded-md active:bg-muted/80 touch-manipulation">
                          <div className="rounded-full bg-primary/10 p-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Payment Information</h4>
                            <p className="text-sm text-muted-foreground">Manage your payment methods</p>
                          </div>
                          <ChevronLeft className="h-4 w-4 rotate-180 ml-auto text-muted-foreground" />
                        </div>

                        <div className="flex items-center gap-3 p-2 hover:bg-muted rounded-md active:bg-muted/80 touch-manipulation">
                          <div className="rounded-full bg-primary/10 p-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-5 w-5 text-primary"
                            >
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium">Vehicle Information</h4>
                            <p className="text-sm text-muted-foreground">Update your tricycle details</p>
                          </div>
                          <ChevronLeft className="h-4 w-4 rotate-180 ml-auto text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-3">Documents</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Driver's License</p>
                            <p className="text-xs text-green-600">Verified</p>
                          </div>
                          <Button variant="outline" size="sm" className="h-8 px-3">
                            View
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Vehicle Registration</p>
                            <p className="text-xs text-green-600">Verified</p>
                          </div>
                          <Button variant="outline" size="sm" className="h-8 px-3">
                            View
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Insurance</p>
                            <p className="text-xs text-yellow-600">Expires in 30 days</p>
                          </div>
                          <Button variant="outline" size="sm" className="h-8 px-3">
                            Update
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  )
}

