// CategorySection.jsx — Server Component
// Saara data ek baar server pe fetch karta hai
// Phir CategorySectionClient ko pass karta hai jo filtering handle karta hai

import { getCategories, getProducts } from '@/API/helpAPI'
import CategorySectionClient from './CategorySectionClient'

export default async function CategorySection({
    title,
    categorySlug,
    heroBg = 'bg-gradient-to-br from-blue-600 to-blue-400',
    heroTitle,
    heroSub,
    heroImg,
}) {
    // Sab categories fetch karo (subcategory chips ke liye)
    const [allProductsRes, catRes] = await Promise.allSettled([
        getProducts({ status: true, limit: 50 }),   // sare products ek baar fetch
        getCategories({ status: true, limit: 10 }),
    ])

    const allProducts  = allProductsRes.value?.data || []
    const imageBaseUrl = allProductsRes.value?.meta?.imageBaseUrl || ''
    const subcats      = catRes.value?.data          || []
    const catImageBase = catRes.value?.meta?.ImageBaseUrl || ''

    // Har product ko serializable shape me convert karo (no non-plain objects)
    const products = allProducts.map(p => ({
        _id:            p._id,
        id:             p._id,
        name:           p.name,
        slug:           p.slug,
        final_price:    p.final_price,
        original_price: p.original_price,
        discount:       p.discount,
        stock:          p.stock,
        thumbnail:      p.thumbnail,
        category_id:    p.category_Id?._id   || '',
        category_name:  p.category_Id?.name  || '',
    }))

    const categories = subcats.map(c => ({
        _id:   c._id,
        name:  c.name,
        slug:  c.slug,
        image: c.image,
        count: c.count ?? 0,
    }))

    // defaultCategoryId — home page pe jo categorySlug diya hai uska _id dhundho
    const defaultCat = subcats.find(c => c.slug === categorySlug)
    const defaultCategoryId = defaultCat?._id || ''

    return (
        <CategorySectionClient
            title={title}
            defaultSlug={categorySlug}
            defaultCategoryId={defaultCategoryId}
            heroBg={heroBg}
            heroTitle={heroTitle}
            heroSub={heroSub}
            heroImg={heroImg}
            products={products}
            imageBaseUrl={imageBaseUrl}
            categories={categories}
            catImageBase={catImageBase}
        />
    )
}
