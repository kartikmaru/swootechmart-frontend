"use client";
import { useParams, useRouter } from "next/navigation";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useRef, useState } from "react";
import { client, notify } from "@/utils/Helper";

export default function AddCategory() {

    const { id } = useParams();

    const [image, setImage] = useState()
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

    client.get(`category/${id}`).then(
        (res) => {
            setLoading(true)
            const curruntdata = res.data
            nameRef.current.value = curruntdata.data.name
            slugRef.current.value = curruntdata.data.slug
            setImage(`${curruntdata.meta.ImageBaseUrl}${curruntdata.data.image}`)
        }
    ).catch(
        (res) => {
            console.log(res)
        }
    )

    const FetchData = (e) => {
        e.preventDefault()

        const payload = new FormData()
        payload.append("image", e.target.image.files[0])
        payload.append("name", e.target.category.value)
        payload.append("slug", e.target.slug.value)

        client.put(`category/update/${id}`, payload).then(
            (res) => {
                notify("Category Updated", res.data.success)
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

    if (!loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <h2 className="text-lg text-gray-500 animate-pulse">
                    Loading category...
                </h2>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Edit Category
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Update category details and image
                    </p>
                </div>

                <form onSubmit={FetchData} className="space-y-5">

                    {/* Name */}
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
                            <span className="text-sm">Click to upload new image</span>
                            <span className="text-xs text-gray-400 mt-1">
                                Leave empty to keep current image
                            </span>
                        </label>
                    </div>

                    {/* Current Image Preview */}
                    <div className="flex items-center gap-4 mt-2">
                        {image && (
                            <img
                                src={image}
                                alt="category"
                                className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                            />
                        )}
                        <span className="text-xs text-gray-400">
                            Current image
                        </span>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full bg-orange-500 text-white py-2.5 rounded-lg hover:bg-orange-600 transition duration-200 font-medium shadow-sm"
                    >
                        Update Category
                    </button>
                </form>
            </div>
        </div>
    );
}