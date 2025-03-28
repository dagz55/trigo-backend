import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // update user's auth session and get the response and supabase instance
  const { response, supabase } = await updateSession(request)

  // Check if user is authenticated using the returned supabase instance
  const { data: { user } } = await supabase.auth.getUser()

  // Define protected routes
  const protectedRoutes = [
    '/',
    '/dashboard',
    '/profile',
    '/settings'
  ]

  const requestedPath = request.nextUrl.pathname

  // If user is not authenticated and tries to access a protected route,
  // redirect to the sign-in page.
  if (!user && protectedRoutes.some(path => requestedPath.startsWith(path))) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/signin'
    // url.searchParams.set('redirectedFrom', requestedPath)
    return NextResponse.redirect(url)
  }

  // If user is authenticated and tries to access auth pages,
  // redirect to the dashboard or home page.
  if (user && requestedPath.startsWith('/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = '/' // Or '/dashboard' based on your app flow
    return NextResponse.redirect(url)
  }

  // Return the response object obtained from updateSession
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*) ',
  ],
} 