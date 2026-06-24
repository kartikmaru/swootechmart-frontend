// Next.js Edge Middleware — route protection
// In cross-origin deployments (Vercel frontend + Render backend), the httpOnly
// cookie "jwt" is set on the backend domain and is NOT accessible here.
// We check the cookie (works on localhost) and also read a non-httpOnly
// "auth_token" cookie that the login page sets for middleware visibility.
// If neither exists, redirect to /login.

import { NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/checkout', '/profile', '/orders'];

export function middleware(request) {
    const { pathname } = request.nextUrl;

    if (!PROTECTED_ROUTES.includes(pathname)) {
        return NextResponse.next();
    }

    // Check httpOnly jwt cookie (works on localhost / same-domain)
    const jwtCookie = request.cookies.get('jwt')?.value || null

    // Check non-httpOnly auth_token cookie set by client-side login for middleware visibility
    const authToken = request.cookies.get('auth_token')?.value || null

    const isAuthenticated = !!(jwtCookie || authToken)

    if (!isAuthenticated) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)   // redirect back after login
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/checkout', '/profile', '/orders'],
};
