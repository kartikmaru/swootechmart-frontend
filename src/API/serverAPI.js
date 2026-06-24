import { client } from "@/utils/Helper";
import { cookies } from "next/headers";

async function getMe() {
    try {
        // In production, frontend (Vercel) and backend (Render) are on different domains.
        // The httpOnly cookie set by the backend lives on the backend domain — Next.js
        // server-side cookies() can only see cookies on the frontend domain, so in
        // cross-origin deployments the cookie will always be missing here.
        // We read it anyway (it works on localhost), then fall back to Authorization header.

        const cookieStore = await cookies()
        const cookieToken = cookieStore.get("jwt")?.value ?? null

        const headers = {}

        if (cookieToken) {
            // Localhost / same-origin: use cookie token directly
            headers['Authorization'] = `Bearer ${cookieToken}`
        }
        // Note: for cross-origin production, the Authorization header will be set
        // automatically by the axios client interceptor via localStorage — but since
        // getMe() runs server-side (Next.js RSC / layout), we cannot access localStorage here.
        // The production auth flow therefore relies on the token passed via the client-side
        // axios interceptor for client components, and the getMe() server call returns null
        // for unauthenticated users in production until a session cookie is available.

        if (!cookieToken) {
            // No token available server-side — client components will handle auth via axios interceptor
            return { user: null }
        }

        const response = await client.get("User/get", {
            headers
        })

        if (!response.data.success) {
            throw new Error(response.data.msg || "API FAIL")
        }

        return response.data

    } catch (error) {
        return { user: null }
    }
}

export { getMe }
