"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Users, MapPin, TrendingUp, AlertCircle, Settings, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminDashboard() {
  const [selectedCommunity, setSelectedCommunity] = useState("all")

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select community" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Communities</SelectItem>
                <SelectItem value="barangay-san-isidro">Barangay San Isidro</SelectItem>
                <SelectItem value="sitio-maunlad">Sitio Maunlad</SelectItem>
                <SelectItem value="purok-pagkakaisa">Purok Pagkakaisa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">+3 new this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
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
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₱31,250</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
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
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2a8 8 0 0 0-8 8c0 1.5.5 2.5 1.5 3.5L12 22l6.5-8.5c1-1 1.5-2 1.5-3.5a8 8 0 0 0-8-8" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8/5.0</div>
                <p className="text-xs text-muted-foreground">+0.2 from last month</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="drivers">Drivers</TabsTrigger>
              <TabsTrigger value="passengers">Passengers</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative h-[400px] rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=400&width=800"
                      alt="Activity map"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-background/80 p-4 rounded-lg backdrop-blur-sm">
                        <p className="text-center font-medium">Community activity map will appear here</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New driver registered</p>
                          <p className="text-xs text-muted-foreground">Pedro Santos joined as a driver</p>
                        </div>
                        <p className="text-xs text-muted-foreground">2h ago</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <AlertCircle className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Issue reported</p>
                          <p className="text-xs text-muted-foreground">Payment issue with Tricycle #456</p>
                        </div>
                        <p className="text-xs text-muted-foreground">4h ago</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New route added</p>
                          <p className="text-xs text-muted-foreground">Market to School route is now available</p>
                        </div>
                        <p className="text-xs text-muted-foreground">6h ago</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Settings className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">System update</p>
                          <p className="text-xs text-muted-foreground">App version 1.2.3 deployed</p>
                        </div>
                        <p className="text-xs text-muted-foreground">12h ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Popular Routes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Home to Market</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>Barangay San Isidro</span>
                          </div>
                        </div>
                        <div className="text-sm font-medium">248 rides</div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">School to Community Center</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>Sitio Maunlad</span>
                          </div>
                        </div>
                        <div className="text-sm font-medium">186 rides</div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Health Center to Plaza</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>Purok Pagkakaisa</span>
                          </div>
                        </div>
                        <div className="text-sm font-medium">142 rides</div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Market to Church</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>Barangay San Isidro</span>
                          </div>
                        </div>
                        <div className="text-sm font-medium">98 rides</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="drivers" className="space-y-4">
              <div className="flex items-center justify-between">
                <Input placeholder="Search drivers..." className="max-w-sm" />
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">ID</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Community</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Rating</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg" alt="Driver" />
                                <AvatarFallback>RD</AvatarFallback>
                              </Avatar>
                              <span>Ramon Dela Cruz</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">Tricycle #123</td>
                          <td className="p-4 align-middle">Barangay San Isidro</td>
                          <td className="p-4 align-middle">4.8</td>
                          <td className="p-4 align-middle">
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-500 text-primary-foreground">
                              Active
                            </span>
                          </td>
                          <td className="p-4 align-middle">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg" alt="Driver" />
                                <AvatarFallback>JR</AvatarFallback>
                              </Avatar>
                              <span>Juan Reyes</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">Tricycle #456</td>
                          <td className="p-4 align-middle">Sitio Maunlad</td>
                          <td className="p-4 align-middle">4.6</td>
                          <td className="p-4 align-middle">
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-500 text-primary-foreground">
                              Active
                            </span>
                          </td>
                          <td className="p-4 align-middle">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg" alt="Driver" />
                                <AvatarFallback>MS</AvatarFallback>
                              </Avatar>
                              <span>Maria Santos</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">Tricycle #789</td>
                          <td className="p-4 align-middle">Purok Pagkakaisa</td>
                          <td className="p-4 align-middle">4.9</td>
                          <td className="p-4 align-middle">
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-500 text-primary-foreground">
                              Active
                            </span>
                          </td>
                          <td className="p-4 align-middle">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                        <tr className="transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg" alt="Driver" />
                                <AvatarFallback>PS</AvatarFallback>
                              </Avatar>
                              <span>Pedro Santos</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">Tricycle #101</td>
                          <td className="p-4 align-middle">Barangay San Isidro</td>
                          <td className="p-4 align-middle">New</td>
                          <td className="p-4 align-middle">
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-yellow-500 text-primary-foreground">
                              Pending
                            </span>
                          </td>
                          <td className="p-4 align-middle">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="passengers" className="space-y-4">
              <div className="flex items-center justify-between">
                <Input placeholder="Search passengers..." className="max-w-sm" />
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Community</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Total Rides</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Last Active</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg" alt="Passenger" />
                                <AvatarFallback>JD</AvatarFallback>
                              </Avatar>
                              <span>Juan Dela Cruz</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">Barangay San Isidro</td>
                          <td className="p-4 align-middle">42</td>
                          <td className="p-4 align-middle">Today</td>
                          <td className="p-4 align-middle">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg" alt="Passenger" />
                                <AvatarFallback>MR</AvatarFallback>
                              </Avatar>
                              <span>Maria Reyes</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">Sitio Maunlad</td>
                          <td className="p-4 align-middle">28</td>
                          <td className="p-4 align-middle">Yesterday</td>
                          <td className="p-4 align-middle">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg" alt="Passenger" />
                                <AvatarFallback>PG</AvatarFallback>
                              </Avatar>
                              <span>Pedro Garcia</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">Purok Pagkakaisa</td>
                          <td className="p-4 align-middle">15</td>
                          <td className="p-4 align-middle">3 days ago</td>
                          <td className="p-4 align-middle">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                        <tr className="transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg" alt="Passenger" />
                                <AvatarFallback>LS</AvatarFallback>
                              </Avatar>
                              <span>Lucia Santos</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">Barangay San Isidro</td>
                          <td className="p-4 align-middle">8</td>
                          <td className="p-4 align-middle">1 week ago</td>
                          <td className="p-4 align-middle">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Rides by Day</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] relative">
                      <Image src="/placeholder.svg?height=200&width=300" alt="Chart" fill className="object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-background/80 p-2 rounded-lg backdrop-blur-sm">
                          <p className="text-center text-xs">Chart will appear here</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Revenue by Community</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] relative">
                      <Image src="/placeholder.svg?height=200&width=300" alt="Chart" fill className="object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-background/80 p-2 rounded-lg backdrop-blur-sm">
                          <p className="text-center text-xs">Chart will appear here</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">User Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] relative">
                      <Image src="/placeholder.svg?height=200&width=300" alt="Chart" fill className="object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-background/80 p-2 rounded-lg backdrop-blur-sm">
                          <p className="text-center text-xs">Chart will appear here</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Issues Reported</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="rounded-full bg-red-100 p-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Payment Issue</h4>
                          <span className="text-xs text-muted-foreground">4h ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Passenger reported payment issue with Tricycle #456
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            Dismiss
                          </Button>
                          <Button size="sm">Resolve</Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="rounded-full bg-yellow-100 p-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Driver Behavior</h4>
                          <span className="text-xs text-muted-foreground">1d ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Complaint about driver behavior for Tricycle #789
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

