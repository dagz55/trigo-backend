"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { signIn, signInWithGoogle, signInWithFacebook } = useAuth()

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await signIn(email, password)
      // Navigation will be handled by the auth state change in the provider
    } catch (error: any) {
      setError(error.message || "Failed to log in. Please check your credentials and try again.")
      console.error(error)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      // Navigation will be handled by the auth state change in the provider
    } catch (error: any) {
      console.error("Error signing in with Google", error)
      setError(error.message || "Failed to sign in with Google. Please try again.")
    }
  }

  const handleFacebookSignIn = async () => {
    try {
      await signInWithFacebook()
      // Navigation will be handled by the auth state change in the provider
    } catch (error: any) {
      console.error("Error signing in with Facebook", error)
      setError(error.message || "Failed to sign in with Facebook. Please try again.")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 container max-w-md mx-auto p-4 flex items-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Log In to TriGo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
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
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full">
                Log In
              </Button>
            </form>
            <div className="mt-4">
              <Button onClick={handleGoogleSignIn} variant="outline" className="w-full mb-2">
                Sign in with Google
              </Button>
              <Button onClick={handleFacebookSignIn} variant="outline" className="w-full">
                Sign in with Facebook
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot your password?
            </Link>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

