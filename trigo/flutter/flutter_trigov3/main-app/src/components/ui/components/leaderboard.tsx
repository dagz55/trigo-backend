import { Trophy, Medal, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Driver {
  id: string
  name: string
  rating: number
  trips: number
  earnings: number
  avatar?: string
}

interface LeaderboardProps {
  timeframe: "daily" | "weekly" | "monthly"
  drivers: Driver[]
}

export function Leaderboard({ timeframe, drivers }: LeaderboardProps) {
  const getOrdinalSuffix = (i: number) => {
    const j = i % 10
    const k = i % 100
    if (j === 1 && k !== 11) return "st"
    if (j === 2 && k !== 12) return "nd"
    if (j === 3 && k !== 13) return "rd"
    return "th"
  }

  const getMedalColor = (position: number) => {
    switch (position) {
      case 1:
        return "text-yellow-400"
      case 2:
        return "text-gray-400"
      case 3:
        return "text-amber-700"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <span>Driver Leaderboard</span>
          <span className="text-sm font-normal text-muted-foreground ml-auto">
            {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {drivers.map((driver, index) => (
            <div key={driver.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className={`flex items-center justify-center w-8 ${getMedalColor(index + 1)}`}>
                {index < 3 ? (
                  <Medal className="h-6 w-6" />
                ) : (
                  <span className="font-semibold">
                    {index + 1}
                    {getOrdinalSuffix(index + 1)}
                  </span>
                )}
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage src={driver.avatar || "/placeholder.svg"} alt={driver.name} />
                <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{driver.name}</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 text-sm">{driver.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>{driver.trips} trips</span>
                  <span className="mx-2">•</span>
                  <span>₱{driver.earnings.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

