import CategoryFilterSection from './CategoryFilterSection'
import PriceFilterSection from './PriceFilterSection'
import ColorFilterSection from './ColorFilterSection'
import BrandFilter from './BrandFilter'
import { getBrands, getCategories, getColors, getProducts } from '@/API/helpAPI'

export default async function StoreSideSection() {

    // Fetch categories, colors, brands, and ALL products in parallel.
    // Products are needed to calculate per-category counts server-side.
    // limit: 1000 fetches all products in one shot — same call already used
    // by the store page, so this is consistent with existing behaviour.
    const [catRes, colorRes, brandRes, productRes] = await Promise.all([
        getCategories({ status: true }),
        getColors({ status: true }),
        getBrands({ status: true }),
        getProducts({ limit: 1000 }),
    ])

    // Build a category-id → product count map in O(n) using reduce.
    // product.category_Id is populated: { _id, name } — we key by _id string.
    // This runs once on the server per request — no client re-renders.
    const products = productRes?.data ?? []
    const countMap = products.reduce((acc, product) => {
        const catId = product?.category_Id?._id?.toString()
        if (catId) {
            acc[catId] = (acc[catId] ?? 0) + 1
        }
        return acc
    }, {})

    // Inject the computed count into each category object.
    // We create new objects (spread) so the original catRes is not mutated.
    // count defaults to 0 if no products exist for that category.
    const enrichedCatRes = {
        ...catRes,
        data: (catRes?.data ?? []).map(cat => ({
            ...cat._doc ?? cat,                          // unwrap Mongoose doc if needed
            count: countMap[cat._id?.toString()] ?? 0,
        })),
    }

    return (
        <aside className='space-y-2 w-[280px]'>
            <CategoryFilterSection catRes={enrichedCatRes} />
            <PriceFilterSection />
            <ColorFilterSection colorRes={colorRes} />
            <BrandFilter brandRes={brandRes} />
        </aside>
    )
}
