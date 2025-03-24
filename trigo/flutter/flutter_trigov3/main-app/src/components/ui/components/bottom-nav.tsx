"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Activity, Bell, User, Map } from "lucide-react"
import { useContainer } from "@/lib/container-context"

export function BottomNav() {
  const pathname = usePathname()
  const { containerType } = useContainer()

  // Base navigation items for all containers
  const baseNavItems = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/activity", label: "Activity", icon: Activity },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/profile", label: "Profile", icon: User },
  ]

  // Add container-specific items
  const navItems = [...baseNavItems]

  // Add dispatcher map only to dispatcher container
  if (containerType === "dispatcher") {
    navItems.push({ href: "/dispatcher", label: "Dispatch", icon: Map })
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-3 ${isActive ? "text-primary" : "text-gray-500"}`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

