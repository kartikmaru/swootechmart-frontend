'use client'

import { useState } from 'react'
import Link from 'next/link'
import { client, notify } from '@/utils/Helper'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {

    const [loading, setLoading] = useState(false)

    const router = useRouter()

    const submitHandler = (e) => {
        e.preventDefault()
        setLoading(true)

        const data = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value
        }

        client.post("/User/create", data).then(
            (res) => {
                notify("User Created successfully", true)
                if (res.data.success) {
                    e.target.reset()
                }
                router.push(`/verify-otp?email=${res.data.data.email}`)
            }
        ).catch(
            (error) => {
                const message = error?.response?.data?.msg
                notify(message, false)
            }
        ).finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    Create an account
                </h2>

                <form onSubmit={submitHandler} className="space-y-5">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-teal-600 text-white font-medium py-2.5 rounded-lg hover:bg-teal-700 transition"
                    >
                        {loading ? "Wait...." : "Register"}

                    </button>

                </form>

                {/* Login Link */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-teal-600 font-medium hover:underline"
                    >
                        Login
                    </Link>
                </p>

            </div>
        </div>
    )
}