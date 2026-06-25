// src/proxy.js — Next.js 16.2.1 Edge Proxy
//
// Next.js 16 uses "proxy" convention — this file replaces middleware.js.
// Export name MUST be 'proxy' (not 'middleware').
// File MUST be at src/proxy.js (or root proxy.js if no src/).
//
// COOKIE STRATEGY FOR CROSS-ORIGIN (Vercel frontend + Render backend):
//
//   'jwt'        → httpOnly cookie set by Render backend on *.onrender.com
//                  NOT readable here (Vercel domain) — only works on localhost
//
//   'auth_token' → non-httpOnly cookie set by login/verify-otp page on the
//                  Vercel domain via document.cookie — READABLE HERE ✓
//                  Set at login:  document.cookie = `auth_token=${token}; path=/; ...`
//                  Cleared at logout: document.cookie = 'auth_token=; path=/; max-age=0'

import { NextResponse } from 'next/server'

export function proxy(request) {
    const { pathname } = request.nextUrl

    // 1. httpOnly jwt cookie — works on localhost / same-origin
    const jwtToken  = request.cookies.get('jwt')?.value ?? null

    // 2. Non-httpOnly auth_token — works cross-origin on Vercel domain
    const authToken = request.cookies.get('auth_token')?.value ?? null

    const token = jwtToken || authToken

    // Basic presence check — full JWT verification is done by the backend
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
