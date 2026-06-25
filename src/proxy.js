// src/proxy.js — Next.js 16 Edge Proxy (replaces deprecated middleware.js)
//
// Next.js 16 renamed "middleware" convention to "proxy".
// File MUST be at src/proxy.js (or root proxy.js if no src/).
// Export name MUST be 'proxy'.
//
// COOKIE STRATEGY FOR CROSS-ORIGIN (Vercel frontend + Render backend):
//   'jwt'        → httpOnly cookie set by Render backend (NOT readable on Vercel domain)
//   'auth_token' → non-httpOnly cookie set by login page on Vercel domain — READABLE HERE

import { NextResponse } from 'next/server'

export function proxy(request) {
    const { pathname } = request.nextUrl

    const jwtToken  = request.cookies.get('jwt')?.value ?? null
    const authToken = request.cookies.get('auth_token')?.value ?? null
    const token     = jwtToken || authToken
    const isAuthenticated = typeof token === 'string' && token.length > 20

    if (!isAuthenticated) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/checkout/:path*',
        '/profile/:path*',
        '/orders/:path*',
    ],
}
