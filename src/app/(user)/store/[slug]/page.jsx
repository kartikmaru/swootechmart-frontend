import { getProducts } from "@/API/helpAPI";
import ProductCard from "@/components/user/Store/ProductCard";
import Pagination from "@/components/user/Store/Pagination";

export const dynamic = 'force-dynamic';

const PRODUCTS_PER_PAGE = 20

export default async function Page({ params, searchParams }) {
    const { slug: category_slug } = await params

    const search_params = await searchParams
    const brand_slug = search_params.brand_slug
    const color_slug = search_params.color_slug
    const min_price  = search_params.min_price
    const max_price  = search_params.max_price
    const sort       = search_params.sort
    const page       = parseInt(search_params.page) || 1

    const product_response = await getProducts({
        status:   true,
        brand_slug,
        category_slug,
        color_slug,
        min_price,
        max_price,
        sort,
        limit:    1000,
    })

    const allData    = product_response?.data || []
    const meta       = product_response?.meta || {}
    const totalPages = Math.ceil(allData.length / PRODUCTS_PER_PAGE)

    const start = (page - 1) * PRODUCTS_PER_PAGE
    const data  = allData.slice(start, start + PRODUCTS_PER_PAGE)

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4 min-h-[400px] sm:min-h-[500px] content-start">
                {data.map((prod) => (
                    <ProductCard
                        key={prod._id}
                        product={prod}
                        image={`${meta.imageBaseUrl || ''}${prod.thumbnail}`}
                        user={null}
                    />
                ))}
            </div>

            {data.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    <p className="text-lg font-semibold">No products found</p>
                    <p className="text-sm mt-1">Try adjusting your filters</p>
                </div>
            )}

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                searchParams={search_params}
            />
        </div>
    )
}
