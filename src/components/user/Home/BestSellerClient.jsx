'use client'

import { useState } from 'react'
import Link from 'next/link'
import HomeProductCard from './HomeProductCard'

const TABS = ['Best Seller', 'New In', 'Popular']

function EmptyState({ tab }) {
    return (
        <div className="col-span-6 py-16 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl">📦</div>
            <p className="text-gray-500 font-semibold text-sm">No products in {tab}</p>
            <Link href="/store" className="text-xs text-[#01A49E] font-bold hover:underline">Browse Store →</Link>
        </div>
    )
}

export default function BestSellerClient({ tabsData, imageBaseUrl = '' }) {
    const [activeTab, setActiveTab] = useState('Best Seller')
    const currentProducts = tabsData[activeTab] || []

    return (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Tabs + View All */}
            <div className="flex items-center justify-between px-3 sm:px-5 pt-4 pb-0 border-b border-gray-100">
                <div className="flex gap-0 overflow-x-auto scrollbar-hide">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3.5 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all duration-200 whitespace-nowrap
                                ${activeTab === tab
                                    ? 'border-[#01A49E] text-[#01A49E]'
                                    : 'border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-200'}`}
                        >
                            {tab}
                            {tabsData[tab]?.length > 0 && (
                                <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-black
                                    ${activeTab === tab ? 'bg-[#01A49E]/15 text-[#01A49E]' : 'bg-gray-100 text-gray-400'}`}>
                                    {tabsData[tab].length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
                <Link href="/store" className="text-xs text-[#01A49E] font-semibold hover:underline mb-3 shrink-0 ml-2">
                    View All →
                </Link>
            </div>

            {/* Products Grid */}
            <div key={activeTab} className="p-3 sm:p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {currentProducts.length === 0
                    ? <EmptyState tab={activeTab} />
                    : currentProducts.map(p => (
                        <HomeProductCard
                            key={p.id}
                            product={p}
                            imageBaseUrl={imageBaseUrl}
                        />
                    ))
                }
            </div>
        </section>
    )
}
