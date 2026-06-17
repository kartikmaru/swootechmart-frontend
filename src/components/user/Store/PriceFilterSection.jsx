'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { FiDollarSign } from "react-icons/fi"

export default function PriceFilterSection() {
    const router = useRouter()
    const search_params = useSearchParams()

    const MIN_LIMIT = 0
    const MAX_LIMIT = 500000

    const [min, setMin] = useState(Number(search_params.get("min_price")) || '')
    const [max, setMax] = useState(Number(search_params.get("max_price")) || '')

    function applyFilter() {
        const params = new URLSearchParams(search_params.toString())
        if (min) params.set('min_price', min); else params.delete('min_price')
        if (max) params.set('max_price', max); else params.delete('max_price')
        router.push(`?${params.toString()}`, { scroll: false })
    }

    function clearFilter() {
        const params = new URLSearchParams(search_params.toString())
        params.delete('min_price')
        params.delete('max_price')
        setMin(''); setMax('')
        router.push(`?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-wide">Price Range</h3>
                <button onClick={clearFilter} className="text-xs text-[#01A49E] font-semibold hover:underline">Clear</button>
            </div>
            <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-[10px] font-semibold text-gray-400 uppercase block mb-1">Min (₹)</label>
                        <input
                            type="number"
                            value={min}
                            onChange={e => setMin(e.target.value)}
                            placeholder="0"
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-[#01A49E]/30 focus:border-[#01A49E] transition"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-semibold text-gray-400 uppercase block mb-1">Max (₹)</label>
                        <input
                            type="number"
                            value={max}
                            onChange={e => setMax(e.target.value)}
                            placeholder="Any"
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-[#01A49E]/30 focus:border-[#01A49E] transition"
                        />
                    </div>
                </div>
                <button
                    onClick={applyFilter}
                    className="w-full bg-[#01A49E] hover:bg-[#01857f] text-white font-bold py-2.5 rounded-xl text-sm transition shadow-sm"
                >
                    Apply Filter
                </button>
            </div>
        </div>
    )
}
