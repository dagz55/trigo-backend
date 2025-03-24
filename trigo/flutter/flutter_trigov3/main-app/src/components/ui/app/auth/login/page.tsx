"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [localError, setLocalError] = useState("")
  const [selectedRole, setSelectedRole] = useState("passenger")
  const router = useRouter()
  const { signIn, signInWithGoogle, signInWithFacebook, error, loading, userData } = useAuth()

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")

    try {
      await signIn(email, password, selectedRole)
      // Router will navigate based on user role after successful login
    } catch (error: any) {
      setLocalError(error.message || "Failed to log in. Please check your credentials and try again.")
    }
  }

  // Update the Google and Facebook sign-in handlers to better handle the unauthorized domain error
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      // Navigation will be handled by the auth state change in the provider
    } catch (error: any) {
      console.error("Error signing in with Google", error)

      // Provide a more helpful error message for unauthorized domain
      if (error.code === "auth/unauthorized-domain") {
        setLocalError(
          "This domain is not authorized for authentication. Please use email/password sign-in instead, or try the app on its production domain.",
        )
      } else {
        setLocalError(error.message || "Failed to sign in with Google. Please try again.")
      }
    }
  }

  const handleFacebookSignIn = async () => {
    try {
      await signInWithFacebook()
      // Navigation will be handled by the auth state change in the provider
    } catch (error: any) {
      console.error("Error signing in with Facebook", error)

      // Provide a more helpful error message for unauthorized domain
      if (error.code === "auth/unauthorized-domain") {
        setLocalError(
          "This domain is not authorized for authentication. Please use email/password sign-in instead, or try the app on its production domain.",
        )
      } else {
        setLocalError(error.message || "Failed to sign in with Facebook. Please try again.")
      }
    }
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
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 container max-w-md mx-auto p-4 flex items-center">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Logo className="h-16 w-16" />
            </div>
            <CardTitle className="text-2xl">Log In to TriGo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Login as</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passenger">Passenger</SelectItem>
                    <SelectItem value="driver">Driver/Rider</SelectItem>
                    <SelectItem value="dispatcher">Dispatcher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
              {(error || localError) && <p className="text-red-500 text-sm">{error || localError}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
              </Button>
            </form>
            <div className="mt-4">
              <Button onClick={handleGoogleSignIn} variant="outline" className="w-full mb-2" disabled={loading}>
                <Image src="/google.svg" alt="Google" width={20} height={20} className="mr-2" />
                Sign in with Google
              </Button>
              <Button onClick={handleFacebookSignIn} variant="outline" className="w-full" disabled={loading}>
                <Image src="/facebook.svg" alt="Facebook" width={20} height={20} className="mr-2" />
                Sign in with Facebook
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
              Forgot your password?
            </Link>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

