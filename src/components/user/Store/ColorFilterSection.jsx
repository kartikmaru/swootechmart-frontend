"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheck } from "react-icons/fa";

export default function ColorFilterSection({ colorRes }) {

    const router = useRouter()
    const search_params = useSearchParams()

    let select_colors = search_params.get("color_slug")
        ? search_params.get("color_slug").split(",")
        : [];

    const { data } = colorRes

    function filterHandler(slug) {
        let update_color = []

        if (select_colors.includes(slug)) {
            update_color = select_colors.filter((c) => c !== slug)
        } else {
            update_color = [...select_colors, slug]
        }

        const query = new URLSearchParams(search_params.toString())

        if (update_color.length > 0) {
            query.set("color_slug", update_color.join(","))
        } else {
            query.delete("color_slug")
        }

       router.push(`?${query.toString()}`, { scroll: false })
    }

    function clearColors() {
        const query = new URLSearchParams(search_params.toString())
        query.delete("color_slug")
        router.push(`?${query.toString()}`, { scroll: false })
    }

    return (
        <div className="w-full max-w-[280px] bg-[#f0f2f8] p-6 rounded-lg font-sans">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold uppercase text-black tracking-wide">
                    By Color
                </h2>
                <button
                    onClick={clearColors}
                    className="text-sm font-medium text-teal-500 hover:text-teal-600 transition-colors"
                >
                    Clear
                </button>
            </div>

            <div className="flex flex-wrap gap-4 pl-1">
                {data.map((color) => {
                    const isSelected = select_colors.includes(color.slug)

                    return (
                        <button
                            onClick={() => filterHandler(color.slug)}
                            key={color._id}
                            title={color.name}
                            className={`relative h-9 w-9 rounded-full shadow-sm ring-1 ring-black/10 flex items-center justify-center
                            ${isSelected ? "scale-110 ring-2 ring-teal-500" : ""}
                            hover:scale-105 transition-all`}
                            style={{ backgroundColor: color.color_code }}
                        >
                            {/* ✅ Check Icon */}
                            {isSelected && (
                                <FaCheck className="text-white text-xs" />
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    );
}