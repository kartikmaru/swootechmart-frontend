'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { FiBell, FiUser, FiLogOut, FiChevronDown, FiShield } from 'react-icons/fi'
import { client, notify } from '@/utils/Helper'
import { useAdminUser } from './AdminGuard'

const PAGE_TITLES = {
    '/admin':          { title: 'Dashboard',  sub: 'Welcome back' },
    '/admin/category': { title: 'Categories', sub: 'Manage product categories' },
    '/admin/brand':    { title: 'Brands',     sub: 'Manage product brands' },
    '/admin/color':    { title: 'Colors',     sub: 'Manage product colors' },
    '/admin/product':  { title: 'Products',   sub: 'Manage your inventory' },
    '/admin/order':    { title: 'Orders',     sub: 'Track and manage orders' },
    '/admin/profile':  { title: 'My Profile', sub: 'Your account details' },
}

export default function AdminHeader() {
    const pathname  = usePathname()
    const router    = useRouter()
    const adminUser = useAdminUser()   // real user from AdminGuard context

    const [dropOpen,   setDropOpen]   = useState(false)
    const [time,       setTime]       = useState('')
    const [loggingOut, setLoggingOut] = useState(false)
    const dropRef = useRef(null)

    // Live clock
    useEffect(() => {
        const tick = () => setTime(new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit', minute: '2-digit', hour12: true,
        }))
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [])

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropRef.current && !dropRef.current.contains(e.target)) {
                setDropOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const pageInfo = PAGE_TITLES[pathname] ||
        Object.entries(PAGE_TITLES).find(([k]) => pathname.startsWith(k) && k !== '/admin')?.[1] ||
        { title: 'Admin Panel', sub: '' }

    // Show real name if available, else 'Admin'
    const displayName = adminUser?.name || 'Admin'
    const displayRole = adminUser?.role === 'superAdmin' ? 'Super Admin'
                      : adminUser?.role === 'admin'      ? 'Admin'
                      : 'Staff'
    const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

    const today = new Date().toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })

    const handleLogout = async () => {
        setLoggingOut(true)
        try {
            await client.post('User/logout')
        } catch (_) {}
        localStorage.removeItem('token')
        document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax'
        document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax; Secure'
        notify('Logged out successfully', true)
        window.location.href = '/login'
    }

    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-4 sm:px-6 h-16 gap-4">

                {/* ── Left: Page Title ─────────────────────────────────── */}
                <div className="min-w-0">
                    <h1 className="text-lg font-bold text-gray-800 leading-tight truncate">
                        {pageInfo.title}
                    </h1>
                    {pageInfo.sub && (
                        <p className="text-xs text-gray-400 hidden sm:block">
                            {pageInfo.sub}{adminUser?.name ? `, ${adminUser.name.split(' ')[0]}` : ''}
                        </p>
                    )}
                </div>

                {/* ── Right: Actions ───────────────────────────────────── */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">

                    {/* Date & Time */}
                    <div className="hidden lg:flex flex-col items-end leading-tight">
                        <span className="text-xs font-semibold text-gray-700">{time}</span>
                        <span className="text-[11px] text-gray-400">{today}</span>
                    </div>

                    <div className="w-px h-8 bg-gray-200 hidden lg:block" />

                    {/* Notification Bell */}
                    <button className="relative p-2 rounded-xl hover:bg-orange-50 text-gray-500 hover:text-orange-500 transition">
                        <FiBell size={19} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={dropRef}>
                        <button
                            onClick={() => setDropOpen(p => !p)}
                            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-200"
                        >
                            {/* Avatar with real initials */}
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-xs shadow">
                                {initials}
                            </div>
                            <div className="hidden sm:flex flex-col items-start leading-tight">
                                <span className="text-sm font-semibold text-gray-800 leading-none truncate max-w-[100px]">
                                    {displayName.split(' ')[0]}
                                </span>
                                <span className="text-[11px] text-gray-400">{displayRole}</span>
                            </div>
                            <FiChevronDown size={14}
                                className={`text-gray-400 transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown */}
                        {dropOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setDropOpen(false)} />
                                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 overflow-hidden">

                                    {/* User info header */}
                                    <div className="px-4 py-3.5 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-sm shadow shrink-0">
                                                {initials}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-gray-800 truncate">{displayName}</p>
                                                <p className="text-xs text-gray-500 truncate">{adminUser?.email || ''}</p>
                                                <span className="inline-flex items-center gap-1 mt-0.5 text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                                                    <FiShield size={9} /> {displayRole}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="p-2">
                                        <button
                                            onClick={() => { router.push('/admin/profile'); setDropOpen(false) }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                                                <FiUser size={14} />
                                            </div>
                                            My Profile
                                        </button>

                                        <div className="border-t border-gray-100 my-1.5" />

                                        <button
                                            onClick={handleLogout}
                                            disabled={loggingOut}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-400 flex items-center justify-center">
                                                <FiLogOut size={14} />
                                            </div>
                                            {loggingOut ? 'Signing out...' : 'Logout'}
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
