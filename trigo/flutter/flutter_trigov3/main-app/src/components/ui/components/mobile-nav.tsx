"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MapPin, Clock, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  userRole?: "passenger" | "driver"
}

export function MobileNav({ userRole }: MobileNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      active: pathname === "/",
    },
    {
      label: userRole === "driver" ? "Drive" : "Book",
      href: userRole === "driver" ? "/driver" : "/passenger",
      icon: userRole === "driver" ? Clock : MapPin,
      active: pathname === (userRole === "driver" ? "/driver" : "/passenger"),
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User,
      active: pathname === "/profile",
    },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b flex items-center justify-around h-14 px-2">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full text-xs",
            item.active ? "text-primary" : "text-muted-foreground",
          )}
        >
          <item.icon className="h-5 w-5 mb-1" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}

