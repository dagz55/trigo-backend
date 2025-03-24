import { PassengerBooking } from "@/components/passenger/passenger-booking"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Demo Mode</AlertTitle>
        <AlertDescription>
          This app is running in demo mode. All features are simulated and no real data is saved.
        </AlertDescription>
      </Alert>

      <h1 className="text-3xl font-bold mb-6">Book a Ride</h1>
      <PassengerBooking />
    </div>
  )
}

