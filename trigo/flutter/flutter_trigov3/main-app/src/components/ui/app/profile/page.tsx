"use client"

import Link from "next/link"
import { User, Settings, CreditCard, HelpCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useContainer } from "@/lib/container-context"

export default function ProfilePage() {
  const { user, userData, logout } = useAuth()
  const { containerType } = useContainer()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/auth/login")
  }

  // Container-specific profile title
  let profileTitle = "Passenger Profile"
  if (containerType === "driver") {
    profileTitle = "Driver Profile"
  } else if (containerType === "dispatcher") {
    profileTitle = "Dispatcher Profile"
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{profileTitle}</h1>

        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback>{userData?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{userData?.name || "User"}</h2>
            <p className="text-sm text-muted-foreground">{userData?.email || user?.email}</p>
            <p className="text-xs text-muted-foreground capitalize mt-1">{userData?.role || containerType}</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <nav className="flex flex-col">
              <Link href="/profile/edit" className="flex items-center space-x-4 p-4 hover:bg-muted">
                <User className="h-5 w-5 text-primary" />
                <span>Edit Profile</span>
              </Link>
              <Link href="/profile/settings" className="flex items-center space-x-4 p-4 hover:bg-muted">
                <Settings className="h-5 w-5 text-primary" />
                <span>Settings</span>
              </Link>
              <Link href="/profile/payment" className="flex items-center space-x-4 p-4 hover:bg-muted">
                <CreditCard className="h-5 w-5 text-primary" />
                <span>Payment Methods</span>
              </Link>
              <Link href="/help" className="flex items-center space-x-4 p-4 hover:bg-muted">
                <HelpCircle className="h-5 w-5 text-primary" />
                <span>Help & Support</span>
              </Link>
            </nav>
          </CardContent>
        </Card>

        <Button variant="destructive" className="w-full mt-6" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </Button>
      </main>
    </div>
  )
}

