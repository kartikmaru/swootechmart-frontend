"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FiHome, FiChevronRight } from "react-icons/fi"

export function BreadcrumbBar() {
    const pathname = usePathname()
    // Build crumbs from pathname
    const segments = pathname.split('/').filter(Boolean)

    return (
        <div className="flex items-center gap-1.5 text-sm py-1">
            <Link href="/" className="flex items-center gap-1 text-gray-400 hover:text-[#01A49E] transition font-medium">
                <FiHome size={14} />
                <span>Home</span>
            </Link>
            {segments.map((seg, i) => {
                const href = '/' + segments.slice(0, i + 1).join('/')
                const isLast = i === segments.length - 1
                const label = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ')
                return (
                    <span key={i} className="flex items-center gap-1.5">
                        <FiChevronRight size={13} className="text-gray-300" />
                        {isLast
                            ? <span className="text-gray-800 font-semibold">{label}</span>
                            : <Link href={href} className="text-gray-400 hover:text-[#01A49E] transition font-medium">{label}</Link>
                        }
                    </span>
                )
            })}
        </div>
    )
}
