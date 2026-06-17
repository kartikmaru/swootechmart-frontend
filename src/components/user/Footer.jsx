import React from 'react'
import Link from 'next/link'
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

const footerLinks = [
    {
        title: 'Shop',
        links: ['Smartphones', 'Laptops', 'Tablets', 'Headphones', 'Smartwatches', 'Televisions', 'Cameras'],
    },
    {
        title: 'Company',
        links: ['About Us', 'Careers', 'Press & Blog', 'Affiliate Program', 'Partners', 'Sustainability'],
    },
    {
        title: 'Support',
        links: ['Help Center', 'Order Tracking', 'Returns & Refunds', 'Shipping Policy', 'Privacy Policy', 'Terms of Service'],
    },
]

const paymentIcons = ['VISA', 'MC', 'AMEX', 'PayPal', 'UPI', 'GPay']

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">

            {/* ── Top Strip ───────────────────────────────────────────── */}
            <div className="bg-[#01A49E] py-4 px-4 sm:px-8">
                <div className="max-w-[1500px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                        <h3 className="text-white font-black text-lg">Get 10% off your first order</h3>
                        <p className="text-teal-100 text-sm">Subscribe to our newsletter for deals & updates</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-1 sm:w-64 bg-white/20 border border-white/30 text-white placeholder-white/60 rounded-full px-4 py-2.5 text-sm outline-none focus:bg-white/30 transition"
                        />
                        <button className="bg-white text-[#01A49E] font-black text-sm px-5 py-2.5 rounded-full hover:bg-teal-50 transition shrink-0">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Main Footer ─────────────────────────────────────────── */}
            <div className="max-w-[1500px] mx-auto px-4 sm:px-8 py-10 sm:py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10">

                    {/* Brand col */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-5">
                            <div className="bg-gradient-to-r from-[#01A49E] to-emerald-500 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-black text-xl">S</span>
                            </div>
                            <div>
                                <h2 className="font-black text-white text-xl">SWOO</h2>
                                <p className="text-gray-400 text-xs font-medium -mt-0.5">TECH MART</p>
                            </div>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-xs">
                            Your #1 destination for the latest gadgets, electronics, and tech accessories at unbeatable prices.
                        </p>
                        <div className="space-y-2.5 text-sm">
                            <div className="flex items-center gap-2.5 text-gray-400">
                                <FiMapPin size={14} className="text-[#01A49E] shrink-0" />
                                <span>123 Tech Street, Silicon Valley, CA 94025</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-gray-400">
                                <FiPhone size={14} className="text-[#01A49E] shrink-0" />
                                <span>(025) 3886 25 16</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-gray-400">
                                <FiMail size={14} className="text-[#01A49E] shrink-0" />
                                <span>support@swootechmart.com</span>
                            </div>
                        </div>
                        {/* Social Icons */}
                        <div className="flex gap-3 mt-5">
                            {[
                                { icon: <FiFacebook size={16} />, href: '#' },
                                { icon: <FiTwitter size={16} />, href: '#' },
                                { icon: <FiInstagram size={16} />, href: '#' },
                                { icon: <FiYoutube size={16} />, href: '#' },
                            ].map((s, i) => (
                                <a key={i} href={s.href}
                                    className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-[#01A49E] text-gray-400 hover:text-white flex items-center justify-center transition border border-gray-700 hover:border-[#01A49E]">
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {footerLinks.map((col) => (
                        <div key={col.title}>
                            <h4 className="text-white font-bold text-sm uppercase tracking-wide mb-4">{col.title}</h4>
                            <ul className="space-y-2.5">
                                {col.links.map((link) => (
                                    <li key={link}>
                                        <Link href="/store"
                                            className="text-gray-400 text-sm hover:text-[#01A49E] transition hover:translate-x-0.5 inline-block">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Bottom Bar ──────────────────────────────────────────── */}
            <div className="border-t border-gray-800 px-4 sm:px-8 py-5">
                <div className="max-w-[1500px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-xs">
                        © {new Date().getFullYear()} Swoo Tech Mart. All rights reserved.
                    </p>
                    {/* Payment icons */}
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs mr-1">We accept:</span>
                        {paymentIcons.map((p) => (
                            <span key={p} className="bg-gray-800 border border-gray-700 text-gray-400 text-[9px] font-bold px-2 py-1 rounded">
                                {p}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

        </footer>
    )
}
