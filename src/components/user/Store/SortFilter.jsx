"use client"

import { useRouter, useSearchParams } from "next/navigation";

export default function SortFilter() {

    const router = useRouter()
    const search_params = useSearchParams()
    const sort = search_params.get("sort")



    function filterhandler(e) {
        const value = e.target.value

        const query = new URLSearchParams(search_params.toString())

        if (value == "latest") {
            query.delete("sort")
        }
        else {
            query.set("sort", value)
        }

        router.push(`?${query.toString()}`, { scroll: false })



    }

    return (
        <div className="w-full max-w-[280px] bg-[#f0f2f8] px-5 py-4 rounded-xl shadow-sm font-sans">

            {/* Title */}
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
                Sort By
            </h2>

            {/* Dropdown */}
            <div className="relative">
                <select
                    onChange={filterhandler}
                    className="w-full appearance-none px-3 py-2.5 pr-9 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 shadow-sm outline-none
          hover:border-gray-300 focus:ring-2 focus:ring-teal-400 transition"
                >
                    <option value={"latest"}>Latest</option>
                    <option value={"asc"}>Price: Low → High</option>
                    <option value={"dsc"}>Price: High → Low</option>
                </select>

                {/* Custom Arrow */}
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    ▼
                </div>
            </div>

        </div>
    );
}