import { getCategories, getBrands, getColors, getProducts } from '@/API/helpAPI'
import Link from 'next/link'
import {
    MdCategory, MdInventory2, MdShoppingCart, MdTrendingUp
} from 'react-icons/md'
import { SiBrandfetch } from 'react-icons/si'
import { IoColorPalette } from 'react-icons/io5'
import { FaBoxOpen, FaArrowRight } from 'react-icons/fa'
import { BsCartCheckFill } from 'react-icons/bs'
import { LuPackageCheck } from 'react-icons/lu'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {

    // Fetch all stats in parallel
    const [catRes, brandRes, colorRes, productRes, topRes] = await Promise.allSettled([
        getCategories(),
        getBrands(),
        getColors(),
        getProducts(),
        getProducts({ top_selling: true, limit: 5 }),
    ])

    const totalCategories = catRes.value?.data?.length  ?? 0
    const totalBrands     = brandRes.value?.data?.length ?? 0
    const totalColors     = colorRes.value?.data?.length ?? 0
    const totalProducts   = productRes.value?.meta?.total ?? 0
    const topProducts     = topRes.value?.data ?? []
    const imageBaseUrl    = productRes.value?.meta?.imageBaseUrl ?? ''

    // Recent products (last 6)
    const recentProducts  = (productRes.value?.data ?? []).slice(0, 6)

    const stats = [
        {
            label: 'Total Products',
            value: totalProducts,
            icon: <MdInventory2 size={26} />,
            color: 'bg-orange-500',
            light: 'bg-orange-50 text-orange-600',
            href: '/admin/product',
        },
        {
            label: 'Categories',
            value: totalCategories,
            icon: <MdCategory size={26} />,
            color: 'bg-blue-500',
            light: 'bg-blue-50 text-blue-600',
            href: '/admin/category',
        },
        {
            label: 'Brands',
            value: totalBrands,
            icon: <SiBrandfetch size={24} />,
            color: 'bg-purple-500',
            light: 'bg-purple-50 text-purple-600',
            href: '/admin/brand',
        },
        {
            label: 'Colors',
            value: totalColors,
            icon: <IoColorPalette size={26} />,
            color: 'bg-green-500',
            light: 'bg-green-50 text-green-600',
            href: '/admin/color',
        },
    ]

    const quickLinks = [
        { label: 'Add Product',  href: '/admin/product/add',          icon: <FaBoxOpen size={18} />,       color: 'bg-orange-500 hover:bg-orange-600' },
        { label: 'Add Category', href: '/admin/category/addcategory', icon: <MdCategory size={18} />,      color: 'bg-blue-500 hover:bg-blue-600' },
        { label: 'Add Brand',    href: '/admin/brand/add',            icon: <SiBrandfetch size={18} />,    color: 'bg-purple-500 hover:bg-purple-600' },
        { label: 'Add Color',    href: '/admin/color/add',            icon: <IoColorPalette size={18} />,  color: 'bg-green-500 hover:bg-green-600' },
        { label: 'View Orders',  href: '/admin/order',                icon: <BsCartCheckFill size={18} />, color: 'bg-teal-500 hover:bg-teal-600' },
    ]

    return (
        <div className="p-6 space-y-8">

            {/* ── Welcome Banner ─────────────────────────────────────────── */}
            <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-6 text-white shadow-lg">
                <div className="relative z-10">
                    <p className="text-orange-100 text-sm font-medium mb-1">Welcome back 👋</p>
                    <h2 className="text-2xl font-bold">iShop Admin Panel</h2>
                    <p className="text-orange-100 text-sm mt-1">
                        Here&apos;s what&apos;s happening with your store today.
                    </p>
                    <Link href="/admin/product/add"
                        className="inline-flex items-center gap-2 mt-4 bg-white text-orange-500 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-orange-50 transition shadow">
                        + Add New Product <FaArrowRight size={12} />
                    </Link>
                </div>
                {/* Decorative circles */}
                <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full" />
                <div className="absolute -right-4 -bottom-10 w-56 h-56 bg-white/10 rounded-full" />
            </div>

            {/* ── Stats Cards ────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s) => (
                    <Link href={s.href} key={s.label}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{s.label}</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{s.value}</p>
                            </div>
                            <div className={`${s.light} p-3 rounded-xl`}>
                                {s.icon}
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-3">
                            <MdTrendingUp className="text-green-500" size={14} />
                            <span className="text-xs text-gray-400">View all →</span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* ── Quick Links ────────────────────────────────────────────── */}
            <div>
                <h3 className="text-base font-bold text-gray-700 mb-3">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                    {quickLinks.map((q) => (
                        <Link key={q.label} href={q.href}
                            className={`flex items-center gap-2 ${q.color} text-white text-sm font-medium px-4 py-2.5 rounded-xl transition shadow-sm`}>
                            {q.icon}
                            {q.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* ── Bottom Grid: Recent + Top Selling ──────────────────────── */}
            <div className="grid lg:grid-cols-2 gap-6">

                {/* Recent Products */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800">Recent Products</h3>
                        <Link href="/admin/product"
                            className="text-xs text-orange-500 hover:underline font-medium">
                            View all →
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentProducts.length === 0 && (
                            <p className="text-center text-gray-400 py-8 text-sm">No products yet</p>
                        )}
                        {recentProducts.map((p) => (
                            <div key={p._id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition">
                                <div className="w-10 h-10 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden shrink-0">
                                    {p.thumbnail
                                        ? <img src={imageBaseUrl + p.thumbnail} alt={p.name}
                                            className="w-full h-full object-cover" />
                                        : <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <MdInventory2 size={18} />
                                          </div>
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                                    <p className="text-xs text-gray-400">{p.category_Id?.name ?? '—'}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-bold text-gray-800">₹{p.final_price?.toLocaleString('en-IN')}</p>
                                    <p className="text-xs line-through text-gray-400">₹{p.original_price?.toLocaleString('en-IN')}</p>
                                </div>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${p.status ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                    {p.status ? 'Active' : 'Draft'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Selling */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800">Top Selling Products</h3>
                        <span className="text-xs bg-orange-100 text-orange-600 font-semibold px-2 py-0.5 rounded-full">
                            Featured
                        </span>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {topProducts.length === 0 && (
                            <p className="text-center text-gray-400 py-8 text-sm">No top selling products</p>
                        )}
                        {topProducts.map((p, i) => (
                            <div key={p._id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                                    ${i === 0 ? 'bg-yellow-400 text-white' :
                                      i === 1 ? 'bg-gray-400 text-white' :
                                      i === 2 ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    {i + 1}
                                </span>
                                <div className="w-10 h-10 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden shrink-0">
                                    {p.thumbnail
                                        ? <img src={imageBaseUrl + p.thumbnail} alt={p.name}
                                            className="w-full h-full object-cover" />
                                        : <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <MdInventory2 size={18} />
                                          </div>
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                                    <p className="text-xs text-gray-400">{p.brand_Id?.name ?? '—'}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-bold text-orange-500">₹{p.final_price?.toLocaleString('en-IN')}</p>
                                    <span className="text-xs bg-red-100 text-red-500 font-semibold px-1.5 py-0.5 rounded-full">
                                        -{p.discount}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* ── Overview Row ───────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-500 flex items-center justify-center">
                        <LuPackageCheck size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">In Stock Products</p>
                        <p className="text-2xl font-bold text-gray-800">{totalProducts}</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
                        <MdShoppingCart size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-800">—</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                        <MdTrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Top Selling</p>
                        <p className="text-2xl font-bold text-gray-800">{topProducts.length}</p>
                    </div>
                </div>
            </div>

        </div>
    )
}
