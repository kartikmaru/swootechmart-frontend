// (user-auth)/layout.jsx
// Wraps login, register, verify-otp pages
// Provides Redux store + Toast notifications for auth pages
//
// Uses a split pattern:
//   - Outer (this file): Server Component — renders <html>/<body> + font vars
//   - Inner (AuthClientWrapper): Client Component — renders ReduxProvider + Toast
//
// This avoids the 'use client' + metadata conflict AND ensures Redux is available

import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'
import AuthClientWrapper from './AuthClientWrapper'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata = {
    title: 'SwooTechMart — Sign In',
    description: 'Login or create your SwooTechMart account',
}

export default function AuthLayout({ children }) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full bg-gray-50">
                <AuthClientWrapper>
                    {children}
                </AuthClientWrapper>
            </body>
        </html>
    )
}
