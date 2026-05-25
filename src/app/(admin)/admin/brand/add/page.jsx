'use client'
import { getCategories } from '@/API/helpAPI';
import { client } from '@/utils/Helper';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Select from 'react-select'
import { notify } from '@/utils/Helper';

export default function AddBrand() {

    const [categoies, setCategories] = useState([])
    const [selCategory, setselCategory] = useState([])

    const router = useRouter()

    const nameRef = useRef()
    const slugRef = useRef()

    function selectCategory(cat) {
        const categ = cat.map((cat) => cat.value)
        setselCategory(categ)
    }

    function slugCreate() {
        let slugVal = nameRef.current.value

        let slug = slugVal
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        slugRef.current.value = slug
    }

    const fetchData = (e) => {
        e.preventDefault()

        const payload = new FormData()
        payload.append("name", e.target.brand.value),
        payload.append("slug", e.target.slug.value),
        payload.append("categoryId", JSON.stringify(selCategory)),
        payload.append("image", e.target.image.files[0])

        client.post("/brand/create", payload).then(
            (res) => {
                if (res.data.success) {
                    e.target.reset()
                }
                router.push("/admin/brand")
                notify("Brand Added", res.data.success)
            }
        ).catch(
            (error) => {
                console.log(error)
                const msg = error?.response?.data?.msg
                notify(msg, false)
            }
        )
    }

    const fetchCategory = async () => {
        try {
            const res = await getCategories()
            const category = res.data
            setCategories(category)
        } catch (error) {
            console.log(error)
            setCategories([])
        }
    }

    useEffect(() => {
        fetchCategory()
    }, [])

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Add Brand
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Create a new brand and assign categories
                    </p>
                </div>

                <form onSubmit={fetchData} className="space-y-5">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Brand Name
                        </label>
                        <input
                            ref={nameRef}
                            onChange={slugCreate}
                            name='brand'
                            type="text"
                            placeholder="Enter brand name"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Slug
                        </label>
                        <input
                            ref={slugRef}
                            readOnly
                            name='slug'
                            type="text"
                            placeholder="enter-brand-slug"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>

                    {/* Categories */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Categories
                        </label>
                        <Select
                            onChange={selectCategory}
                            closeMenuOnSelect={false}
                            isMulti
                            className="text-sm"
                            options={
                                categoies.map((cat) => (
                                    { value: cat._id, label: cat.name }
                                ))
                            }
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Brand Logo
                        </label>
                        <input
                            type="file"
                            name='image'
                            className="w-full text-sm border border-gray-300 rounded-lg p-2 cursor-pointer file:mr-3 file:py-1 file:px-3 file:border-0 file:bg-orange-100 file:text-orange-600 file:rounded-md"
                            accept="image/*"
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full bg-orange-500 text-white py-2.5 rounded-lg hover:bg-orange-600 transition duration-200 font-medium shadow-sm"
                    >
                        Save Brand
                    </button>
                </form>
            </div>
        </div>
    );
}