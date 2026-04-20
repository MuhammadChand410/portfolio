import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const User_Roles: Record<string, string[]> = {
  super_admin: ["/admin/dashboard", "/admin/services", "/admin/projects", "/admin/roles", "/admin/testimonials", "/admin/contact-queries", "/admin/notifications"],
  support_staff: ["/admin/contact-queries", "/admin/notifications"],
  content_creator: ["/admin/projects", "/admin/testimonials"],
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const role = request.cookies.get('role')?.value
  const { pathname } = request.nextUrl

  // console.log(`[middleware] path=${pathname} token=${!!token} rawRole=${rawRole} role=${role}`)

  const isAuthPage = pathname.startsWith('/admin/login')
  const isAdminPage = pathname.startsWith('/admin')

  if (!isAdminPage) return NextResponse.next()

  // No token → redirect to login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Has token → redirect away from login
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  // Role-based access check
  if (token && !isAuthPage) {
    // No role or unknown role → deny access
    if (!role || !User_Roles[role]) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    const allowedPaths = User_Roles[role]
    const isAllowed = allowedPaths.some((route) => pathname.startsWith(route))

    if (!isAllowed && role === 'content_creator') {
      return NextResponse.redirect(new URL('/admin/projects', request.url))
    }
    if (!isAllowed && role === 'support_staff') {
      return NextResponse.redirect(new URL('/admin/contact-queries', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
