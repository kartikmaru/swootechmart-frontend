'use client'
// AdminGuard — protects all admin panel pages and provides user context
// Fetches the authenticated admin user once on mount, validates role,
// then shares the user via AdminUserContext so Header and other
// components can display real user data without duplicate API calls.

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { client } from '@/utils/Helper'

// ── Context — admin user shared across layout ─────────────────────────────────
const AdminUserContext = createContext(null)

export function useAdminUser() {
    return useContext(AdminUserContext)
}

export default function AdminGuard({ children }) {
    const router   = useRouter()
    const [checking,   setChecking]   = useState(true)
    const [authorized, setAuthorized] = useState(false)
    const [adminUser,  setAdminUser]  = useState(null)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res  = await client.get('User/get')
                const user = res.data?.user

                if (!user) {
                    router.replace('/login?redirect=/admin')
                    return
                }

                const allowedRoles = ['admin', 'superAdmin']
                if (!allowedRoles.includes(user.role)) {
                    localStorage.removeItem('token')
                    document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax'
                    router.replace('/login?error=unauthorized')
                    return
                }

                setAdminUser(user)
                setAuthorized(true)
            } catch (_) {
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

    return (
        <AdminUserContext.Provider value={adminUser}>
            {children}
        </AdminUserContext.Provider>
    )
}
