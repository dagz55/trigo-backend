"use client"

import type React from "react"
import { useAuth } from "@/components/auth-provider"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { MobileNav } from "@/components/mobile-nav"
import { Logo } from "@/components/logo"

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, userData, loading, error } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!user) {
    return <>{children}</>
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-primary text-white py-2">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="font-bold text-xl">TriGO</span>
          </div>
          <MobileNav userRole={userData?.role} />
        </div>
      </header>
      <div className="pt-14 pb-16 min-h-screen">{children}</div>
    </>
  )
}

