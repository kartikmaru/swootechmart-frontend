import { toast } from 'react-toastify';
import axios from 'axios';

// Validate env var is set — helps catch misconfiguration early
if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_API_BASE_URL) {
    console.error('[Helper] NEXT_PUBLIC_API_BASE_URL is not set. Check your .env or Vercel env vars.')
}

const client = axios.create({
    baseURL:         process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout:         30000,        // 30s — Render free tier has cold start delays
    withCredentials: true,         // send httpOnly cookies for CORS-allowed cross-origin
})

// ── Request interceptor ───────────────────────────────────────────────────────
// PRIMARY auth for cross-origin (Vercel → Render):
// httpOnly cookies from Render are blocked by browsers on Vercel domain.
// We send the token from localStorage as Authorization header — reliable fallback.
// Backend auth middleware checks: cookie first → then Authorization header
client.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token')
            if (token) {
                config.headers['Authorization'] = `Bearer ${token.trim()}`
            }
        }
        return config
    },
    (error) => Promise.reject(error)
)

// ── Response interceptor ──────────────────────────────────────────────────────
// Clear stale auth data on 401 so user can re-login cleanly
client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401 && typeof window !== 'undefined') {
            if (localStorage.getItem('token')) {
                console.warn('[Helper] 401 received — clearing stale auth data')
                localStorage.removeItem('token')
                document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax'
                document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax; Secure'
            }
        }
        return Promise.reject(error)
    }
)

const notify = (msg, flag) => {
    toast(msg, {
        type: flag ? 'success' : 'error',
        icon: true,
    })
}

export { notify, client }
