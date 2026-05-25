import { getProducts } from '@/API/helpAPI'
import { BreadcrumbBar } from '@/components/user/Store/BreadCrumps'
import CategoryFilterSection from '@/components/user/Store/CategoryFilterSection'
import CategoryStore from '@/components/user/Store/CategoryFilterSection'
import ColorFilterSection from '@/components/user/Store/ColorFilterSection'
import ColorSection from '@/components/user/Store/ColorFilterSection'
import PopularCategories from '@/components/user/Store/PopularCategory'
import PriceFilterSection from '@/components/user/Store/PriceFilterSection'
import ProductCard from '@/components/user/Store/ProductCard'
import { ShopHero } from '@/components/user/Store/ShopHero'
import React from 'react'

export default async function page({ searchParams }) {

    const search_params = await searchParams
    const brand_slug = search_params.brand_slug
    const color_slug = search_params.color_slug
    const min_price = search_params.min_price
    const max_price = search_params.max_price
    const sort = search_params.sort

    const product_Res = await getProducts({ status: true, brand_slug, color_slug, min_price, max_price, sort })
    const { data, meta } = product_Res


    return (
        <>
            <div className='grid grid-cols-5 gap-4'>
                {
                    data.map((product) => (
                        <ProductCard product={product} key={product._id} image={`${meta.imageBaseUrl}${product.thumbnail}`} />
                    ))
                }
            </div>
        </>
    )
}
