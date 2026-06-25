import { client } from "@/utils/Helper";
import { cookies } from "next/headers";

// ── getMe — Server-side user fetch ────────────────────────────────────────────
//
// COOKIE STRATEGY IN CROSS-ORIGIN DEPLOYMENT (Vercel + Render):
//
//   'jwt'        → httpOnly cookie set by Render backend on *.onrender.com
//                  NOT accessible here (Vercel domain) — only works localhost
//
//   'auth_token' → non-httpOnly cookie set by login/verify-otp page on Vercel
//                  domain via document.cookie → ACCESSIBLE HERE ✓
//                  This is the token we use for server-side API calls
//
// The login page sets: document.cookie = `auth_token=${token}; path=/; ...`
// That cookie lives on the Vercel domain → Next.js cookies() can read it

async function getMe() {
    try {
        const cookieStore = await cookies()

        // Try 'auth_token' first — this is set by the login page on the frontend domain
        // and IS accessible in server components on the same domain (Vercel)
        const authToken  = cookieStore.get("auth_token")?.value ?? null

        // Try 'jwt' as fallback — works on localhost where frontend + backend are same origin
        const jwtToken   = cookieStore.get("jwt")?.value ?? null

        const token = authToken || jwtToken

        if (!token) {
            // No token found — user is not logged in or cookie has expired
            return { user: null }
        }

        const response = await client.get("User/get", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            // withCredentials already set on client instance, but explicit here
            withCredentials: true,
        })

        if (!response.data.success) {
            return { user: null }
        }

        return response.data

    } catch (error) {
        // Log non-401 errors (401 just means not logged in — expected)
        if (error?.response?.status !== 401) {
            console.error('[serverAPI/getMe]', error?.response?.status, error?.message)
        }
        return { user: null }
    }
}

export { getMe }
