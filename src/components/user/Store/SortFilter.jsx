"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { FiSliders, FiGrid, FiList } from "react-icons/fi"

export default function SortFilter({ totalCount, filterDrawer }) {

    const router = useRouter()
    const search_params = useSearchParams()
    const sort = search_params.get("sort")

    function filterhandler(e) {
        const value = e.target.value
        const query = new URLSearchParams(search_params.toString())
        if (value === "latest") {
            query.delete("sort")
        } else {
            query.set("sort", value)
        }
        router.push(`?${query.toString()}`, { scroll: false })
    }

    return (
        <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm gap-2">

            {/* Left — result count */}
            <div className="flex items-center gap-2">
                <FiSliders size={15} className="text-[#01A49E] hidden lg:block" />
                <span className="text-sm text-gray-500 font-medium">
                    {totalCount !== undefined
                        ? <><strong className="text-gray-900">{totalCount}</strong> products found</>
                        : 'All Products'}
                </span>
            </div>

            {/* Right — sort dropdown & mobile filters */}
            <div className="flex items-center gap-2 sm:gap-3">
                {filterDrawer}
                <span className="text-xs text-gray-400 font-medium hidden sm:block">Sort by:</span>
                <select
                    onChange={filterhandler}
                    value={sort || 'latest'}
                    className="text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#01A49E]/30 focus:border-[#01A49E] transition cursor-pointer"
                >
                    <option value="latest">Latest</option>
                    <option value="asc">Price: Low → High</option>
                    <option value="dsc">Price: High → Low</option>
                </select>
            </div>
        </div>
    )
}
