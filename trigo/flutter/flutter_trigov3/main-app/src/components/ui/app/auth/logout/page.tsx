"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Spinner } from "@/components/ui/spinner"

export default function LogoutPage() {
  const { logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const performLogout = async () => {
      await logout()
      router.push("/auth/login")
    }

    performLogout()
  }, [logout, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Spinner className="mb-4" />
      <p>Logging out...</p>
    </div>
  )
}

