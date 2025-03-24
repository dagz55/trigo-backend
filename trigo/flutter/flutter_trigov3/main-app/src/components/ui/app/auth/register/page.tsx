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
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth"
import { auth, db } from "@/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState<"passenger" | "driver">("passenger")
  const [rememberMe, setRememberMe] = useState(false)
  const [localError, setLocalError] = useState("")
  const router = useRouter()
  const {
    signUp,
    signInWithGoogle: originalSignInWithGoogle,
    signInWithFacebook: originalSignInWithFacebook,
    error,
    loading,
    userData,
  } = useAuth()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")

    try {
      await signUp(email, password, {
        name,
        phone,
        role,
      })
      // Router will navigate based on user role after successful registration
    } catch (error: any) {
      setLocalError(error.message || "Failed to create an account. Please try again.")
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

      // Router will navigate based on user role after successful login
    } catch (error: any) {
      console.error(`Error signing in: ${error.message}`, error)

      // Provide a more helpful error message for unauthorized domain
      if (error.code === "auth/unauthorized-domain") {
        setLocalError(
          "This domain is not authorized for authentication. Please use email/password sign-in instead, or try the app on its production domain.",
        )
      } else {
        setLocalError(`Failed to sign in: ${error.message}`)
      }
    }
  }

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider()
    handleSocialSignIn(provider)
  }

  const signInWithFacebook = () => {
    const provider = new FacebookAuthProvider()
    handleSocialSignIn(provider)
  }

  // Redirect based on user role
  if (userData) {
    if (userData.role === "driver") {
      router.push("/driver")
    } else if (userData.role === "dispatcher") {
      router.push("/dispatcher")
    } else if (userData.role === "admin") {
      router.push("/admin")
    } else {
      router.push("/passenger")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Logo className="h-16 w-16 mx-auto" />
          </Link>
          <h2 className="mt-6 text-3xl font-bold tracking-tight">Create your account</h2>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
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
                  <Label htmlFor="email">Email address</Label>
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
                  <Label htmlFor="phone">Phone Number</Label>
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
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
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

              {(error || localError) && <p className="text-sm text-red-500 text-center">{error || localError}</p>}

              <Button type="submit" className="w-full h-12" disabled={loading}>
                {loading ? "Creating account..." : "Sign up"}
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
                <Button type="button" variant="outline" className="h-12" onClick={signInWithGoogle} disabled={loading}>
                  <Image src="/google.svg" alt="Google" width={20} height={20} className="mr-2" />
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12"
                  onClick={signInWithFacebook}
                  disabled={loading}
                >
                  <Image src="/facebook.svg" alt="Facebook" width={20} height={20} className="mr-2" />
                  Facebook
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-primary hover:text-primary/80">
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
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

