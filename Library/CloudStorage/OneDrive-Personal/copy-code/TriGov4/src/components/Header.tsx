'use client'

import { createClient } from '@/lib/supabase/client'
import { type User } from '@supabase/supabase-js'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Check if environment variables are set to more than placeholder values
  const hasValidSupabaseConfig = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-project-url' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-anon-key'

  useEffect(() => {
    async function getUser() {
      // Only attempt to create a Supabase client if we have valid credentials
      if (!hasValidSupabaseConfig) {
        setLoading(false)
        setError('Supabase credentials not configured')
        return
      }
      
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (err) {
        setError('Failed to fetch user')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Only set up auth listener if we have valid credentials
    let authUnsubscribe: (() => void) | undefined
    
    if (hasValidSupabaseConfig) {
      try {
        const supabase = createClient()
        // The function returned by onAuthStateChange is the unsubscribe function
        authUnsubscribe = supabase.auth.onAuthStateChange((event, session) => {
          setUser(session?.user ?? null)
          setLoading(false)
        })
      } catch (err) {
        console.error(err)
      }
    }

    return () => {
      // Call the unsubscribe function directly
      if (authUnsubscribe) authUnsubscribe()
    }
  }, [hasValidSupabaseConfig])

  const handleSignOut = async () => {
    if (!hasValidSupabaseConfig) return
    
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch (err) {
      console.error(err)
    }
  }

  // Basic header styling - can be customized
  const headerStyle = "bg-gray-800 text-white p-4 flex justify-between items-center"
  const linkStyle = "hover:text-gray-300"
  const buttonStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  const emailStyle = "mr-4 truncate max-w-[150px] md:max-w-[250px]"

  if (loading) {
    // Optional: Render a loading state or null
    return <header className={headerStyle}><div className="animate-pulse">Loading...</div></header>
  }

  // Show a minimal header if Supabase is not configured
  if (!hasValidSupabaseConfig) {
    return (
      <header className={headerStyle}>
        <div>
          <Link href="/" className={linkStyle}>My App</Link>
        </div>
        <div>
          <span className="text-amber-400">⚠️ Supabase not configured</span>
        </div>
      </header>
    )
  }

  return (
    <header className={headerStyle}>
      <div>
        {/* Replace with your App Logo/Name */}
        <Link href="/" className={linkStyle}>My App</Link>
      </div>
      <div>
        {user ? (
          <div className="flex items-center">
            <span className={emailStyle} title={user.email}>{user.email}</span>
            <button onClick={handleSignOut} className={buttonStyle}>Sign Out</button>
          </div>
        ) : (
          <Link href="/auth/signin" className={buttonStyle}>Sign In</Link>
        )}
      </div>
    </header>
  )
} 