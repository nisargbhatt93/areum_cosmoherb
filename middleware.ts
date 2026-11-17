import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin route protection - exclude /admin/login from redirect loop
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Check for admin session via cookie
    const adminSession = request.cookies.get('admin-session')
    if (!adminSession?.value) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Protected customer routes
  if (pathname.startsWith('/account')) {
    const sessionCookie =
      request.cookies.get('authjs.session-token') ||
      request.cookies.get('__Secure-authjs.session-token') ||
      request.cookies.get('next-auth.session-token') ||
      request.cookies.get('__Secure-next-auth.session-token')

    if (!sessionCookie?.value) {
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
