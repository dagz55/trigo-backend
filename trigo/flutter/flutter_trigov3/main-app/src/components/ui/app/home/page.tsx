"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useContainer } from "@/lib/container-context"
import { Spinner } from "@/components/ui/spinner"

export default function HomePage() {
  const { containerType } = useContainer()
  const router = useRouter()

  useEffect(() => {
    // Redirect to the appropriate home page based on container type
    if (containerType === "passenger") {
      router.push("/passenger")
    } else if (containerType === "driver") {
      router.push("/driver")
    } else if (containerType === "dispatcher") {
      router.push("/dispatcher")
    }
  }, [containerType, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner className="h-8 w-8" />
      <span className="ml-2">Loading...</span>
    </div>
  )
}

