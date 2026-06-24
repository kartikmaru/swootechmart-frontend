'use client'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { lstoCart } from '@/redux/features/CartSlice'
import { client, notify } from '@/utils/Helper'
import { FiPhone, FiShoppingCart, FiMenu, FiX, FiUser, FiSearch, FiChevronDown, FiLogOut } from 'react-icons/fi'

const NAV_LINKS = [
  { name: 'HOME',    path: '/' },
  { name: 'STORE',   path: '/store' },
  { name: 'ABOUT',   path: '/about' },
  { name: 'CONTACT', path: '/contact' },
]

const FEATURES = [
  'FREE SHIPPING OVER \u20B9199',
  '30 DAYS MONEY BACK',
  '100% SECURE PAYMENT',
]

export default function Header({ user }) {
  const cart       = useSelector((store) => store.cart)
  const dispatcher = useDispatch()
  const pathname   = usePathname()
  const router     = useRouter()

  const [menuOpen,   setMenuOpen]   = useState(false)
  const [query,      setQuery]      = useState('')
  const [dropOpen,   setDropOpen]   = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => { dispatcher(lstoCart()) }, [])

  useEffect(() => {
    setMenuOpen(false)
    setDropOpen(false)
  }, [pathname])

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) router.push(`/store?q=${encodeURIComponent(query.trim())}`)
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await client.post('User/logout')
      localStorage.removeItem('token')
      document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax'
      notify('Logged out successfully', true)
      setDropOpen(false)
      router.push('/')
      router.refresh()
    } catch {
      notify('Logout failed', false)
    } finally {
      setLoggingOut(false)
    }
  }

  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U'

  // Format rupee amount — avoids any encoding issues by using unicode escape
  const formatRupees = (amount) => `\u20B9${Number(amount || 0).toLocaleString('en-IN')}`

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-sm">

      {/* Row 1: Top Bar */}
      <div className="hidden md:block bg-white border-b border-gray-100">
        <div className="container-app flex items-center justify-between h-9">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#01A49E] text-white text-[11px] font-bold px-3 py-1 rounded-full">
              <FiPhone size={11} />
              Hotline 24/7
            </div>
            <span className="text-[12px] font-semibold text-gray-700">(025) 3886 25 16</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/store" className="text-[12px] text-gray-500 font-medium hover:text-[#01A49E] transition">
              Sell on Swoo
            </Link>
            <Link href="/orders" className="text-[12px] text-gray-500 font-medium hover:text-[#01A49E] transition">
              Order Tracking
            </Link>
          </div>
        </div>
      </div>

      {/* Row 2: Main Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-app flex items-center justify-between h-16 md:h-[70px] gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="bg-[#01A49E] w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center shadow group-hover:scale-105 transition">
              <Image alt="logo" src="/logo/logo 1.png" height={22} width={22} />
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-[15px] font-black text-gray-900 tracking-wide">SWOO</p>
              <p className="text-[10px] font-semibold text-gray-400 tracking-widest">TECH MART</p>
            </div>
          </Link>

          {/* Nav — desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ name, path }) => {
              const active = pathname === path || (path !== '/' && pathname.startsWith(path))
              return (
                <Link key={path} href={path}
                  className={`px-4 py-2 text-[13px] font-bold tracking-wide transition relative
                    after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-[#01A49E] after:rounded after:transition-transform after:duration-200
                    ${active ? 'text-[#01A49E] after:scale-x-100' : 'text-gray-700 hover:text-[#01A49E] after:scale-x-0 hover:after:scale-x-100'}`}>
                  {name}
                </Link>
              )
            })}
          </nav>

          {/* Right: User + Cart */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            {/* User dropdown */}
            <div className="hidden sm:block relative" ref={dropRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setDropOpen(d => !d)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition">
                    <div className="w-8 h-8 rounded-full bg-[#01A49E] text-white flex items-center justify-center text-xs font-black uppercase shrink-0">
                      {initial}
                    </div>
                    <div className="flex flex-col items-start leading-tight">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">WELCOME</span>
                      <span className="text-[13px] font-black text-gray-800 uppercase">{user.name.split(' ')[0]}</span>
                    </div>
                    <FiChevronDown size={13}
                      className={`text-gray-400 transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                      <div className="absolute -top-1.5 right-5 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45" />
                      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-white flex items-center justify-center text-sm font-black uppercase shrink-0">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-800 truncate capitalize">{user.name}</p>
                            <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Link href="/profile" onClick={() => setDropOpen(false)}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition">
                          <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-500 flex items-center justify-center">
                            <FiUser size={14} />
                          </div>
                          Profile
                        </Link>
                        <button onClick={handleLogout} disabled={loggingOut}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition disabled:opacity-50">
                          <div className="w-7 h-7 rounded-lg bg-red-50 text-red-400 flex items-center justify-center">
                            <FiLogOut size={14} />
                          </div>
                          {loggingOut ? 'Signing out...' : 'Logout'}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link href="/login" className="flex flex-col items-end leading-tight px-2 py-1">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1">
                    <FiUser size={10} /> WELCOME
                  </span>
                  <span className="text-[13px] font-black text-gray-800 uppercase">LOGIN</span>
                </Link>
              )}
            </div>

            {/* Cart — clean, no extra text */}
            <Link href="/cart" className="flex items-center gap-2 group">
              <div className="relative">
                {/* Cart icon button */}
                <div className="w-10 h-10 bg-gray-50 group-hover:bg-[#01A49E] border border-gray-200 rounded-xl flex items-center justify-center transition">
                  <FiShoppingCart size={18} className="text-gray-600 group-hover:text-white transition" />
                </div>
                {/* Item count badge — only shows when cart has items */}
                {cart.items.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#01A49E] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow leading-none">
                    {cart.items.length}
                  </span>
                )}
              </div>
              {/* Cart text — desktop only */}
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">CART</span>
                <span className="text-[13px] font-black text-gray-800">{formatRupees(cart.final_total)}</span>
              </div>
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(m => !m)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              aria-label="Toggle menu">
              {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Teal Feature Bar */}
      <div className="bg-[#01A49E] hidden md:block">
        <div className="container-app flex items-center justify-between h-12">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-[12px] font-bold px-3 py-1.5 rounded-lg transition">
              <FiMenu size={13} />
              All Categories
              <FiChevronDown size={11} />
            </button>
            <form onSubmit={handleSearch} className="flex items-center bg-white rounded-lg overflow-hidden h-8 w-72 shadow-sm">
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search anything..."
                className="flex-1 text-[12px] px-3 outline-none text-gray-700 bg-transparent" />
              <button type="submit" className="px-3 h-full flex items-center text-gray-400 hover:text-[#01A49E] transition">
                <FiSearch size={14} />
              </button>
            </form>
          </div>
          <div className="flex items-center gap-6">
            {FEATURES.map(f => (
              <span key={f} className="text-white text-[11px] font-bold tracking-wide flex items-center gap-1.5">
                <span className="w-4 h-4 bg-white/25 rounded-full flex items-center justify-center text-[9px]">&#10003;</span>
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden bg-[#01A49E] px-4 py-2">
        <form onSubmit={handleSearch} className="flex items-center bg-white rounded-xl overflow-hidden h-9 shadow-sm">
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search anything..."
            className="flex-1 text-[13px] px-4 outline-none text-gray-700 bg-transparent" />
          <button type="submit" className="px-3 h-full flex items-center text-gray-400 hover:text-[#01A49E] transition">
            <FiSearch size={15} />
          </button>
        </form>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="px-4 pt-3 pb-2 space-y-0.5">
            {NAV_LINKS.map(({ name, path }) => {
              const active = pathname === path || (path !== '/' && pathname.startsWith(path))
              return (
                <Link key={path} href={path} onClick={() => setMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition
                    ${active ? 'bg-teal-50 text-[#01A49E]' : 'text-gray-700 hover:bg-gray-50 hover:text-[#01A49E]'}`}>
                  {name}
                </Link>
              )
            })}
          </nav>
          <div className="px-4 pb-4 pt-2 border-t border-gray-100 mt-1 space-y-2">
            <Link href={user ? '/profile' : '/login'} onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-2 py-2">
              <div className="w-9 h-9 rounded-xl bg-[#01A49E] text-white flex items-center justify-center font-black text-sm uppercase">
                {initial}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">
                  {user ? 'Logged in as' : 'Not logged in'}
                </p>
                <p className="text-sm font-bold text-gray-800 capitalize">{user?.name || 'Guest'}</p>
              </div>
            </Link>
            {user && (
              <button onClick={() => { setMenuOpen(false); handleLogout() }} disabled={loggingOut}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition disabled:opacity-50">
                <FiLogOut size={14} /> {loggingOut ? 'Signing out...' : 'Logout'}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
