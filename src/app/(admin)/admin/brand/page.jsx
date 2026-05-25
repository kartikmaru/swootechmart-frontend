import { getBrands } from "@/API/helpAPI";
import DeleteBtn from "@/components/admin/DeleteBtn";
import EditBtn from "@/components/admin/EditBtn";
import Link from "next/link";
import React from "react";

export const dynamic = 'force-dynamic';

export default async function BrandTable() {

  const res = await getBrands()
  const data = res.data
  const meta = res.meta

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Brands
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage and organize product brands
            </p>
          </div>

          <Link href={"/admin/brand/add"}>
            <button className="bg-orange-500 cursor-pointer text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition duration-200 shadow-sm">
              + Add Brand
            </button>
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto overflow-y-auto max-h-[600px] rounded-xl border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="sticky top-0 bg-gray-50 text-gray-500 uppercase text-xs tracking-wider z-10">
              <tr>
                <th className="p-4 w-12 text-center">#</th>
                <th className="p-4">Logo</th>
                <th className="p-4">Brand Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4 text-center">Categories</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.map((brand, index) => (
                <tr
                  key={brand._id}
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
                        src={meta.imageBaseUrl + brand.image || "/no-image.png"}
                        alt={brand.name}
                        className="w-10 h-10 object-cover rounded-lg border border-gray-200 bg-white p-1"
                      />
                    </div>
                  </td>

                  {/* Brand Name */}
                  <td className="p-4">
                    <span className="font-semibold text-gray-800">
                      {brand.name}
                    </span>
                  </td>

                  {/* Slug */}
                  <td className="p-4 text-gray-400 text-sm">
                    {brand.slug}
                  </td>

                  {/* Categories as chips */}
                  <td className="p-4 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {
                        brand.categoryId.map((cat) => (
                          <span
                            key={cat._id}
                            className="px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-600 border border-blue-100"
                          >
                            {cat.name}
                          </span>
                        ))
                      }
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-3">
                      <EditBtn editpath={`brand/edit/${brand._id}`} />
                      <DeleteBtn API={`brand/delete-brand/${brand._id}`} />
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {data.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              No brands found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}