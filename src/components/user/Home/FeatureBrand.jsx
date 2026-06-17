import { getBrands } from "@/API/helpAPI";
import Link from "next/link";

export async function FeaturedBrands() {

    const res = await getBrands()
    const brands = res.data        // array of brand objects
    const meta   = res.meta        // imageBaseUrl

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 w-full shadow-sm">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-sm font-black text-gray-800 uppercase tracking-wide">
                        Featured Brands
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">Shop by your favourite brand</p>
                </div>
                <Link href="/store" className="text-xs text-[#01A49E] font-semibold hover:underline">
                    View All →
                </Link>
            </div>

            {/* Brands Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                {brands.map((brand) => (
                    <Link
                        key={brand._id}
                        href={`/store?brand_slug=${brand.slug}`}
                        className="group flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-teal-50 border border-gray-100 hover:border-[#01A49E]/40 rounded-xl p-3 transition-all duration-200"
                    >
                        {/* Logo */}
                        <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg border border-gray-200 group-hover:border-[#01A49E]/30 shadow-sm overflow-hidden transition">
                            <img
                                src={`${meta.imageBaseUrl}${brand.image}`}
                                alt={brand.name}
                                className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-200"
                            />
                        </div>
                        {/* Name */}
                        <span className="text-[11px] font-bold text-gray-600 group-hover:text-[#01A49E] text-center leading-tight transition truncate w-full text-center">
                            {brand.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
