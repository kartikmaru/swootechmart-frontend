'use client'

import { useState } from 'react'
import Link from 'next/link'
import { client, notify } from '@/utils/Helper'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { logoutClearCart } from '@/utils/cartHelper'


export default function RegisterPage() {
    const router   = useRouter()
    const dispatch = useDispatch()
    const [loading,  setLoading]  = useState(false)
    const [showPass, setShowPass] = useState(false)

    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)

        const data = {
            name:     e.target.name.value.trim(),
            email:    e.target.email.value.trim(),
            password: e.target.password.value,
        }

        try {
            // Clear any previous user's cart BEFORE creating new account
            // This ensures the new user never sees another user's cart data
            await logoutClearCart(dispatch)

            const res = await client.post('/User/create', data)

            if (res.data.success) {
                notify('Account created! Please verify your email.', true)
                e.target.reset()
                // New user's cart is empty by default — no need to sync
                // Redirect to OTP verification
                router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`)
            }
        } catch (error) {
            const message = error?.response?.data?.msg || 'Registration failed. Please try again.'
            notify(message, false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex bg-gray-50">

            {/* ── Left Panel (same as login) ──────────────────────────── */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-500 via-teal-400 to-emerald-500 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
                <div className="relative text-center text-white px-12">
                    <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/30">
                        <span className="text-4xl font-black text-white">S</span>
                    </div>
                    <h1 className="text-4xl font-black mb-3">Join SwooTechMart</h1>
                    <p className="text-teal-100 text-lg leading-relaxed">
                        Create your account and start shopping<br />
                        the latest tech at the best prices.
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

            {/* ── Right Panel (same layout as login) ──────────────────── */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">

                    {/* Logo — identical to login */}
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <span className="text-2xl font-black text-white">S</span>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900">Create Account</h2>
                        <p className="text-gray-500 mt-1 text-sm">Fill in your details to get started</p>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-5">

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                                <input type="text" name="name" placeholder="Your full name" required
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-gray-50 focus:bg-white transition text-sm" />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                                <input type="email" name="email" placeholder="you@example.com" required
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-gray-50 focus:bg-white transition text-sm" />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                                <input type={showPass ? 'text' : 'password'} name="password"
                                    placeholder="Create a password (min 6 chars)" required minLength={6}
                                    className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-gray-50 focus:bg-white transition text-sm" />
                                <button type="button" onClick={() => setShowPass(p => !p)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                                    {showPass ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit — identical style to login */}
                        <button type="submit" disabled={loading}
                            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold py-3 rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm">
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating Account...
                                </>
                            ) : 'Create Account'}
                        </button>

                    </form>

                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400 font-medium">OR</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="text-teal-600 font-bold hover:underline">Sign In</Link>
                    </p>

                </div>
            </div>
        </div>
    )
}
