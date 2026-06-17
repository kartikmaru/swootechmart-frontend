'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SearchBar from './Home/SeachBar'
import { useDispatch, useSelector } from 'react-redux'
import { lstoCart } from '@/redux/features/CartSlice'
import { ShoppingCart, Menu, X } from 'lucide-react'

export default function Header({ user }) {

  const cart       = useSelector((store) => store.cart)
  const dispatcher = useDispatch()
  const pathname   = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    dispatcher(lstoCart())
  }, [])

  const items = [
    { name: "Home",     path: "/" },
    { name: "Pages",    path: "/pages" },
    { name: "Products", path: "/store" },
    { name: "Contacts", path: "/contact" },
  ]

  return (
    <header className='w-full border-b border-gray-100 bg-white sticky top-0 z-50'>

      {/* ── Top Bar — hidden on mobile ─────────────────────────────────── */}
      <div className='hidden md:block border-b border-gray-100'>
        <div className='max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-2.5'>
          <div className='flex gap-4 items-center text-sm'>
            <div className='bg-[#EBEEF6] px-3 py-1 rounded-full font-medium text-gray-700 text-xs'>
              Hotline 24/7
            </div>
            <div className='font-semibold text-gray-800 text-xs'>(025) 3886 25 16</div>
          </div>
          <div className='flex gap-6 items-center'>
            <div className='flex gap-4 text-xs text-gray-600 font-medium'>
              <span className='hover:text-[#01A49E] cursor-pointer transition'>Sell on Swoo</span>
              <span className='hover:text-[#01A49E] cursor-pointer transition'>Order Tracking</span>
            </div>
            <div className='flex items-center text-xs'>
              <select className='outline-none cursor-pointer text-gray-700 bg-transparent'>
                <option value="USD">USD</option>
                <option value="INR">INR</option>
              </select>
              <select className='border-l ml-2 pl-2 outline-none cursor-pointer text-gray-700 bg-transparent'>
                <option value="ENG">ENG</option>
                <option value="HIN">HIN</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Header ────────────────────────────────────────────────── */}
      <div className='max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center py-3 lg:py-4 gap-3'>

          {/* Logo */}
          <Link href={"/"} className='flex items-center gap-2 group shrink-0'>
            <div className='bg-gradient-to-r from-[#01A49E] to-[#01857f] flex justify-center items-center rounded-xl w-10 h-10 sm:w-12 sm:h-12 shadow-md group-hover:scale-105 transition-all duration-300'>
              <Image alt='logo' src="/logo/logo 1.png" height={20} width={20} />
            </div>
            <div className='leading-4 hidden sm:block'>
              <h2 className='font-bold text-base sm:text-lg tracking-wide text-gray-900'>SWOO</h2>
              <p className='text-xs text-gray-500 font-medium'>TECH MART</p>
            </div>
          </Link>

          {/* Search — hidden on small screens */}
          <div className='hidden md:flex flex-1 max-w-xl'>
            <SearchBar />
          </div>

          {/* Right Side */}
          <div className='flex items-center gap-2 sm:gap-3'>

            {/* User/Profile */}
            <Link
              href={user ? "/profile" : "/login"}
              className='hidden sm:flex items-center gap-2 bg-gradient-to-r from-[#01A49E] to-[#01857f] text-white px-3 py-2 rounded-full shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300'
            >
              <div className='w-7 h-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-xs font-bold uppercase'>
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className='flex flex-col leading-tight hidden lg:flex'>
                <span className='text-[9px] uppercase tracking-wide text-white/70'>
                  {user ? "My Account" : "Welcome"}
                </span>
                <span className='text-xs font-semibold capitalize'>
                  {user ? user.name.split(' ')[0] : "Login"}
                </span>
              </div>
            </Link>

            {/* Cart */}
            <Link
              href={"/cart"}
              className='flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-xl transition-all border border-gray-100 hover:shadow-md group'
            >
              <div className='relative bg-white p-2 rounded-full shadow-sm group-hover:bg-[#01A49E] transition-all duration-300'>
                <ShoppingCart className='w-4 h-4 text-gray-700 group-hover:text-white transition' />
                {cart.items.length > 0 && (
                  <span className='absolute -top-1.5 -right-1.5 bg-[#01A49E] text-white text-[9px] min-w-[16px] h-[16px] flex items-center justify-center rounded-full font-semibold shadow'>
                    {cart.items.length}
                  </span>
                )}
              </div>
              <div className='flex-col leading-tight hidden sm:flex'>
                <span className='text-[10px] uppercase tracking-wide text-gray-400 font-medium'>Cart</span>
                <span className='font-bold text-sm text-gray-900'>₹{cart.final_total}</span>
              </div>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(m => !m)}
              className='md:hidden p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition'
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar — mobile only */}
        <div className='md:hidden pb-3'>
          <SearchBar />
        </div>

        {/* ── Nav Bar — desktop ───────────────────────────────────────── */}
        <nav className='hidden md:flex items-center gap-1 border-t border-gray-100 h-10'>
          {items.map((item, index) => {
            const isActive = pathname === item.path
            return (
              <Link
                key={index}
                href={item.path}
                className={`px-4 h-full flex items-center uppercase text-sm font-semibold relative transition duration-300
                  after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-[#01A49E] after:transition-all
                  ${isActive
                    ? 'text-[#01A49E] after:w-full'
                    : 'text-gray-700 hover:text-[#01A49E] after:w-0 hover:after:w-full'
                  }`}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* ── Mobile Menu ─────────────────────────────────────────────── */}
        {menuOpen && (
          <div className='md:hidden border-t border-gray-100 py-3 space-y-1'>
            {items.map((item, index) => {
              const isActive = pathname === item.path
              return (
                <Link
                  key={index}
                  href={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition
                    ${isActive
                      ? 'bg-teal-50 text-[#01A49E]'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-[#01A49E]'
                    }`}
                >
                  {item.name}
                </Link>
              )
            })}
            {/* Mobile user link */}
            <Link
              href={user ? "/profile" : "/login"}
              onClick={() => setMenuOpen(false)}
              className='flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition'
            >
              <div className='w-7 h-7 rounded-full bg-[#01A49E] flex items-center justify-center text-white text-xs font-bold uppercase'>
                {user?.name?.charAt(0) || "U"}
              </div>
              {user ? user.name : "Login / Register"}
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
