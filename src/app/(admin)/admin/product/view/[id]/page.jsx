"use client"
import { findProductById, getProducts } from "@/API/helpAPI"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProductDetailPage() {

    const [loading, setLoading] = useState(true)
    const [product, setProduct] = useState({})
    const [meta, setMeta] = useState({})
    const ImageBaseUrl = "http://localhost:5000/product/"

    const { id } = useParams()

    async function ShowProduct() {

        setLoading(true)
        const { data, meta } = await findProductById(id)
        setProduct(data)
        setMeta(meta)
        setLoading(false)
    }

    useEffect(
        () => {
            ShowProduct()
        },
        [id]
    )


    if (loading) {
        return <div className="p-10">Loading...</div>
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Image Gallery */}
                    <div className="lg:w-1/2 space-y-4">
                        <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden p-6">
                            <img
                                src={`${ImageBaseUrl}${product?.thumbnail}`}
                                alt={product.thumbnail}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="flex gap-3">
                            {/* {product.images.map((img, i) => (
                                <div key={i} className="w-20 h-20 rounded-lg border p-2 bg-white overflow-hidden">
                                    <img src={img} alt="Gallery" className="w-full h-full object-contain" />
                                </div>
                            ))} */}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="lg:w-1/2 space-y-5">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {product.name}
                            </h1>
                            <p className="text-sm text-gray-500">
                                Slug: {product.slug}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-bold text-black">
                                ${product.final_price}
                            </span>
                            <span className="text-lg line-through text-gray-400">
                                ${product.original_price}
                            </span>
                            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                                -{product.discount}%
                            </span>
                        </div>

                        <p className="text-gray-700 leading-relaxed">
                            {product.short_description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-semibold">Category:</span> {product.category_Id?.name}
                            </div>
                            <div>
                                <span className="font-semibold">Brand:</span> {product.brand_Id?.name}
                            </div>
                            <div>
                                <span className="font-semibold">Stock:</span>{' '}
                                {product.stock ? 'In Stock' : 'Out of Stock'}
                            </div>
                            <div>
                                <span className="font-semibold">Status:</span>{' '}
                                {product.status ? 'Active' : 'Inactive'}
                            </div>
                        </div>

                        <div>
                            <p className="font-semibold mb-2">Available Colors</p>
                            <div className="flex gap-3 flex-wrap">
                                {/* {product.colors.map((color) => (
                                    <span
                                        key={color}
                                        className="px-4 py-2 bg-gray-100 rounded-lg text-sm"
                                    >
                                        {color}
                                    </span>
                                ))} */}
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:opacity-90">
                                Add To Cart
                            </button>

                            <button className="px-6 py-3 border rounded-xl font-medium hover:bg-gray-50">
                                Edit Product
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Long Description */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-2xl font-bold mb-4">Product Description</h2>
                <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.long_description }}
                />
            </div>

            {/* Admin Info */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-2xl font-bold mb-4">Admin Information</h2>

                <div className="grid md:grid-cols-3 gap-6 text-sm">
                    <div>
                        <p className="font-semibold text-gray-600">Created At</p>
                        <p>{product.createdAt}</p>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-600">Top Selling</p>
                        <p>{product.top_selling ? 'Yes' : 'No'}</p>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-600">Product Status</p>
                        <p>{product.status ? 'Published' : 'Draft'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
