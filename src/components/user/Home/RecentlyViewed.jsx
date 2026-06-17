'use client'

// RecentlyViewed — real data localStorage/Redux se
// Jab user koi product detail page visit karta hai →
//   ProductDetailClient me useEffect → dispatch(addRecentlyViewed({...}))
//   → Redux state + localStorage me save
// Yahan useSelector se wo list read hoti hai aur display hoti hai

import { useSelector } from 'react-redux'
import Link from 'next/link'
import { FiChevronLeft, FiChevronRight, FiClock } from 'react-icons/fi'
import { useState } from 'react'

export default function RecentlyViewed() {

    const recentlyViewed = useSelector(s => s.cart.recentlyViewed || [])
    const [start, setStart] = useState(0)
    const visible = 5   // ek baar me kitne dikhane hain

    // Koi viewed nahi hai toh section hide karo
    if (recentlyViewed.length === 0) return null

    const visibleItems = recentlyViewed.slice(start, start + visible)

    return (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <FiClock size={14} className="text-[#01A49E]" />
                    <h2 className="font-black text-gray-900 text-sm uppercase tracking-wide">
                        Your Recently Viewed
                    </h2>
                    <span className="bg-[#01A49E]/10 text-[#01A49E] text-[10px] font-black px-2 py-0.5 rounded-full">
                        {recentlyViewed.length}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/store" className="text-xs text-[#01A49E] font-semibold hover:underline mr-2">
                        Show All
                    </Link>
                    <button
                        onClick={() => setStart(s => Math.max(0, s - 1))}
                        disabled={start === 0}
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#01A49E] hover:border-[#01A49E] transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <FiChevronLeft size={13} />
                    </button>
                    <button
                        onClick={() => setStart(s => Math.min(recentlyViewed.length - visible, s + 1))}
                        disabled={start + visible >= recentlyViewed.length}
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#01A49E] hover:border-[#01A49E] transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <FiChevronRight size={13} />
                    </button>
                </div>
            </div>

            {/* Items — 2 cols mobile, 3 sm, 5 md+ */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 divide-x divide-gray-100">
                {visibleItems.map((item) => (
                    <Link
                        key={item.id}
                        href={`/product/${item.id}`}
                        className="p-4 cursor-pointer hover:bg-gray-50 transition group"
                    >
                        {/* Image */}
                        <div className="relative mb-3">
                            {item.discount > 0 && (
                                <span className="absolute top-1 left-1 bg-[#01A49E] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full z-10">
                                    -{item.discount}%
                                </span>
                            )}
                            <div className="w-full h-28 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100">
                                <img
                                    src={item.thumbnail}
                                    alt={item.name}
                                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        </div>

                        {/* Name */}
                        <p className="text-xs font-semibold text-gray-800 leading-snug mb-1.5 line-clamp-2 group-hover:text-[#01A49E] transition-colors">
                            {item.name}
                        </p>

                        {/* Price */}
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="text-sm font-black text-gray-900">
                                ₹{item.final_price?.toLocaleString('en-IN')}
                            </span>
                            {item.original_price > item.final_price && (
                                <span className="text-[10px] text-gray-400 line-through">
                                    ₹{item.original_price?.toLocaleString('en-IN')}
                                </span>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
