// MiniCategorySections — Server Component
// Real categories API se fetch karta hai
// Teen sections: Audios & Cameras, Gaming, Office Equipments
// Har subcategory chip pe click → /store?category_slug=x → filtered products

import { getCategories } from '@/API/helpAPI'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

// Teen sections ki config — har ek ka apna hero aur kaun si categories dikhani hain
// categorySlug → "View All" aur hero click pe ye slug use hoga
// showSlugs    → in slugs ki categories chips me dikhegi (API data se match karenge)
const SECTION_CONFIG = [
    {
        title:       'Audios & Cameras',
        categorySlug: 'headphones',
        heroBg:      'bg-gradient-to-br from-gray-900 to-gray-700',
        heroTitle:   'Best Speaker 2025',
        heroTag:     'New Arrival',
        heroImg:     'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=140&fit=crop',
        accent:      'from-purple-500 to-indigo-600',
        showSlugs:   ['headphones', 'cameras', 'smartphones', 'tablets'],
    },
    {
        title:       'Gaming',
        categorySlug: 'smartphones',
        heroBg:      'bg-gradient-to-br from-green-900 to-gray-900',
        heroTitle:   'ROG Gaming Setup',
        heroTag:     'Hot Deal',
        heroImg:     'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=140&fit=crop',
        accent:      'from-green-500 to-emerald-600',
        showSlugs:   ['televisions', 'smartphones', 'laptops', 'headphones'],
    },
    {
        title:       'Office Equipments',
        categorySlug: 'laptops',
        heroBg:      'bg-gradient-to-br from-blue-900 to-slate-800',
        heroTitle:   'Smart Laser Projector',
        heroTag:     'Best Seller',
        heroImg:     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=140&fit=crop',
        accent:      'from-blue-500 to-cyan-600',
        showSlugs:   ['laptops', 'tablets', 'cameras', 'kitchen-appliances'],
    },
]

export default async function MiniCategorySections() {

    // Saari categories ek baar fetch karo
    const res      = await getCategories({ status: true })
    const allCats  = res?.data  || []
    const imageBase = res?.meta?.ImageBaseUrl || ''

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTION_CONFIG.map((sec) => {

                // Is section ke liye showSlugs me se matching categories nikalo
                // Agar match nahi mila toh pehli 4 categories dikhao
                const sectionCats = sec.showSlugs
                    .map(slug => allCats.find(c => c.slug === slug))
                    .filter(Boolean)
                    .slice(0, 4)

                // Agar koi bhi match nahi toh pehli 4 show karo
                const displayCats = sectionCats.length > 0
                    ? sectionCats
                    : allCats.slice(0, 4)

                return (
                    <div key={sec.title}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

                        {/* ── Header ─────────────────────────────── */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                            <h3 className="font-black text-gray-900 text-xs uppercase tracking-wide">
                                {sec.title}
                            </h3>
                            <Link
                                href={`/store/${sec.categorySlug}`}
                                className="flex items-center gap-0.5 text-[10px] text-[#01A49E] font-bold hover:underline"
                            >
                                View All <FiArrowRight size={10} />
                            </Link>
                        </div>

                        <div className="p-3 flex flex-col gap-3 flex-1">

                            {/* ── Hero Banner → store filtered ─────── */}
                            <Link href={`/store/${sec.categorySlug}`}>
                                <div className={`${sec.heroBg} rounded-xl overflow-hidden relative flex items-center justify-between px-4 py-3 gap-2 min-h-[100px] cursor-pointer group hover:opacity-95 transition`}>
                                    <div className="absolute inset-0 opacity-10"
                                        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '14px 14px' }} />
                                    <div className="relative z-10">
                                        <span className={`inline-block bg-gradient-to-r ${sec.accent} text-white text-[9px] font-black px-2 py-0.5 rounded-full mb-1.5`}>
                                            {sec.heroTag}
                                        </span>
                                        <h4 className="text-white font-black text-sm leading-tight max-w-[120px]">
                                            {sec.heroTitle}
                                        </h4>
                                        <span className="inline-flex items-center gap-1 mt-2 text-white/80 text-[10px] font-semibold group-hover:text-white transition">
                                            Shop Now <FiArrowRight size={10} />
                                        </span>
                                    </div>
                                    <img
                                        src={sec.heroImg}
                                        alt={sec.heroTitle}
                                        className="h-20 w-20 object-contain relative z-10 drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            </Link>

                            {/* ── Real Category Chips ─────────────── */}
                            {/* 
                                Har chip ek real category hai API se
                                Click pe → /store?category_slug={cat.slug}
                                → store page pe us category ke products filter hoke dikhenge
                            */}
                            <div className="grid grid-cols-2 gap-2">
                                {displayCats.map((cat) => (
                                    <Link
                                        key={cat._id}
                                        href={`/store/${cat.slug}`}
                                        className="flex items-center gap-2.5 bg-gray-50 hover:bg-teal-50 border border-gray-100 hover:border-[#01A49E]/30 rounded-xl p-2 transition-all duration-200 group cursor-pointer"
                                    >
                                        {/* Category image */}
                                        <div className="w-11 h-11 rounded-full overflow-hidden bg-white border border-gray-200 group-hover:border-[#01A49E]/40 shrink-0 flex items-center justify-center shadow-sm">
                                            {cat.image
                                                ? <img
                                                    src={imageBase + cat.image}
                                                    alt={cat.name}
                                                    className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-200"
                                                />
                                                : <span className="text-xl">📦</span>
                                            }
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-gray-800 group-hover:text-[#01A49E] transition leading-none truncate">
                                                {cat.name}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">View products</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            })}
        </section>
    )
}
