import { getCategories } from "@/API/helpAPI";
import Link from "next/link";

export default async function CategorySidebar() {

    const CategoryResponse = await getCategories({ limit: 8, is_home: true, status: true })
    const { data, meta } = CategoryResponse;

    return (
        <div className="w-full max-w-[220px] shrink-0 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">

            {/* Title */}
            <h2 className="text-sm font-black text-gray-800 uppercase tracking-wide">
                Categories
            </h2>
            <div className="w-full h-[2px] bg-gray-100 mt-2 mb-3 relative">
                <div className="absolute left-0 top-0 h-full w-12 bg-[#01A49E] rounded-full" />
            </div>

            {/* Category List */}
            <div className="space-y-1.5">
                {data.map((cat, index) => (
                    <Link
                        key={index}
                        href={`/store/${cat.slug}`}
                        className="flex items-center justify-between bg-gray-50 hover:bg-teal-50 hover:border-[#01A49E]/30 border border-transparent rounded-xl px-3 py-2.5 transition-all duration-200 group"
                    >
                        <div className="flex items-center gap-2.5 text-gray-700 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 group-hover:border-[#01A49E]/30 flex items-center justify-center shrink-0 overflow-hidden">
                                <img
                                    height={18}
                                    width={18}
                                    src={`${meta.ImageBaseUrl}${cat.image}`}
                                    alt={cat.name}
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xs font-semibold group-hover:text-[#01A49E] transition truncate">
                                {cat.name}
                            </span>
                        </div>
                        <span className="bg-teal-100 text-teal-600 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-1">
                            {cat.count || 0}
                        </span>
                    </Link>
                ))}

                {/* All Categories link */}
                <Link
                    href="/store"
                    className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#01A49E] hover:bg-teal-50 rounded-xl py-2 transition mt-1 border border-dashed border-[#01A49E]/30"
                >
                    View All Categories →
                </Link>
            </div>
        </div>
    )
}