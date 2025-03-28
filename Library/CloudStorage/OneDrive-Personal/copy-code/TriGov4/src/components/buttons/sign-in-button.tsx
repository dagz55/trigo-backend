'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function SignInButton() {
  return (
    <Button asChild>
      <Link href="/sign-in">
        Sign In
      </Link>
    </Button>
  )
}

export default SignInButton 