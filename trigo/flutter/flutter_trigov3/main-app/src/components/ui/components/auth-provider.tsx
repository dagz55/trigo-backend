"use client"

import type React from "react"

import { useContainer } from "@/lib/container-context"
import { auth, db } from "@/lib/firebase"
import {
    FacebookAuthProvider,
    GoogleAuthProvider,
    type User,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"

interface UserData {
  role: "passenger" | "driver" | "dispatcher" | "admin"
  name: string
  email: string
  phone?: string
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string, role?: UserData['role']) => Promise<void>
  signUp: (email: string, password: string, userData: Omit<UserData, "email">) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithFacebook: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { containerType } = useContainer()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      setLoading(true)
      setError(null)

      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid))
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData)
          } else {
            // If user document doesn't exist, create a default one
            const defaultUserData: UserData = {
              name: user.displayName || user.email?.split("@")[0] || "User",
              email: user.email || "",
              role: "passenger", // Default role
            }

            // Try to create the user document
            try {
              await setDoc(doc(db, "users", user.uid), defaultUserData)
              setUserData(defaultUserData)
            } catch (docError) {
              console.warn("Could not create user document:", docError)
              // Still set the userData with default values so the user can proceed
              setUserData(defaultUserData)
            }
          }
        } catch (err) {
          console.warn("Error fetching user data:", err)
          // Create a default userData object to allow the user to proceed
          const defaultUserData: UserData = {
            name: user.displayName || user.email?.split("@")[0] || "User",
            email: user.email || "",
            role: "passenger", // Default role
          }
          setUserData(defaultUserData)
        }
      } else {
        setUserData(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string, role?: UserData['role']) => {
    try {
      setError(null)
      setLoading(true)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      try {
        // Try to get user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          const existingUserData = userDoc.data() as UserData;
          
          // If a role was specified during login and it differs from the stored role, update it
          if (role && role !== existingUserData.role) {
            const updatedUserData = {
              ...existingUserData,
              role: role
            };
            await setDoc(doc(db, "users", user.uid), updatedUserData);
            setUserData(updatedUserData);
          } else {
            setUserData(existingUserData);
          }
        } else {
          // If user document doesn't exist, create a default one with role specified or container type
          const defaultUserData: UserData = {
            name: user.displayName || email.split("@")[0],
            email: user.email || email,
            role: role || (containerType as "passenger" | "driver" | "dispatcher" | "admin"), // Use provided role or container type
          }

          // Try to create the user document
          try {
            await setDoc(doc(db, "users", user.uid), defaultUserData)
            setUserData(defaultUserData)
          } catch (docError) {
            console.warn("Could not create user document:", docError)
            // Still set the userData with default values so the user can proceed
            setUserData(defaultUserData)
          }
        }
      } catch (firestoreError) {
        console.warn("Firestore error:", firestoreError)
        // Create a default userData object to allow the user to proceed
        const defaultUserData: UserData = {
          name: user.displayName || email.split("@")[0],
          email: user.email || email,
          role: role || (containerType as "passenger" | "driver" | "dispatcher" | "admin"), // Use provided role or container type
        }
        setUserData(defaultUserData)
      }
    } catch (err: any) {
      console.error("Sign in error:", err)
      setError(err.message || "Failed to sign in")
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData: Omit<UserData, "email">) => {
    try {
      setError(null)
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        ...userData,
        email,
      })

      setUserData({ ...userData, email })
    } catch (err: any) {
      console.error("Sign up error:", err)
      setError(err.message || "Failed to sign up")
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      setError(null)
      setLoading(true)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid))

      if (!userDoc.exists()) {
        // Create a new user record if it doesn't exist
        const newUserData: UserData = {
          name: user.displayName || "User",
          email: user.email || "",
          role: "passenger", // Default role
        }

        await setDoc(doc(db, "users", user.uid), newUserData)
        setUserData(newUserData)
      } else {
        setUserData(userDoc.data() as UserData)
      }
    } catch (err: any) {
      console.error("Google sign in error:", err)

      // Provide a more helpful error message for unauthorized domain
      if (err.code === "auth/unauthorized-domain") {
        setError(
          "This domain is not authorized for authentication. Please use email/password sign-in instead, or try the app on its production domain.",
        )
      } else {
        setError(err.message || "Failed to sign in with Google")
      }

      // Re-throw the error so it can be caught by the component
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signInWithFacebook = async () => {
    try {
      setError(null)
      setLoading(true)
      const provider = new FacebookAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid))

      if (!userDoc.exists()) {
        // Create a new user record if it doesn't exist
        const newUserData: UserData = {
          name: user.displayName || "User",
          email: user.email || "",
          role: "passenger", // Default role
        }

        await setDoc(doc(db, "users", user.uid), newUserData)
        setUserData(newUserData)
      } else {
        setUserData(userDoc.data() as UserData)
      }
    } catch (err: any) {
      console.error("Facebook sign in error:", err)

      // Provide a more helpful error message for unauthorized domain
      if (err.code === "auth/unauthorized-domain") {
        setError(
          "This domain is not authorized for authentication. Please use email/password sign-in instead, or try the app on its production domain.",
        )
      } else {
        setError(err.message || "Failed to sign in with Facebook")
      }

      // Re-throw the error so it can be caught by the component
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (err: any) {
      console.error("Sign out error:", err)
      setError(err.message || "Failed to sign out")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        error,
        signIn,
        signUp,
        signInWithGoogle,
        signInWithFacebook,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

