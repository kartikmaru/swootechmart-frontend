import Link from "next/link";
import React from "react";
import { getCategories } from "../../../../API/helpAPI";
import Btns from "@/components/admin/Btns";
import DeleteBtn from "@/components/admin/DeleteBtn";
import EditBtn from "@/components/admin/EditBtn";

export const dynamic = 'force-dynamic';

export default async function CategoryTable() {
    const res = await getCategories()
    const data = res.data
    const meta = res.meta

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Categories
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage and organize your product categories
                        </p>
                    </div>

                    <Link href={"/admin/category/addcategory"}>
                        <button className="bg-orange-500 cursor-pointer text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition duration-200 shadow-sm">
                            + Add Category
                        </button>
                    </Link>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                            <tr>
                                <th className="p-4 w-12 text-center">#</th>
                                <th className="p-4">Image</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Slug</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((cat, index) => (
                                <tr
                                    key={index}
                                    className="border-t border-gray-100 hover:bg-gray-50 transition"
                                >
                                    {/* Index */}
                                    <td className="p-4 text-center text-gray-400">
                                        {index + 1}
                                    </td>

                                    {/* Image */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={meta.ImageBaseUrl + cat.image || "/no-image.png"}
                                                alt={cat.name}
                                                className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                                            />
                                        </div>
                                    </td>

                                    {/* Name */}
                                    <td className="p-4">
                                        <span className="font-semibold text-gray-800">
                                            {cat.name}
                                        </span>
                                    </td>

                                    {/* Slug */}
                                    <td className="p-4 text-gray-400 text-sm">
                                        {cat.slug}
                                    </td>

                                    {/* Status */}
                                    <td className="p-4 text-center">
                                        <div className="flex flex-wrap justify-center gap-1">
                                            <Btns value={cat.status} API={`category/update-status/${cat._id} `} field="status" />
                                            <Btns value={cat.is_home} API={`category/update-status/${cat._id} `} field="is_home" />
                                            <Btns value={cat.is_top} API={`category/update-status/${cat._id} `} field="is_top" />
                                            <Btns value={cat.is_popular} API={`category/update-status/${cat._id} `} field="is_popular" />
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-3">
                                            <EditBtn editpath={`category/edit/${cat._id}`} />
                                            <DeleteBtn API={`category/delete-category/${cat._id}`} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Empty State */}
                    {data.length === 0 && (
                        <div className="text-center py-10 text-gray-400">
                            No categories found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}