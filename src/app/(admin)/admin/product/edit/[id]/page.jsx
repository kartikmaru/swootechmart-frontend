'use client'
import { getBrands, getCategories, getColors } from '@/API/helpAPI'
import { client, notify } from '@/utils/Helper'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import { Editor } from 'primereact/editor'

export default function EditProduct() {

    const { id } = useParams()
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [longDesc, setLongDesc] = useState('')
    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])
    const [colors, setColors] = useState([])
    const [selCategory, setSelCategory] = useState(null)
    const [selBrand, setSelBrand] = useState(null)
    const [selColors, setSelColors] = useState([])
    const [thumbnail, setThumbnail] = useState(null)
    const [stockChecked, setStockChecked] = useState(false)
    const [topSellingChecked, setTopSellingChecked] = useState(false)
    const [statusChecked, setStatusChecked] = useState(false)

    const nameRef = useRef()
    const slugRef = useRef()
    const opRef = useRef()
    const fpRef = useRef()
    const dpRef = useRef()
    const shortDescRef = useRef()

    // ── Slug auto-generate ──────────────────────────────────────────────────
    function slugCreate() {
        const slugVal = nameRef.current.value
        slugRef.current.value = slugVal
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
    }

    // ── Discount auto-calculate ─────────────────────────────────────────────
    function calculatePrice() {
        const op = Number(opRef.current.value)
        const fp = Number(fpRef.current.value)
        if (op > 0 && fp >= 0 && op >= fp) {
            dpRef.current.value = parseInt(((op - fp) / op) * 100)
        } else {
            dpRef.current.value = ''
        }
    }

    // ── Fetch master data (categories, brands, colors) ──────────────────────
    const fetchMasterData = async () => {
        const [catRes, brandRes, colRes] = await Promise.all([
            getCategories(), getBrands(), getColors()
        ])
        setCategories(catRes.data)
        setBrands(brandRes.data)
        setColors(colRes.data)
        return { cats: catRes.data, brnds: brandRes.data, cols: colRes.data }
    }

    // ── Fetch existing product data and pre-fill form ───────────────────────
    useEffect(() => {
        async function loadProduct() {
            try {
                const { cats, brnds, cols } = await fetchMasterData()

                const res = await client.get(`product/${id}`)
                const data = res.data.data
                const meta = res.data.meta

                nameRef.current.value       = data.name
                slugRef.current.value       = data.slug
                opRef.current.value         = data.original_price
                fpRef.current.value         = data.final_price
                dpRef.current.value         = data.discount
                shortDescRef.current.value  = data.short_description || ''
                setLongDesc(data.long_description || '')
                setStockChecked(data.stock)
                setTopSellingChecked(data.top_selling)
                setStatusChecked(data.status)
                setThumbnail(meta?.imageBaseUrl + data.thumbnail)

                // Pre-select category
                const matchedCat = cats.find(c => c._id === data.category_Id?._id)
                if (matchedCat) setSelCategory({ value: matchedCat._id, label: matchedCat.name })

                // Pre-select brand
                const matchedBrand = brnds.find(b => b._id === data.brand_Id?._id)
                if (matchedBrand) setSelBrand({ value: matchedBrand._id, label: matchedBrand.name })

                // Pre-select colors
                const matchedColors = (data.color_Id || []).map(c => ({ value: c._id, label: c.name }))
                setSelColors(matchedColors)

            } catch (error) {
                console.log(error)
                notify('Failed to load product', false)
            }
        }
        loadProduct()
    }, [id])

    // ── Submit handler ──────────────────────────────────────────────────────
    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)

        const payload = new FormData()
        payload.append('name',              nameRef.current.value)
        payload.append('slug',              slugRef.current.value)
        payload.append('original_price',    opRef.current.value)
        payload.append('final_price',       fpRef.current.value)
        payload.append('discount',          dpRef.current.value)
        payload.append('short_description', shortDescRef.current.value)
        payload.append('long_description',  longDesc)
        payload.append('category_Id',       selCategory?.value || '')
        payload.append('brand_Id',          selBrand?.value || '')
        payload.append('color_Id',          JSON.stringify(selColors.map(c => c.value)))
        payload.append('stock',             String(stockChecked))
        payload.append('top_selling',       String(topSellingChecked))
        payload.append('status',            String(statusChecked))

        const thumbFile = e.target.thumbnail.files[0]
        if (thumbFile) payload.append('thumbnail', thumbFile)

        client.put(`product/update/${id}`, payload)
            .then(res => {
                notify('Product Updated Successfully', res.data.success)
                if (res.data.success) router.push('/admin/product')
            })
            .catch(error => {
                const msg = error?.response?.data?.msg || 'Internal Server Error'
                notify(msg, false)
                console.log(error)
            })
            .finally(() => setLoading(false))
    }

    return (
        <form onSubmit={submitHandler} className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-6">

            <div>
                <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
                <p className="text-sm text-gray-500 mt-1">Update product details below</p>
            </div>

            {/* Name & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600">Name</label>
                    <input ref={nameRef} onChange={slugCreate} type="text" name="name"
                        placeholder="Enter product name"
                        className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Slug</label>
                    <input ref={slugRef} type="text" readOnly name="slug"
                        placeholder="product-slug"
                        className="w-full mt-1 p-2 border rounded-lg bg-gray-50 outline-none" />
                </div>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600">Original Price</label>
                    <input ref={opRef} type="number" name="original_price"
                        placeholder="e.g. 9999"
                        className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Final Price</label>
                    <input ref={fpRef} onChange={calculatePrice} type="number" name="final_price"
                        placeholder="e.g. 7999"
                        className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Discount %</label>
                    <input ref={dpRef} readOnly type="number" name="discount"
                        placeholder="Auto calculated"
                        className="w-full mt-1 p-2 border rounded-lg bg-gray-50 outline-none" />
                </div>
            </div>

            {/* Short Description */}
            <div>
                <label className="block text-sm font-medium text-gray-600">Short Description</label>
                <textarea ref={shortDescRef} name="short_description" rows="3"
                    placeholder="Enter a short description"
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none" />
            </div>

            {/* Long Description */}
            <div>
                <label className="block text-sm mb-2 font-medium text-gray-600">Long Description</label>
                <Editor value={longDesc} onTextChange={(e) => setLongDesc(e.htmlValue)} style={{ height: '280px' }} />
            </div>

            {/* Category, Brand, Colors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600">Category</label>
                    <Select
                        name="category"
                        value={selCategory}
                        onChange={setSelCategory}
                        className="mt-1"
                        placeholder="Select Category..."
                        options={categories.map(c => ({ value: c._id, label: c.name }))}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Brand</label>
                    <Select
                        name="brand"
                        value={selBrand}
                        onChange={setSelBrand}
                        className="mt-1"
                        placeholder="Select Brand..."
                        options={brands.map(b => ({ value: b._id, label: b.name }))}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Colors</label>
                    <Select
                        isMulti
                        name="color"
                        value={selColors}
                        onChange={setSelColors}
                        closeMenuOnSelect={false}
                        className="mt-1"
                        placeholder="Select Colors..."
                        options={colors.map(c => ({ value: c._id, label: c.name }))}
                    />
                </div>
            </div>

            {/* Thumbnail */}
            <div>
                <label className="block text-sm font-medium text-gray-600">Thumbnail</label>
                <input type="file" name="thumbnail" accept="image/*"
                    className="w-full mt-1 p-2 border rounded-lg bg-gray-50" />
                {thumbnail && (
                    <div className="mt-3 flex items-center gap-3">
                        <img src={thumbnail} alt="Current thumbnail"
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 bg-white p-1" />
                        <span className="text-xs text-gray-400">Current thumbnail</span>
                    </div>
                )}
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-orange-500"
                        checked={stockChecked}
                        onChange={e => setStockChecked(e.target.checked)} />
                    <span className="text-gray-700">In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-orange-500"
                        checked={topSellingChecked}
                        onChange={e => setTopSellingChecked(e.target.checked)} />
                    <span className="text-gray-700">Top Selling</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-orange-500"
                        checked={statusChecked}
                        onChange={e => setStatusChecked(e.target.checked)} />
                    <span className="text-gray-700">Active Status</span>
                </label>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
                className="w-full bg-orange-500 text-white py-2.5 rounded-lg hover:bg-orange-600 transition duration-200 font-medium shadow-sm disabled:opacity-60">
                {loading ? 'Updating...' : 'Update Product'}
            </button>

        </form>
    )
}
