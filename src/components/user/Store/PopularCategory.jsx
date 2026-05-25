import { getCategories } from '@/API/helpAPI';
import Image from 'next/image';
import Link from 'next/link';

export default async function PopularCategories() {

    const categoriesRes = await getCategories({ limit: 10, is_popular: true, status: true })
    const { data, meta } = categoriesRes

    return (
        <section className="bg-white p-8 font-sans">
            <div className=" mx-auto">
                <h2 className="text-xl font-bold uppercase mb-8 text-black tracking-tight">
                    Popular Categories
                </h2>

                {/* Responsive Grid: 1 col on mobile, 2 on tablet, 5 on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-12 gap-x-12">
                    {data.map((category, index) => (
                        <Link
                            href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                            key={index}
                            className="group flex items-center justify-between hover:opacity-80 transition-opacity"
                        >
                            <div className="flex  flex-col">
                                <span className="font-bold text-gray-900 text-sm md:text-base">
                                    {category.name}
                                </span>
                                <span className="text-gray-500 text-xs md:text-sm">
                                    {category.count} Items
                                </span>
                            </div>

                            <div className="relative w-10 h-10 flex-shrink-0">
                                <img src={`${meta.ImageBaseUrl}${category.image}`} alt={category.name} className="object-contain" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}