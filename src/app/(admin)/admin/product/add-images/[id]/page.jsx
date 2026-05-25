"use client";
import { useParams, useRouter } from "next/navigation";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { client, notify } from "@/utils/Helper";
import { findProductById } from "@/API/helpAPI";

export default function ProductImage() {

    const imageRef = useRef()

    if (imageRef.current) {
        console.log(imageRef.current.value)
    }

    const { id } = useParams();

    const [baseurl, setBaseurl] = useState("")
    const [product, setProduct] = useState({})
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const delete_image = async (image) => {
        await client.put(`/product/delete-image/${id}`, { image_name: image }).then(
            (res) => {
                notify(res.data.msg, res.data.success)
            }
        ).catch(
            (error) => {
                const message = error?.response.data.msg || "Internal server Error"
                notify(message, false)
            }
        )


    }

    const getProduct = async () => {
        setLoading(true)
        try {
            const { data, meta } = await findProductById(id)
            setProduct(data)
            setBaseurl(meta?.imageBaseUrl)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(
        () => {
            getProduct()
        },
        [id]
    )

    const FetchData = (e) => {
        e.preventDefault()

        const payload = new FormData()
        for (let image of e.target.images.files) {
            payload.append("images", image)
        }

        client.post(`product/add-images/${id}`, payload).then(
            (res) => {
                notify("Images Uploaded", res.data.success)
                if (res.data.success) {
                    e.target.reset()
                }
                router.push("/admin/product")
            }
        ).catch(
            (error) => {
                const message = error?.response?.data?.msg
                notify(message, false)
            }
        )
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

                <form onSubmit={FetchData} className="space-y-5">


                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Images
                        </label>

                        <input
                            type="file"
                            id="fileUpload"
                            name="images"
                            className="hidden"
                            multiple
                            ref={imageRef}
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
                    <div className="flex flex-wrap gap-4 mt-4">
                        {product?.images?.map((image, index) => (
                            <div
                                key={index}
                                className="relative w-[90px] h-[90px] rounded-xl overflow-hidden shadow-md border bg-white group"
                            >
                                {/* Delete Button (ALWAYS visible) */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        delete_image(image);
                                        router.refresh()
                                    }}
                                    className="absolute top-1 right-1 z-10 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-0.5 rounded-full shadow transition"
                                >
                                    ✕
                                </button>

                                {/* Image */}
                                < img
                                    src={`${baseurl}${image}`}
                                    alt=""
                                    className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                                />

                                {/* Overlay effect */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300"></div>
                            </div>
                        ))}
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full bg-orange-500 text-white py-2.5 rounded-lg hover:bg-orange-600 transition duration-200 font-medium shadow-sm"
                    >
                        Upload Images
                    </button>
                </form>
            </div >
        </div >
    );
}