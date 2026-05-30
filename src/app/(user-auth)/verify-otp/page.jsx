'use client'

import { Suspense, useState, useRef } from 'react'
import { client, notify } from '@/utils/Helper'
import { useRouter, useSearchParams } from 'next/navigation'

function VerifyOtpContent() {
  const [otp, setOtp] = useState(Array(6).fill(''))
  const inputsRef = useRef([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const [loading, setLoading] = useState(false)

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputsRef.current[index + 1].focus()
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()

    const finalOtp = otp.join("")
    setLoading(true)

    client.post("User/verify-otp", {
      otp: finalOtp,
      email: email
    })
      .then((res) => {
        notify("Email Verified Successfully", res.data.success)
        router.push("/login")
      })
      .catch((error) => {
        const message = error?.response?.data?.msg
        notify(message, false)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Verify OTP
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          Enter the 6-digit code sent to your email
        </p>

        <form onSubmit={submitHandler}>

          <div className="flex justify-between gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                ref={(el) => (inputsRef.current[index] = el)}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-lg border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white font-medium py-2.5 rounded-lg hover:bg-teal-700 transition"
          >
            {loading ? "wait..." : "Verify OTP"}
          </button>

        </form>
      </div>
    </div>
  )
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  )
}