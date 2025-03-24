"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { auth, db } from "@/lib/firebase"
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  type AuthError,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState("passenger")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      if (!auth) {
        throw new Error("Firebase auth is not initialized")
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        phone,
        role,
      })

      router.push(role === "driver" ? "/driver" : "/passenger")
    } catch (error) {
      const authError = error as AuthError
      console.error("Signup error:", authError)
      if (authError.code === "auth/invalid-api-key") {
        setError("There's an issue with our authentication service. Please try again later or contact support.")
      } else if (authError.code === "auth/email-already-in-use") {
        setError("An account with this email already exists. Please try logging in instead.")
      } else {
        setError(`Failed to create an account: ${authError.message}`)
      }
    }
  }

  // Update the handleSocialSignIn function to better handle the unauthorized domain error
  const handleSocialSignIn = async (provider: GoogleAuthProvider | FacebookAuthProvider) => {
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      const userDoc = await getDoc(doc(db, "users", user.uid))

      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          phone: user.phoneNumber || "",
          role,
        })
      }

      router.push(role === "driver" ? "/driver" : "/passenger")
    } catch (error: any) {
      console.error(`Error signing in: ${error.message}`, error)

      // Provide a more helpful error message for unauthorized domain
      if (error.code === "auth/unauthorized-domain") {
        setError(
          "This domain is not authorized for authentication. Please use email/password sign-in instead, or try the app on its production domain.",
        )
      } else {
        setError(`Failed to sign in: ${error.message}`)
      }
    }
  }

  const handleGoogleSignIn = () => handleSocialSignIn(new GoogleAuthProvider())
  const handleFacebookSignIn = () => handleSocialSignIn(new FacebookAuthProvider())

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Logo className="h-16 w-16 mx-auto" />
          </Link>
          <h2 className="mt-6 text-3xl font-bold tracking-tight">Create your account</h2>
        </div>

        <form onSubmit={handleSignup} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Label htmlFor="name" className="sr-only">
                Full Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
                className="h-12"
              />
            </div>
            <div>
              <Label htmlFor="email" className="sr-only">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="h-12"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="sr-only">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                required
                className="h-12"
              />
            </div>
            <div className="relative">
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="h-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember-me" className="ml-2 text-sm">
                  Remember me
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sign up as:</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={role === "passenger" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setRole("passenger")}
                >
                  Passenger
                </Button>
                <Button
                  type="button"
                  variant={role === "driver" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setRole("driver")}
                >
                  Driver
                </Button>
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <Button type="submit" className="w-full h-12">
            Sign up
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-50 px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid gap-3">
            <Button type="button" variant="outline" className="h-12" onClick={handleGoogleSignIn}>
              <Image src="/google.svg" alt="Google" width={20} height={20} className="mr-2" />
              Google
            </Button>
            <Button type="button" variant="outline" className="h-12" onClick={handleFacebookSignIn}>
              <Image src="/facebook.svg" alt="Facebook" width={20} height={20} className="mr-2" />
              Facebook
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:text-primary/80">
            Sign in
          </Link>
        </p>

        <p className="text-center text-xs text-gray-500">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}

