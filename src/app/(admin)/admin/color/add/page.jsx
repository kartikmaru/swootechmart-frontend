"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { client, notify } from "@/utils/Helper";

export default function AddCategory() {

    const [loading, setLoading] = useState(false)
    const [color, setcolor] = useState(null)

    const router = useRouter()

    const nameRef = useRef()
    const slugRef = useRef()
    const colorRef = useRef()

    function showColor() {
        const color_name = colorRef.current.value
        if (color_name.length == 7) {
            setcolor(color_name)
        } else {
            setcolor(null)
        }

    }

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

        const payload = {
            name: nameRef.current.value,
            slug: slugRef.current.value,
            color_code: e.target.color_code.value
        }

        client.post("color/create", payload).then(
            (res) => {
                notify("Color Added Successfully", res.data.success)
                if (res.data.success) {
                    e.target.reset()
                }
                router.push("/admin/color")
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
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

                {/* Header */}
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Add Color
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Create and manage product colors
                    </p>
                </div>

                <form onSubmit={FetchData} className="space-y-5">

                    {/* Color Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Color Name
                        </label>
                        <input
                            type="text"
                            name="category"
                            onChange={slugCreate}
                            ref={nameRef}
                            placeholder="e.g. Red, Sky Blue"
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
                            placeholder="color-slug"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            required
                        />
                    </div>

                    {/* Color Code with Preview */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Color Code
                        </label>

                        <div className="flex items-center gap-3">
                            <input
                                ref={colorRef}
                                onChange={showColor}
                                type="text"
                                name="color_code"
                                placeholder="#000000"
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                required
                            />

                            {/* Live preview (CSS only, no logic change) */}
                            <div className="w-10 h-10 rounded-full border border-gray-300 bg-gray-100"
                                style={{ background: color }} ></div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        onClick={() => setLoading(true)}
                        className="w-full bg-orange-500 text-white py-2.5 rounded-lg hover:bg-orange-600 transition duration-200 font-medium shadow-sm"
                    >
                        {loading ? "Processing..." : "Add Color"}
                    </button>
                </form>
            </div >
        </div >
    );
}