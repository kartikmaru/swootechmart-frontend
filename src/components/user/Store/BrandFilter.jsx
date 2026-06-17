"use client"
import { useRouter, useSearchParams } from "next/navigation"

export default function BrandFilter({ brandRes }) {
    const { data, meta } = brandRes
    const router = useRouter()
    const searchParams = useSearchParams()
    const selectedBrand = searchParams.get("brand_slug")

    function filterHandler(slug) {
        const query = new URLSearchParams(searchParams.toString())
        slug === selectedBrand ? query.delete("brand_slug") : query.set("brand_slug", slug)
        router.push(`?${query.toString()}`, { scroll: false })
    }

    function clearBrand() {
        const query = new URLSearchParams(searchParams.toString())
        query.delete("brand_slug")
        router.push(`?${query.toString()}`, { scroll: false })
    }

    return (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-wide">Brands</h3>
                {selectedBrand && (
                    <button onClick={clearBrand} className="text-xs text-[#01A49E] font-semibold hover:underline">
                        Clear
                    </button>
                )}
            </div>
            <div className="p-3 space-y-0.5">
                {data.map((brand) => {
                    const isActive = selectedBrand === brand.slug
                    return (
                        <div
                            key={brand._id}
                            onClick={() => filterHandler(brand.slug)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all
                                ${isActive
                                    ? 'bg-[#01A49E]/10 border border-[#01A49E]/30'
                                    : 'hover:bg-gray-50 border border-transparent'}`}
                        >
                            {/* Active bar */}
                            <div className={`w-1 h-6 rounded-full transition-all ${isActive ? 'bg-[#01A49E]' : 'bg-transparent'}`} />

                            {/* Logo */}
                            <div className="w-8 h-8 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                                <img
                                    src={`${meta.imageBaseUrl}${brand.image}`}
                                    alt={brand.name}
                                    className="w-6 h-6 object-contain"
                                />
                            </div>

                            {/* Name */}
                            <span className={`text-sm font-semibold flex-1 transition ${isActive ? 'text-[#01A49E]' : 'text-gray-700'}`}>
                                {brand.name}
                            </span>

                            {isActive && (
                                <div className="w-2 h-2 rounded-full bg-[#01A49E]" />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
