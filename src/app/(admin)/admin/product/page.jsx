import { getProducts } from "@/API/helpAPI";
import Btns from "@/components/admin/Btns";
import DeleteBtn from "@/components/admin/DeleteBtn";
import EditBtn from "@/components/admin/EditBtn";
import Link from "next/link";
import React from "react";
import { FaImages, FaRegEye } from "react-icons/fa";

export const dynamic = 'force-dynamic';

export default async function ProductTable() {

    // Admin needs ALL products — no status filter, no limit
    // Pass limit=1000 to get all products (admin should see everything)
    const res = await getProducts({ limit: 1000 })
    const data = res?.data || []
    const meta = res?.meta || {}

    return (

        <div className="bg-gray-100 min-h-screen p-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Products
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage and organize product
                        </p>
                    </div>

                    <Link href={"/admin/product/add"}>
                        <button className="bg-orange-500 cursor-pointer text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition duration-200 shadow-sm">
                            + Add Products
                        </button>
                    </Link>
                </div>

                {/* Table with scrollbar after ~10 entries */}
                <div className="overflow-x-auto overflow-y-auto max-h-[560px] rounded-xl border border-gray-200">
                    <table className="w-full text-sm text-left">

                        {/* Sticky Header */}
                        <thead className="sticky top-0 bg-gray-50 text-gray-500 uppercase text-xs tracking-wider z-10">
                            <tr>
                                <th className="p-4 w-12 text-center">#</th>
                                <th className="p-4">Logo</th>
                                <th className="p-4">Product Name</th>
                                <th className="p-4">Category</th>
                                <th className="p-4 text-center">status</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((product, index) => (
                                <tr
                                    key={product._id}
                                    className="border-t border-gray-100 hover:bg-gray-50 transition"
                                >
                                    {/* Index */}
                                    <td className="p-4 text-center text-gray-400">
                                        {index + 1}
                                    </td>

                                    {/* Logo */}
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <img
                                                src={product.thumbnail || "/no-image.png"}
                                                alt={product.name}
                                                className="w-10 h-10 object-cover rounded-lg border border-gray-200 bg-white p-1"
                                            />
                                        </div>
                                    </td>
                                
                                    {/* Product Name */}
                                    <td className="p-4">
                                        <span className="font-semibold text-gray-800">
                                            {product.name}
                                        </span>
                                    </td>

                                    {/* Category */}
                                    <td className="p-4 text-gray-400 text-sm">
                                        {product.category_Id?.name}
                                    </td>

                                    {/* Status */}
                                    <td className="p-4 text-center">
                                        <div className="flex flex-wrap justify-center gap-1">
                                            <Btns
                                                value={product.status}
                                                API={`product/update-status/${product._id}`}
                                                field="status"
                                            />
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-3">
                                            <EditBtn editpath={`product/edit/${product._id}`} />

                                            <Link
                                                className="p-2 cursor-pointer rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition"
                                                href={`product/add-images/${product._id}`}
                                            >
                                                <FaImages />
                                            </Link>

                                            <DeleteBtn API={`product/delete-product/${product._id}`} />

                                            <Link
                                                className="p-2 cursor-pointer rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition"
                                                href={`product/view/${product._id}`}
                                            >
                                                <FaRegEye />
                                            </Link>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Empty State */}
                    {data.length === 0 && (
                        <div className="text-center py-10 text-gray-400">
                            No products found
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}