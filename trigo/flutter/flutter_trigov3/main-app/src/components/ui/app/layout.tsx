import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ServiceWorkerRegister } from "./sw-register"
import { OfflineNotice } from "@/components/offline-notice"
import { BottomNav } from "@/components/bottom-nav"
import { AuthProvider } from "@/components/auth-provider"
import { ContainerProvider } from "@/lib/container-context"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TriGO - Your Community Ride",
  description: "Safe and convenient tricycle rides in your community",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ContainerProvider>
          <AuthProvider>
            <OfflineNotice />
            <div className="flex flex-col min-h-screen">
              {children}
              <BottomNav />
            </div>
            <ServiceWorkerRegister />
          </AuthProvider>
        </ContainerProvider>
        <Analytics />
      </body>
    </html>
  )
}



import './globals.css'