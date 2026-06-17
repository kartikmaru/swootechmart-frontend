// BestSeller.jsx — Server Component
// Ye server pe chalega, teen tabs ke liye alag-alag API calls karke data fetch karega
// Phir BestSellerClient ko data pass karega jo tabs handle karega

import { getProducts } from '@/API/helpAPI'
import BestSellerClient from './BestSellerClient'

export default async function BestSeller() {

    // Teen alag API calls — parallel chalenge (Promise.all)
    // top_selling=true  → Best Seller tab
    // sort=latest       → New In tab (nayi products)
    // status=true limit → Popular tab (top 6 products)
    const [topRes, newRes, popularRes] = await Promise.allSettled([
        getProducts({ top_selling: true, status: true, limit: 6 }),
        getProducts({ status: true, sort: 'latest', limit: 6 }),
        getProducts({ status: true, limit: 6 }),
    ])

    const imageBaseUrl = topRes.value?.meta?.imageBaseUrl || newRes.value?.meta?.imageBaseUrl || ''

    // API data ko HomeProductCard ke liye shape karo
    function mapProducts(res) {
        return (res.value?.data || []).map(p => ({
            _id:            p._id,
            id:             p._id,
            name:           p.name,
            final_price:    p.final_price,
            original_price: p.original_price,
            discount:       p.discount,
            stock:          p.stock,
            thumbnail:      p.thumbnail,      // HomeProductCard imageBaseUrl + thumbnail use karega
            slug:           p.slug,
            category_name:  p.category_Id?.name || '',
        }))
    }

    const tabsData = {
        'Best Seller': mapProducts(topRes),
        'New In':      mapProducts(newRes),
        'Popular':     mapProducts(popularRes),
    }

    return <BestSellerClient tabsData={tabsData} imageBaseUrl={imageBaseUrl} />
}
