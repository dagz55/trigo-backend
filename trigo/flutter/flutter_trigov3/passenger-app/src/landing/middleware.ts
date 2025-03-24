import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // In demo mode, we'll just let all requests through
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth"],
}

