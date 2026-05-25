import { getColors } from "@/API/helpAPI";
import Btns from "@/components/admin/Btns";
import DeleteBtn from "@/components/admin/DeleteBtn";
import Link from "next/link";
import React from "react";
import EditBtn from "@/components/admin/EditBtn";

export const dynamic = 'force-dynamic';

export default async function ColorTable() {

    const res = await getColors()
    const data = res.data
    const meta = res.meta

    return (
        <div className="bg-gray-50 min-h-screen p-4">
            <div className="bg-white p-6 m-4 rounded-2xl shadow-md border border-gray-100">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                        Colors
                    </h2>

                    <Link href={"/admin/color/add"}>
                        <button className="bg-orange-500 cursor-pointer text-white px-5 py-2 rounded-lg shadow-sm hover:bg-orange-600 hover:shadow-md transition-all duration-200">
                            + Add Color
                        </button>
                    </Link>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                            <tr>
                                <th className="p-4 w-12 text-center">#</th>
                                <th className="p-4">Image</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Slug</th>
                                <th className="p-4">Code</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((color, index) => (
                                <tr
                                    key={color._id}
                                    className="border-t border-gray-200 hover:bg-gray-50 transition duration-150"
                                >
                                    <td className="p-4 text-center text-gray-400">
                                        {index + 1}
                                    </td>

                                    <td className="p-4">
                                        <div
                                            className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
                                            style={{ backgroundColor: color.color_code }}
                                        ></div>
                                    </td>

                                    <td className="p-4 font-medium text-gray-800">
                                        {color.name}
                                    </td>

                                    <td className="p-4 text-gray-500">
                                        {color.slug}
                                    </td>

                                    <td className="p-2 text-gray-600 font-mono text-xs">
                                        {color.color_code}
                                    </td>

                                    <td className="p-4 text-center">
                                        <div className="flex justify-center flex-wrap gap-1">
                                            <Btns value={color.status} API={`color/update-status/${color._id} `} field="status" />
                                            <Btns value={color.is_home} API={`color/update-status/${color._id} `} field="is_home" />
                                            <Btns value={color.is_top} API={`color/update-status/${color._id} `} field="is_top" />
                                            <Btns value={color.is_popular} API={`color/update-status/${color._id} `} field="is_popular" />
                                        </div>
                                    </td>

                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-3">
                                            <DeleteBtn API={`color/delete-color/${color._id}`} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Empty State */}
                    {data.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                            No Colors found
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}