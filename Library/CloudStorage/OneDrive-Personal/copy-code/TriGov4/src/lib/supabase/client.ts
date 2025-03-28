import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Check if environment variables are set and not just placeholders
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Validate credentials before trying to create client
  if (!supabaseUrl || !supabaseKey || 
      supabaseUrl === 'your-project-url' || 
      supabaseUrl === 'https://example.supabase.co' ||
      supabaseKey === 'your-anon-key' ||
      supabaseKey === 'example-anon-key-long-string-that-is-not-a-placeholder') {
    // In development, return a mock client that doesn't throw errors
    if (process.env.NODE_ENV === 'development') {
      return createMockClient()
    }
    
    // In production, we still throw an error
    throw new Error('Invalid Supabase credentials')
  }
  
  // Create a real supabase client with valid credentials
  return createBrowserClient(supabaseUrl, supabaseKey)
}

// Simple mock client that returns empty data and doesn't throw errors
function createMockClient() {
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: (callback: any) => {
        // Return a no-op function as the unsubscribe
        return () => {}
      },
      signOut: () => Promise.resolve({ error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null }, error: null }),
      resetPasswordForEmail: () => Promise.resolve({ data: {}, error: null })
    }
  } as any
} 