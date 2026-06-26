'use client'
// AdminGuard — protects all admin panel pages
// Runs on client after mount: fetches current user, checks admin/superAdmin role
// If not authorized → redirects to /login
// This is a client-side guard that complements the proxy.js route protection

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { client } from '@/utils/Helper'

export default function AdminGuard({ children }) {
    const router = useRouter()
    const [checking, setChecking] = useState(true)
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await client.get('User/get')
                const user = res.data?.user

                if (!user) {
                    router.replace('/login?redirect=/admin')
                    return
                }

                const allowedRoles = ['admin', 'superAdmin']
                if (!allowedRoles.includes(user.role)) {
                    // Logged in but wrong role — clear token and redirect
                    localStorage.removeItem('token')
                    document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax'
                    router.replace('/login?error=unauthorized')
                    return
                }

                setAuthorized(true)
            } catch (err) {
                // Not authenticated
                router.replace('/login?redirect=/admin')
            } finally {
                setChecking(false)
            }
        }

        checkAuth()
    }, [])

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-500 font-medium">Verifying access...</p>
                </div>
            </div>
        )
    }

    if (!authorized) return null

    return <>{children}</>
}
