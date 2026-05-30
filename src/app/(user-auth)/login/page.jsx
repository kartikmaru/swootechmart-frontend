'use client'

import { client, notify } from '@/utils/Helper'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [item, setItem] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      const cartItems =
        JSON.parse(localStorage.getItem("cart")) || {}

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

    await client.post("/User/login", data).then(
      async (res) => {
        setLoading(true)
        notify("User Loged In Successfully", true)
        if (res.data.success) {
          try {
            const cartRes = await client.post("cart/sync", {
              localCart: JSON.stringify({
                items: item
              })
            })
            const cartData = cartRes.data?.cart;

            let final_total = 0
            let original_total = 0

            console.log(cartData.items)

            const items = cartData.items
              .filter((item) => item?.productId)
              .map((item) => {

                const { name, _id, original_price, final_price, discount, price, thumbnail, stock } = item?.productId

                final_total += final_price * item.qty
                original_total += original_price * item.qty

                return {
                  id: _id,
                  name,
                  original_price,
                  final_price,
                  discount,
                  price,
                  thumbnail: cartRes.data.imageBaseUrl + thumbnail,
                  stock,
                  qty: item.qty
                }


              })

            localStorage.setItem("cart", JSON.stringify({
              final_total,
              items,
              original_total
            }))

            router.push("/")

          } catch (error) {
            console.log(error)
          }

        }
      }
    ).catch(
      (error) => {
        console.log(error)
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
          Login to your account
        </h2>

        <form onSubmit={submitHandler} className="space-y-5">

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

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-teal-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white font-medium py-2.5 rounded-lg hover:bg-teal-700 transition"
          >
            {loading ? "Wait...." : "Login"}
          </button>

        </form>

        {/* Register */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-teal-600 font-medium hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  )
}