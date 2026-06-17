import { getCategories } from "@/API/helpAPI";
import Link from "next/link";

export async function TopCategories() {

    const res  = await getCategories({ limit: 8, is_top: true, status: true })
    const cats = res.data
    const meta = res.meta   // ImageBaseUrl

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 w-full shadow-sm">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-sm font-black text-gray-800 uppercase tracking-wide">
                        Top Categories
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">Browse by category</p>
                </div>
                <Link href="/store" className="text-xs text-[#01A49E] font-semibold hover:underline">
                    View All →
                </Link>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {cats.map((cat) => (
                    <Link
                        key={cat._id}
                        href={`/store/${cat.slug}`}
                        className="group flex flex-col items-center gap-2 bg-gray-50 hover:bg-teal-50 border border-gray-100 hover:border-[#01A49E]/40 rounded-xl p-3 transition-all duration-200 text-center"
                    >
                        {/* Image */}
                        <div className="w-12 h-12 flex items-center justify-center bg-white rounded-xl border border-gray-200 group-hover:border-[#01A49E]/30 shadow-sm overflow-hidden transition">
                            <img
                                src={`${meta.ImageBaseUrl}${cat.image}`}
                                alt={cat.name}
                                className="w-9 h-9 object-contain group-hover:scale-110 transition-transform duration-200"
                            />
                        </div>

                        {/* Name */}
                        <span className="text-[11px] font-bold text-gray-600 group-hover:text-[#01A49E] leading-tight transition line-clamp-2">
                            {cat.name}
                        </span>
                    </Link>
                ))}
            </div>

        </div>
    )
}
