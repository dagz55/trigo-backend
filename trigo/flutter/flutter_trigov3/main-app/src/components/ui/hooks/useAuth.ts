"use client"

import { useState, useEffect } from "react"
import type { User } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

interface UserData {
  role: "passenger" | "driver"
  name: string
  email: string
  phone: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user)
      setLoading(true)
      setError(null)

      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid))
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData)
          } else {
            setError("User data not found")
          }
        } catch (err) {
          console.error("Error fetching user data:", err)
          setError("Failed to fetch user data. Please check your internet connection.")
        }
      } else {
        setUserData(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { user, userData, loading, error }
}

