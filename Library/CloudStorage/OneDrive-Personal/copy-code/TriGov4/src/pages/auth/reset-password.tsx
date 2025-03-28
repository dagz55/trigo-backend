'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)
    try {
      // IMPORTANT: Ensure you have the email redirect configured in your Supabase project settings!
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // redirectTo: `${location.origin}/auth/update-password`, // URL to redirect to after email link is clicked
      })
      if (error) throw error
      setMessage('Check your email for the password reset link!')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h2 className="mb-6 text-2xl font-bold text-center">Reset Password</h2>
        <form onSubmit={handlePasswordReset}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
          {message && <p className="mb-4 text-sm text-green-500">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        {/* <p className="mt-4 text-sm text-center text-gray-600">
          Remembered your password? <a href="/auth/signin" className="text-blue-500 hover:underline">Sign In</a>
        </p> */}
      </div>
    </div>
  )
} 