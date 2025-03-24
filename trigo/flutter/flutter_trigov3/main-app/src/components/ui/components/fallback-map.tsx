import { MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FallbackMap() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="h-[300px] bg-gray-100 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-xs w-full">
          <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Location Services</h3>
          <p className="text-muted-foreground mb-4">
            We're unable to load the map at this time. You can still use the app without map functionality.
          </p>
          <div className="space-y-2">
            <Button variant="outline" className="w-full flex items-center justify-center">
              <MapPin className="h-4 w-4 mr-2" />
              Set Location Manually
            </Button>
            <Button className="w-full flex items-center justify-center">
              <Navigation className="h-4 w-4 mr-2" />
              Continue Without Map
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

