'use client'
import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SearchBar from './Home/SeachBar'
import { useDispatch, useSelector } from 'react-redux'
import { lstoCart } from '@/redux/features/CartSlice'
import { ShoppingCart } from 'lucide-react'

export default function Header({ user }) {

  const cart = useSelector((store) => store.cart)
  const dispatcher = useDispatch()

  useEffect(() => {
    dispatcher(lstoCart())
  }, [])

  const items = [
    { name: "Home", path: "/" },
    { name: "Pages", path: "/pages" },
    { name: "Products", path: "/store" },
    { name: "Contacts", path: "/contact" },
  ]

  return (

    <header className='w-full border-b border-gray-100 bg-white'>

      <div className='w-full mx-auto px-8'>

        {/* Top Header */}
        <div className='flex justify-between items-center py-3 border-b border-gray-100'>

          {/* Left */}
          <div className='flex gap-5 items-center text-sm'>

            <div className='bg-[#EBEEF6] px-4 py-1.5 rounded-full font-medium text-gray-700'>
              Hotline 24/7
            </div>

            <div className='font-semibold text-gray-800'>
              (025) 3886 25 16
            </div>

          </div>

          {/* Right */}
          <div className='flex gap-10 items-center'>

            <div className='flex gap-5 text-sm text-gray-600 font-medium'>

              <div className='hover:text-[#01A49E] cursor-pointer transition'>
                Sell on Swoo
              </div>

              <div className='hover:text-[#01A49E] cursor-pointer transition'>
                Order Tracking
              </div>

            </div>

            <div className='flex items-center text-sm'>

              <select className='outline-none cursor-pointer text-gray-700'>
                <option value="USD">USD</option>
                <option value="INR">INR</option>
              </select>

              <select className='border-l ml-3 pl-3 outline-none cursor-pointer text-gray-700'>
                <option value="ENG">ENG</option>
                <option value="HIN">HIN</option>
              </select>

            </div>

          </div>

        </div>

        {/* Main Header */}
        <div className='flex justify-between items-center py-6'>

          {/* Left Side */}
          <div className='flex items-center gap-12'>

            {/* Logo */}
            <Link href={"/"} className='flex items-center gap-3 group'>

              <div className='bg-gradient-to-r from-[#01A49E] to-[#01857f] flex justify-center items-center rounded-2xl w-[58px] h-[58px] shadow-md group-hover:scale-105 transition-all duration-300'>

                <Image
                  alt='logo'
                  src="/logo/logo 1.png"
                  height={24}
                  width={24}
                />

              </div>

              <div className='leading-5'>

                <h2 className='font-bold text-xl tracking-wide text-gray-900'>
                  SWOO
                </h2>

                <p className='text-sm text-gray-500 font-medium'>
                  TECH MART
                </p>

              </div>

            </Link>

            {/* Navigation */}
            <nav className='flex gap-8'>

              {items.map((item, index) => (

                <Link
                  key={index}
                  href={item.path}
                  className='uppercase text-sm font-semibold text-gray-700 hover:text-[#01A49E] relative transition duration-300 after:absolute after:w-0 after:h-[2px] after:bg-[#01A49E] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all'
                >
                  {item.name}
                </Link>

              ))}

            </nav>

          </div>

          {/* Right Side */}
          <div className='flex items-center gap-6'>

            {/* User/Profile Button */}
            <Link
              href={user ? "/profile" : "/login"}
              className='flex items-center gap-3 bg-gradient-to-r from-[#01A49E] to-[#01857f] text-white px-4 py-2 rounded-full shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300'
            >

              {/* Avatar */}
              <div className='w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-sm font-bold uppercase'>
                {user?.name?.charAt(0) || "U"}
              </div>

              {/* User Info */}
              <div className='flex flex-col leading-tight'>

                <span className='text-[10px] uppercase tracking-wide text-white/70'>
                  {user ? "My Account" : "Welcome"}
                </span>

                <span className='text-sm font-semibold capitalize'>
                  {user ? user.name : "Login"}
                </span>

              </div>

            </Link>

            {/* Cart */}
            <Link
              href={"/cart"}
              className='flex items-center gap-4 bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-2xl transition-all duration-300 border border-gray-100 hover:shadow-md group'
            >

              {/* Cart Icon */}
              <div className='relative bg-white p-3 rounded-full shadow-sm group-hover:bg-[#01A49E] transition-all duration-300'>

                <ShoppingCart className='w-5 h-5 text-gray-700 group-hover:text-white transition' />

                {/* Badge */}
                <span className='absolute -top-2 -right-2 bg-[#01A49E] text-white text-[10px] min-w-[20px] h-[20px] flex items-center justify-center rounded-full font-semibold shadow'>
                  {cart.items.length}
                </span>

              </div>

              {/* Cart Info */}
              <div className='flex flex-col leading-tight'>

                <span className='text-[11px] uppercase tracking-wide text-gray-400 font-medium'>
                  Your Cart
                </span>

                <span className='font-bold text-lg text-gray-900 flex items-center gap-2'>

                  ${cart.final_total}

                  <span className='w-2 h-2 bg-green-500 rounded-full'></span>

                </span>

              </div>

            </Link>

          </div>

        </div>

        {/* Search Bar */}
        <div className='pb-5'>
          <SearchBar />
        </div>

      </div>

    </header>

  )
}