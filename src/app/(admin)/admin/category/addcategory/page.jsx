"use client";

import { useRouter } from "next/navigation";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useRef, useState } from "react";
import { client, notify } from "@/utils/Helper";

export default function AddCategory() {

  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const nameRef = useRef()
  const slugRef = useRef()

  function slugCreate() {
    let slugVal = nameRef.current.value;

    let slug = slugVal
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    slugRef.current.value = slug;
  }

  const FetchData = (e) => {
    e.preventDefault()

    const payload = new FormData()
    payload.append("image", e.target.image.files[0])
    payload.append("name", e.target.category.value)
    payload.append("slug", e.target.slug.value)

    client.post("category/create", payload).then(
      (res) => {
        notify("Category Added Successfully", res.data.success)
        if (res.data.success) {
          e.target.reset()
        }
        router.push("/admin/category")
      }
    ).catch(
      (error) => {
        const message = error?.response?.data?.msg
        notify(message, false)
      }
    ).finally(() => {
      setLoading(false)
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Add Category
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create a new product category
          </p>
        </div>

        <form onSubmit={FetchData} className="space-y-5">

          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              name="category"
              onChange={slugCreate}
              ref={nameRef}
              placeholder="Enter category name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              ref={slugRef}
              readOnly
              placeholder="category-slug"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Image
            </label>

            <input
              type="file"
              id="fileUpload"
              name="image"
              className="hidden"
            />

            <label
              htmlFor="fileUpload"
              className="cursor-pointer flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl py-8 text-gray-500 hover:border-orange-400 hover:text-orange-500 transition"
            >
              <FaCloudUploadAlt size={40} className="mb-2" />
              <span className="text-sm">Click to upload image</span>
              <span className="text-xs text-gray-400 mt-1">
                PNG, JPG supported
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={() => setLoading(true)}
            className="w-full bg-orange-500 text-white py-2.5 rounded-lg hover:bg-orange-600 transition duration-200 font-medium shadow-sm"
          >
            {loading ? "Processing..." : "Add Category"}
          </button>
        </form>
      </div>
    </div>
  );
}