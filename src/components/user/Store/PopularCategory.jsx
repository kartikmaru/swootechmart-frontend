import { getCategories } from '@/API/helpAPI'
import Link from 'next/link'

export default async function PopularCategories() {

    const categoriesRes = await getCategories({ limit: 10, is_popular: true, status: true })
    const { data, meta } = categoriesRes

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black uppercase text-gray-800 tracking-wide">Popular Categories</h2>
                <Link href="/store" className="text-xs text-[#01A49E] font-semibold hover:underline">View All</Link>
            </div>

            <div className="flex gap-2 flex-wrap">
                {data.map((category, index) => (
                    <Link
                        href={`/store/${category.slug}`}
                        key={index}
                        className="flex items-center gap-2.5 bg-white border border-gray-200 hover:border-[#01A49E] hover:bg-teal-50 px-3.5 py-2.5 rounded-2xl transition-all duration-200 group"
                    >
                        <div className="w-8 h-8 rounded-xl bg-gray-50 group-hover:bg-white flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
                            <img
                                src={`${meta.ImageBaseUrl}${category.image}`}
                                alt={category.name}
                                className="w-6 h-6 object-contain"
                            />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-800 group-hover:text-[#01A49E] transition leading-none">
                                {category.name}
                            </p>
                            {category.count !== undefined && (
                                <p className="text-[10px] text-gray-400 mt-0.5">{category.count} items</p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
