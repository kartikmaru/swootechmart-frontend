'use client'

import { client, notify } from '@/utils/Helper'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useRef } from 'react'

export default function VerifyOtpPage() {
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

    // Move to next input
    if (value && index < 5) {
      inputsRef.current[index + 1].focus()
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
    setLoading(true)
    const finalOtp = otp.join("")
    setLoading(true)
    client.post("user/verify-otp", { otp: finalOtp, email: email }).then(
      (res) => {
        if (res.data.success) {
          e.target.reset()
        }
        notify("Email Verified Successfully", res.data.success)
        router.push("/login")
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

  const handleKeyDown = (e, index) => {
    // Move back on delete
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus()
    }
  }


  const handleResend = () => {
    console.log('Resend OTP')
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

          {/* OTP Inputs */}
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

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white font-medium py-2.5 rounded-lg hover:bg-teal-700 transition"
          >
            {loading ? "wait..." : "Verify OTP"}
          </button>

        </form>

        {/* Resend */}
        <p className="text-sm text-gray-600 mt-5">
          Didn’t receive the code?{" "}
          <button
            onClick={handleResend}
            className="text-teal-600 font-medium hover:underline"
          >
            Resend
          </button>
        </p>

      </div>
    </div>
  )
}