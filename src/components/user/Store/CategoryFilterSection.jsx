"use client"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { FiGrid } from "react-icons/fi"

export default function CategoryFilterSection({ catRes }) {
    const { data } = catRes
    const pathname = usePathname()

    return (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-wide">Categories</h3>
                <FiGrid size={14} className="text-gray-400" />
            </div>
            <div className="p-3 space-y-0.5">
                <Link href="/store"
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition
                        ${pathname === '/store'
                            ? 'bg-[#01A49E] text-white'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-[#01A49E]'}`}>
                    <span>All Categories</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold
                        ${pathname === '/store' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        All
                    </span>
                </Link>
                {data.map((cat) => {
                    const isActive = pathname === `/store/${cat.slug}`
                    return (
                        <Link key={cat._id} href={`/store/${cat.slug}`} scroll={false}>
                            <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer
                                ${isActive
                                    ? 'bg-[#01A49E] text-white'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#01A49E]'}`}>
                                <span>{cat.name}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold
                                    ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    {cat.count || 0}
                                </span>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
