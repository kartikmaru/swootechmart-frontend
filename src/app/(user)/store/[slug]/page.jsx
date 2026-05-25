import { getProducts } from "@/API/helpAPI";
import ProductCard from "@/components/user/Store/ProductCard";

export default async function Page({ params, searchParams }) {
    const category_promise = await params;
    const category_slug = category_promise.slug || null

    const search_promise = await searchParams
    const brand_slug = search_promise.brand_slug
    const color_slug = search_promise.color_slug
    const min_price = search_promise.min_price
    const max_price = search_promise.max_price
    const sort = search_promise.sort

    const product_response = await getProducts({ status: true, brand_slug, category_slug, color_slug, min_price, max_price, sort });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {product_response?.data.map((prod) => {
                return (
                    <ProductCard
                        key={prod._id}
                        product={prod}
                        image={product_response?.meta?.imageBaseUrl + prod.thumbnail}
                        user={null}
                    />
                )
            })}

        </div>
    );
}