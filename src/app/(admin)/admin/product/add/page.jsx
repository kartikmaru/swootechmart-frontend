'use client'
import { getBrands, getCategories, getColors } from '@/API/helpAPI'
import Select from 'react-select'
import { client, notify } from '@/utils/Helper'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { Editor } from 'primereact/editor';

export default function page() {

    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])
    const [colors, setColors] = useState([])
    const [selColors, setselColors] = useState([])



    const router = useRouter()

    const nameRef = useRef()
    const slugRef = useRef()
    const opRef = useRef()
    const fpRef = useRef()
    const dpRef = useRef()


    const selectColors = (colors) => {
        const selectedItems = colors.map((color) => color.value)
        setselColors(selectedItems)
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

    const calculatePrice = () => {
        const op = Number(opRef.current.value)
        const fp = Number(fpRef.current.value)

        if (op <= 0 || fp < 0 || op < fp) {
            return alert("Invalid Price")
        }
        if (op && fp >= 0) {
            const discount = parseInt(((op - fp) / op) * 100)
            dpRef.current.value = discount
        }
        else {
            dpRef.current.value = null
        }
    }

    const fetchAPI = async () => {
        const [catRes, brandRes, colRes] = await Promise.all([
            getCategories(), getBrands(), getColors()
        ])
        setCategories(catRes.data)
        setBrands(brandRes.data)
        setColors(colRes.data)
    }

    useEffect(() => {
        fetchAPI()
    },
        []
    )

    const FetchData = (e) => {

        e.preventDefault()

        const payload = new FormData()

        payload.append("name", nameRef.current.value)
        payload.append("slug", slugRef.current.value)
        payload.append("original_price", opRef.current.value)
        payload.append("final_price", fpRef.current.value)
        payload.append("discount", dpRef.current.value)
        payload.append("thumbnail", e.target.thumbnail.files[0])
        payload.append("color_Id", JSON.stringify(selColors))
        payload.append("category_Id", e.target.category.value)
        payload.append("brand_Id", e.target.brand.value)
        payload.append("short_description", e.target.short_description.value)
        payload.append("long_description", text)
        payload.append("stock", e.target.stock.checked)
        payload.append("top_selling", e.target.top_selling.checked)
        payload.append("status", e.target.status.checked)

        client.post("/product/create", payload).then(
            (res) => {
                notify("Product Created", res.data.success)
                if (res.data.successs) {
                    e.target.refresh()
                }
                router.push("/admin/product")

            }
        ).catch(
            (error) => {
                notify("Internal server Error", false)
                console.log(error)
            }
        )

    }

    return (
        <form onSubmit={FetchData} className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-6">

            <h2 className="text-2xl font-bold text-gray-800">Add Product</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600">Name</label>
                    <input ref={nameRef} onChange={slugCreate} type="text" name="name" placeholder="Enter product name" className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">Slug</label>
                    <input ref={slugRef} type="text" readOnly name="slug" placeholder="enter-product-slug" className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-600">Original Price</label>
                    <input ref={opRef} type="number" name="original_price" placeholder="Enter original price (e.g. 999)" className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">Discount %</label>
                    <input ref={dpRef} readOnly type="number" name="discountPercentage" placeholder="Enter discount percentage (e.g. 10)" className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">Final Price</label>
                    <input onChange={calculatePrice} ref={fpRef} type="number" name="Final" placeholder="Enter original price (e.g. 999)" className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600">Short Description</label>
                <textarea name="short_description" rows="3" placeholder="Enter a short description of the product" className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"></textarea>
            </div>

            <div>
                <label className="block text-sm mb-2 font-medium text-gray-600">Long Description</label>
                <Editor value={text} onTextChange={(e) => setText(e.htmlValue)} style={{ height: '320px' }} />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600">Category</label>
                    <Select name="category" closeMenuOnSelect={false} className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Select Category...." options={
                        categories.map((cat) => ({ value: cat._id, label: cat.name })
                        )
                    } />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">Brand</label>
                    <Select name="brand" closeMenuOnSelect={false} className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Select brand...." options={
                        brands.map((brand) => ({ value: brand._id, label: brand.name })
                        )
                    } />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">Colors</label>
                    <Select onChange={selectColors} name="color" closeMenuOnSelect={false} isMulti className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Select colors...." options={
                        colors.map((color) => ({ value: color._id, label: color.name })
                        )
                    } />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600">Thumbnail</label>
                    <input type="file" name="thumbnail" className="w-full mt-1 p-2 border rounded-lg bg-gray-50" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">Images</label>
                    <input type="file" name="images" multiple className="w-full mt-1 p-2 border rounded-lg bg-gray-50" />
                </div>
            </div>

            <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2">
                    <input type="checkbox" name="stock" className="w-4 h-4" />
                    <span className="text-gray-700">In Stock</span>
                </label>

                <label className="flex items-center gap-2">
                    <input type="checkbox" name="top_selling" className="w-4 h-4" />
                    <span className="text-gray-700">Top Selling</span>
                </label>

                <label className="flex items-center gap-2">
                    <input type="checkbox" name="status" className="w-4 h-4" />
                    <span className="text-gray-700">Active Status</span>
                </label>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Submit Product
            </button>

        </form>
    )
}
