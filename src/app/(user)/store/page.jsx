import { getProducts } from '@/API/helpAPI'
import ProductCard from '@/components/user/Store/ProductCard'
import React from 'react'

export const dynamic = 'force-dynamic';

export default async function page({ searchParams }) {
    const search_params = await searchParams
    const brand_slug  = search_params.brand_slug
    const color_slug  = search_params.color_slug
    const min_price   = search_params.min_price
    const max_price   = search_params.max_price
    const sort        = search_params.sort

    const product_Res = await getProducts({ status: true, brand_slug, color_slug, min_price, max_price, sort })
    const { data, meta } = product_Res

    return (
        // 1 col mobile → 2 sm → 3 md → 4 xl → 5 2xl → 6 on very large screens (3xl+)
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 3xl:grid-cols-6">
            {data.map((product) => (
                <ProductCard
                    key={product._id}
                    product={product}
                    image={`${meta.imageBaseUrl}${product.thumbnail}`}
                />
            ))}
        </div>
    )
}
