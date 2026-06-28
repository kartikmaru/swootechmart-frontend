import { getProducts } from '@/API/helpAPI'
import ProductCard from '@/components/user/Store/ProductCard'
import Pagination from '@/components/user/Store/Pagination'
import React from 'react'

export const dynamic = 'force-dynamic';

const PRODUCTS_PER_PAGE = 20

export default async function page({ searchParams }) {
    const search_params = await searchParams

    const brand_slug = search_params.brand_slug
    const color_slug = search_params.color_slug
    const min_price  = search_params.min_price
    const max_price  = search_params.max_price
    const sort       = search_params.sort
    const page       = parseInt(search_params.page) || 1

    // Fetch ALL matching products then paginate
    // (backend doesn't support offset pagination with filters easily)
    const product_Res = await getProducts({
        status:     true,
        brand_slug,
        color_slug,
        min_price,
        max_price,
        sort,
        limit:      1000,   // fetch all matching, we paginate on frontend
    })

    const allData    = product_Res?.data || []
    const meta       = product_Res?.meta || {}
    const total      = allData.length
    const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE)

    // Slice for current page
    const start   = (page - 1) * PRODUCTS_PER_PAGE
    const data    = allData.slice(start, start + PRODUCTS_PER_PAGE)

    return (
        <div className="space-y-6">
            {/* Products grid — min-height ensures pagination always stays at bottom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 3xl:grid-cols-6 min-h-[400px] sm:min-h-[500px] content-start">
                {data.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        image={`${meta.imageBaseUrl || ''}${product.thumbnail}`}
                    />
                ))}
            </div>

            {/* No products */}
            {data.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    <p className="text-lg font-semibold">No products found</p>
                    <p className="text-sm mt-1">Try adjusting your filters</p>
                </div>
            )}

            {/* Pagination — only shown when more than 20 products */}
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                searchParams={search_params}
            />
        </div>
    )
}
