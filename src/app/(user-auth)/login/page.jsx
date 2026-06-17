'use client'

import { client, notify } from '@/utils/Helper'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

export default function LoginPage() {
  const router = useRouter()
  const [item, setItem] = useState([])
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    try {
      const cartItems = JSON.parse(localStorage.getItem("cart")) || {}
      setItem(cartItems.items || [])
    } catch (error) {
      console.log(error)
    }
  }, [])

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    const data = {
      email: e.target.email.value,
      password: e.target.password.value
    }

    try {
      const res = await client.post("/User/login", data)

      if (res.data.success) {
        notify("Logged in successfully", true)

        // Cart sync — silently, don't block redirect on failure
        try {
          const cartRes = await client.post("cart/sync", {
            localCart: JSON.stringify({ items: item })
          })
          const cartData = cartRes.data?.cart

          if (cartData?.items?.length > 0) {
            let final_total = 0
            let original_total = 0

            const items = cartData.items
              .filter((item) => item?.productId)
              .map((item) => {
                const { name, _id, original_price, final_price, discount, price, thumbnail, stock } = item.productId
                final_total += final_price * item.qty
                original_total += original_price * item.qty
                return {
                  id: _id, name, original_price, final_price,
                  discount, price, stock, qty: item.qty,
                  thumbnail: cartRes.data.imageBaseUrl + thumbnail,
                }
              })

            localStorage.setItem("cart", JSON.stringify({ final_total, items, original_total }))
          }
        } catch (cartErr) {
          console.log("Cart sync failed (non-critical):", cartErr)
        }

        // Always redirect to home after login
        router.push("/")
      }
    } catch (error) {
      const message = error?.response?.data?.msg || "Login failed. Please try again."
      notify(message, false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ── Left Panel (decorative) ──────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-500 via-teal-400 to-emerald-500 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
        <div className="relative text-center text-white px-12">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/30">
            <span className="text-4xl font-black text-white">S</span>
          </div>
          <h1 className="text-4xl font-black mb-3">Welcome Back!</h1>
          <p className="text-teal-100 text-lg leading-relaxed">
            Sign in to access your account,<br />
            track orders and manage your profile.
          </p>
          <div className="flex justify-center gap-3 mt-8">
            {['🛒', '📦', '💳'].map((emoji, i) => (
              <div key={i} className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center text-xl backdrop-blur-sm border border-white/20">
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel (form) ───────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl font-black text-white">S</span>
            </div>
            <h2 className="text-3xl font-black text-gray-900">Sign In</h2>
            <p className="text-gray-500 mt-1 text-sm">Enter your credentials to continue</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-gray-50 focus:bg-white transition text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-teal-600 hover:text-teal-700 font-medium hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  required
                  className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-gray-50 focus:bg-white transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPass ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold py-3 rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-teal-600 font-bold hover:underline">
              Create Account
            </Link>
          </p>

        </div>
      </div>

    </div>
  )
}
