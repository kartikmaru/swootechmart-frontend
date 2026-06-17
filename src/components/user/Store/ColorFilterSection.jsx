"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { FaCheck } from "react-icons/fa"

export default function ColorFilterSection({ colorRes }) {
    const router = useRouter()
    const search_params = useSearchParams()

    let select_colors = search_params.get("color_slug")
        ? search_params.get("color_slug").split(",")
        : []

    const { data } = colorRes

    function filterHandler(slug) {
        let updated = select_colors.includes(slug)
            ? select_colors.filter(c => c !== slug)
            : [...select_colors, slug]

        const query = new URLSearchParams(search_params.toString())
        updated.length > 0 ? query.set("color_slug", updated.join(",")) : query.delete("color_slug")
        router.push(`?${query.toString()}`, { scroll: false })
    }

    function clearColors() {
        const query = new URLSearchParams(search_params.toString())
        query.delete("color_slug")
        router.push(`?${query.toString()}`, { scroll: false })
    }

    return (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-wide">Color</h3>
                {select_colors.length > 0 && (
                    <button onClick={clearColors} className="text-xs text-[#01A49E] font-semibold hover:underline">
                        Clear ({select_colors.length})
                    </button>
                )}
            </div>
            <div className="p-4">
                <div className="flex flex-wrap gap-2.5">
                    {data.map((color) => {
                        const isSelected = select_colors.includes(color.slug)
                        return (
                            <button
                                onClick={() => filterHandler(color.slug)}
                                key={color._id}
                                title={color.name}
                                className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm
                                    ${isSelected
                                        ? 'ring-2 ring-offset-2 ring-[#01A49E] scale-110'
                                        : 'ring-1 ring-black/10 hover:scale-110 hover:ring-[#01A49E]/50'}`}
                                style={{ backgroundColor: color.color_code }}
                            >
                                {isSelected && <FaCheck className="text-white drop-shadow text-[9px]" />}
                            </button>
                        )
                    })}
                </div>
                {select_colors.length > 0 && (
                    <p className="text-[10px] text-gray-400 mt-3 font-medium">
                        {select_colors.length} color{select_colors.length > 1 ? 's' : ''} selected
                    </p>
                )}
            </div>
        </div>
    )
}
