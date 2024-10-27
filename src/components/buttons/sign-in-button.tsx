'use client'

import { Button } from '@/components/ui/button'

export function SignInButton() {
  return (
    <Button onClick={() => console.log('Sign in clicked')}>
      Sign In
    </Button>
  )
}
