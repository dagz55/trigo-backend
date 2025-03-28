import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, type NextResponse } from 'next/server';

// Define a return type that includes both response and supabase client
interface UpdateSessionResult {
  response: NextResponse;
  supabase: ReturnType<typeof createServerClient>;
}

export async function updateSession(request: NextRequest): Promise<UpdateSessionResult> { // Make it async
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Apply cookies to both request and response
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          // Apply cookies to both request and response
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Crucially, await the user fetch to ensure the session is refreshed before returning
  await supabase.auth.getUser()

  // Return both the response and the supabase client instance
  return { response, supabase }
} 