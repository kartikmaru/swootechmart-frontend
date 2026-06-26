'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FiBell, FiSearch, FiUser, FiLogOut, FiSettings } from 'react-icons/fi'
import { client, notify } from '@/utils/Helper'

// Map of path → page title
const PAGE_TITLES = {
    '/admin':             { title: 'Dashboard',  sub: 'Welcome back, Admin' },
    '/admin/category':    { title: 'Categories', sub: 'Manage product categories' },
    '/admin/brand':       { title: 'Brands',     sub: 'Manage product brands' },
    '/admin/color':       { title: 'Colors',     sub: 'Manage product colors' },
    '/admin/product':     { title: 'Products',   sub: 'Manage your inventory' },
    '/admin/order':       { title: 'Orders',     sub: 'Track and manage orders' },
}

export default function AdminHeader() {
    const pathname = usePathname()
    const router   = useRouter()

    const [dropOpen, setDropOpen] = useState(false)
    const [time, setTime]         = useState('')

    // Live clock
    useEffect(() => {
        const tick = () => {
            const now = new Date()
            setTime(now.toLocaleTimeString('en-IN', {
                hour: '2-digit', minute: '2-digit', hour12: true
            }))
        }
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [])

    // Get page info — match exact or startsWith for nested routes
    const pageInfo = PAGE_TITLES[pathname] ||
        Object.entries(PAGE_TITLES).find(([k]) => pathname.startsWith(k) && k !== '/admin')?.[1] ||
        { title: 'Admin Panel', sub: '' }

    const handleLogout = async () => {
        try {
            await client.post('User/logout')
        } catch (_) {}
        localStorage.removeItem('token')
        document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax'
        document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax; Secure'
        notify('Logged out successfully', true)
        // Full page reload so server re-runs auth checks
        window.location.href = '/login'
    }

    // Today's date
    const today = new Date().toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })

    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-6 h-16 gap-4">

                {/* ── Left: Page Title ───────────────────────────────────── */}
                <div className="min-w-0">
                    <h1 className="text-lg font-bold text-gray-800 leading-tight truncate">
                        {pageInfo.title}
                    </h1>
                    {pageInfo.sub && (
                        <p className="text-xs text-gray-400 hidden sm:block">{pageInfo.sub}</p>
                    )}
                </div>

                {/* ── Right: Actions ─────────────────────────────────────── */}
                <div className="flex items-center gap-3 shrink-0">

                    {/* Date & Time */}
                    <div className="hidden lg:flex flex-col items-end">
                        <span className="text-xs font-semibold text-gray-700">{time}</span>
                        <span className="text-xs text-gray-400">{today}</span>
                    </div>

                    <div className="w-px h-8 bg-gray-200 hidden lg:block" />

                    {/* Notification Bell */}
                    <button className="relative p-2 rounded-xl hover:bg-orange-50 text-gray-500 hover:text-orange-500 transition">
                        <FiBell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setDropOpen(p => !p)}
                            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow">
                                A
                            </div>
                            <div className="hidden sm:flex flex-col items-start">
                                <span className="text-sm font-semibold text-gray-800 leading-none">Admin</span>
                                <span className="text-xs text-gray-400">Super Admin</span>
                            </div>
                            <svg className={`w-4 h-4 text-gray-400 transition-transform ${dropOpen ? 'rotate-180' : ''}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {dropOpen && (
                            <>
                                {/* Backdrop */}
                                <div className="fixed inset-0 z-10" onClick={() => setDropOpen(false)} />
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-gray-100 bg-orange-50">
                                        <p className="text-sm font-bold text-gray-800">Admin User</p>
                                        <p className="text-xs text-gray-500">admin@ishop.com</p>
                                    </div>
                                    <div className="p-1.5 space-y-0.5">
                                        <button
                                            onClick={() => { router.push('/admin'); setDropOpen(false) }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition"
                                        >
                                            <FiUser size={15} /> Profile
                                        </button>
                                        <button
                                            onClick={() => { router.push('/admin'); setDropOpen(false) }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition"
                                        >
                                            <FiSettings size={15} /> Settings
                                        </button>
                                        <div className="border-t border-gray-100 my-1" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition"
                                        >
                                            <FiLogOut size={15} /> Logout
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
