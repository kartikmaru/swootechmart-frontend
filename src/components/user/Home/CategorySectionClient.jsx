'use client'

import { useState, useMemo } from 'react'
import { FiChevronRight } from 'react-icons/fi'
import Link from 'next/link'
import HomeProductCard from './HomeProductCard'

export default function CategorySectionClient({
    title,
    defaultSlug,
    defaultCategoryId,
    heroBg,
    heroTitle,
    heroSub,
    heroImg,
    products,
    imageBaseUrl,
    categories,
    catImageBase,
}) {
    const [selectedId, setSelectedId]     = useState(defaultCategoryId || '')
    const [selectedSlug, setSelectedSlug] = useState(defaultSlug || '')

    // Filter products by selected category _id
    const filtered = useMemo(() => {
        if (!selectedId) return products.slice(0, 6)
        return products
            .filter(p => p.category_id === selectedId)
            .slice(0, 6)
    }, [selectedId, products])

    function handleCatClick(cat) {
        if (selectedId === cat._id) {
            setSelectedId(defaultCategoryId || '')
            setSelectedSlug(defaultSlug || '')
        } else {
            setSelectedId(cat._id)
            setSelectedSlug(cat.slug)
        }
    }

    return (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                <h2 className="font-black text-gray-900 text-sm uppercase tracking-wide">{title}</h2>
                <Link
                    href={`/store?category_slug=${selectedSlug}`}
                    className="text-xs text-[#01A49E] font-semibold hover:underline flex items-center gap-0.5"
                >
                    View All <FiChevronRight size={12} />
                </Link>
            </div>

            <div className="p-3 sm:p-4 space-y-4">

                {/* Hero + Category Chips */}
                <div className="flex flex-col sm:flex-row gap-3">

                    {/* Hero banner — full width on mobile */}
                    <div className={`${heroBg} rounded-xl p-4 sm:w-48 lg:w-52 shrink-0 flex flex-col justify-between relative overflow-hidden min-h-[120px] sm:min-h-[150px]`}>
                        <div className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                        <div className="relative z-10">
                            <h3 className="text-white font-black text-sm leading-tight mb-1">{heroTitle}</h3>
                            <p className="text-white/70 text-xs">{heroSub}</p>
                        </div>
                        <div className="relative z-10 flex items-end justify-between gap-2">
                            <button
                                onClick={() => {
                                    setSelectedId(defaultCategoryId || '')
                                    setSelectedSlug(defaultSlug || '')
                                }}
                                className="bg-white/90 hover:bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-sm shrink-0"
                            >
                                Shop Now
                            </button>
                            {heroImg && (
                                <img src={heroImg} alt="" className="h-16 sm:h-20 object-contain drop-shadow-lg" />
                            )}
                        </div>
                    </div>

                    {/* Category chips — 2 col on mobile, 3 on sm+ */}
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {categories.slice(0, 6).map(cat => {
                            const isActive = selectedId === cat._id
                            const count    = products.filter(p => p.category_id === cat._id).length
                            return (
                                <button
                                    key={cat._id}
                                    onClick={() => handleCatClick(cat)}
                                    className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-xl transition-all duration-200 text-left border group
                                        ${isActive
                                            ? 'bg-[#01A49E]/10 border-[#01A49E]/40 shadow-sm'
                                            : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-[#01A49E]/20'}`}
                                >
                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden shrink-0 flex items-center justify-center transition
                                        ${isActive ? 'bg-[#01A49E]/10' : 'bg-gray-100'}`}>
                                        {cat.image
                                            ? <img src={catImageBase + cat.image} alt={cat.name} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
                                            : <span className="text-sm">📦</span>
                                        }
                                    </div>
                                    <div className="min-w-0">
                                        <p className={`text-xs font-bold leading-none truncate transition
                                            ${isActive ? 'text-[#01A49E]' : 'text-gray-800 group-hover:text-[#01A49E]'}`}>
                                            {cat.name}
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">{count} items</p>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Products Grid */}
                {filtered.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        <p className="text-sm font-semibold">No products in this category</p>
                        <button
                            onClick={() => { setSelectedId(defaultCategoryId || ''); setSelectedSlug(defaultSlug || '') }}
                            className="mt-2 text-xs text-[#01A49E] font-bold hover:underline"
                        >
                            Reset filter
                        </button>
                    </div>
                ) : (
                    <div key={selectedId} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                        {filtered.map(p => (
                            <HomeProductCard
                                key={p._id}
                                product={p}
                                imageBaseUrl={imageBaseUrl}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
