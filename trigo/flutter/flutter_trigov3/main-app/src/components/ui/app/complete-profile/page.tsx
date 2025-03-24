"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { auth, db } from "@/lib/firebase"
import { doc, setDoc } from "firebase/firestore"

export default function CompleteProfilePage() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState("passenger")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!auth.currentUser) {
      setError("No user is currently signed in.")
      return
    }

    try {
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        name,
        email: auth.currentUser.email,
        phone,
        role,
      })

      router.push(role === "driver" ? "/driver" : "/passenger")
    } catch (error) {
      setError("Failed to complete profile. Please try again.")
      console.error(error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 container max-w-md mx-auto p-4 flex items-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Complete Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>I want to sign up as a:</Label>
                <RadioGroup defaultValue="passenger" onValueChange={(value) => setRole(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="passenger" id="passenger" />
                    <Label htmlFor="passenger">Passenger</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="driver" id="driver" />
                    <Label htmlFor="driver">Driver</Label>
                  </div>
                </RadioGroup>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full">
                Complete Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

