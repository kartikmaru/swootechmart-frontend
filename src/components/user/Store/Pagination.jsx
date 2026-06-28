import Link from 'next/link'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

/**
 * URL-based Pagination component for Next.js Server Components
 * Adds/updates ?page= query param in the URL
 * All existing query params (filters, sort) are preserved
 */
export default function Pagination({ currentPage, totalPages, searchParams }) {
    if (totalPages <= 1) return null

    // Build URL with updated page param while preserving existing filters
    const buildUrl = (page) => {
        const params = new URLSearchParams()
        // Preserve all existing search params
        Object.entries(searchParams || {}).forEach(([key, val]) => {
            if (key !== 'page' && val) params.set(key, val)
        })
        if (page > 1) params.set('page', page)
        const query = params.toString()
        return query ? `?${query}` : '?'
    }

    // Generate page numbers with ellipsis for large page counts
    const getPageNumbers = () => {
        const pages = []
        const delta = 2   // pages to show on each side of current

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                pages.push(i)
            } else if (
                i === currentPage - delta - 1 ||
                i === currentPage + delta + 1
            ) {
                pages.push('...')
            }
        }

        // Remove duplicate ellipses
        return pages.filter((p, i) => !(p === '...' && pages[i - 1] === '...'))
    }

    const pageNums = getPageNumbers()

    const btnBase = "flex items-center justify-center h-9 min-w-[36px] px-2 rounded-xl text-sm font-semibold transition border"
    const activeBtn = `${btnBase} bg-[#01A49E] text-white border-[#01A49E]`
    const normalBtn = `${btnBase} bg-white text-gray-600 border-gray-200 hover:border-[#01A49E] hover:text-[#01A49E]`
    const disabledBtn = `${btnBase} bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed`
    const ellipsisBtn = `${btnBase} bg-transparent border-transparent text-gray-400 pointer-events-none`

    return (
        <div className="flex items-center justify-center gap-1.5 flex-wrap py-4">
            {/* Previous */}
            {currentPage > 1 ? (
                <Link href={buildUrl(currentPage - 1)} scroll={false} className={normalBtn} aria-label="Previous page">
                    <FiChevronLeft size={16} />
                </Link>
            ) : (
                <span className={disabledBtn} aria-disabled>
                    <FiChevronLeft size={16} />
                </span>
            )}

            {/* Page numbers */}
            {pageNums.map((p, i) =>
                p === '...' ? (
                    <span key={`ellipsis-${i}`} className={ellipsisBtn}>…</span>
                ) : (
                    <Link
                        key={p}
                        href={buildUrl(p)}
                        scroll={false}
                        className={p === currentPage ? activeBtn : normalBtn}
                        aria-current={p === currentPage ? 'page' : undefined}
                    >
                        {p}
                    </Link>
                )
            )}

            {/* Next */}
            {currentPage < totalPages ? (
                <Link href={buildUrl(currentPage + 1)} scroll={false} className={normalBtn} aria-label="Next page">
                    <FiChevronRight size={16} />
                </Link>
            ) : (
                <span className={disabledBtn} aria-disabled>
                    <FiChevronRight size={16} />
                </span>
            )}

            {/* Page info */}
            <span className="text-xs text-gray-400 font-medium ml-2">
                Page {currentPage} of {totalPages}
            </span>
        </div>
    )
}
