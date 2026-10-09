import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    // Check for admin session via cookie
    const adminSession = request.cookies.get('admin-session')
    if (!adminSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Protected customer routes
  if (pathname.startsWith('/account')) {
    const session = await auth()
    if (!session?.user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
  ],
}
