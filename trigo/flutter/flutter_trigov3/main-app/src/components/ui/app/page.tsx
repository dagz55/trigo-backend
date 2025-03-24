import Link from "next/link"
import { Search, Star, MapPin, Users, Clock, CloudLightningIcon as Lightning, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Logo } from "@/components/logo"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary px-4 py-6 text-white">
        <div className="container max-w-md mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Logo className="h-10 w-10" />
            <h1 className="text-3xl font-bold">TriGO</h1>
          </div>
          <p className="text-lg opacity-90">Your Community Ride</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-md mx-auto px-4 py-6 overflow-y-auto">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="Where to?"
            className="w-full h-12 pl-12 pr-4 rounded-full border-2 border-primary"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary h-5 w-5" />
        </div>

        {/* Ride Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link href="/signup?type=regular" className="block">
            <Card className="hover:border-primary transition-colors">
              <CardContent className="p-4 text-center">
                <div className="rounded-full bg-primary/10 p-3 mx-auto mb-2 w-fit">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Regular/Group</h3>
                <p className="text-sm text-muted-foreground">Share your ride</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/signup?type=special" className="block">
            <Card className="hover:border-primary transition-colors">
              <CardContent className="p-4 text-center">
                <div className="rounded-full bg-accent/10 p-3 mx-auto mb-2 w-fit">
                  <Star className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold">Special Ride</h3>
                <p className="text-sm text-muted-foreground">Private booking</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Leaderboard</h3>
                  <p className="text-sm text-muted-foreground">Top rated drivers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Lightning className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Quick Dispatch</h3>
                  <p className="text-sm text-muted-foreground">Instant booking</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Drivers */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Top Rated Drivers</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/placeholder.svg`} alt={`Driver ${i}`} />
                      <AvatarFallback>D{i}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Kuya Driver {i}</h3>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 text-sm">4.{9 - i}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Brgy. {i}</span>
                        <Clock className="h-4 w-4 mx-1" />
                        <span>{1000 - i * 100}+ trips</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Buttons */}
        <div className="grid gap-4">
          <Link href="/signup">
            <Button className="w-full h-12 text-lg bg-accent hover:bg-accent/90">Book a Ride</Button>
          </Link>
          <Link href="/signup?role=driver">
            <Button
              variant="outline"
              className="w-full h-12 text-lg border-primary text-primary hover:bg-primary hover:text-white"
            >
              Become a Driver
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary py-6 text-white">
        <div className="container max-w-md mx-auto px-4 text-center">
          <p className="text-sm opacity-90">© 2024 TriGO. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

