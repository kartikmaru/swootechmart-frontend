'use client'

import { useEffect, useState } from 'react'
import { client } from '@/utils/Helper'
import OrderCard from './OrderCard'
import EmptyOrders from './EmptyOrders'
import { FiPackage, FiRefreshCw } from 'react-icons/fi'

const STATUS_FILTERS = [
    { label: 'All',          value: '' },
    { label: 'Placed',       value: 'placed' },
    { label: 'Confirmed',    value: 'confirmed' },
    { label: 'Shipped',      value: 'shipped' },
    { label: 'Delivered',    value: 'delivered' },
    { label: 'Cancelled',    value: 'cancelled' },
]

export default function OrdersClient() {
    const [orders,       setOrders]       = useState([])
    const [imageBaseUrl, setImageBaseUrl] = useState('')
    const [loading,      setLoading]      = useState(true)
    const [error,        setError]        = useState(null)
    const [filter,       setFilter]       = useState('')

    const fetchOrders = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await client.get('order/my-orders')
            setOrders(res.data.data || [])
            setImageBaseUrl(res.data.meta?.imageBaseUrl || '')
        } catch (err) {
            const msg = err?.response?.data?.message
                || err?.response?.data?.msg
                || 'Failed to load orders. Please try again.'
            console.error('[OrdersClient] fetchOrders error:', err)
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchOrders() }, [])

    const filtered = filter
        ? orders.filter(o => o.orderStatus === filter)
        : orders

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* ── Page Header ─────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">My Orders</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {loading ? 'Loading...' : `${orders.length} order${orders.length !== 1 ? 's' : ''} total`}
                    </p>
                </div>
                <button
                    onClick={fetchOrders}
                    disabled={loading}
                    className="flex items-center gap-2 text-sm text-[#01A49E] font-bold hover:underline disabled:opacity-50"
                >
                    <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* ── Status Filter Tabs ───────────────────────────────────── */}
            {!loading && orders.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    {STATUS_FILTERS.map(f => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition
                                ${filter === f.value
                                    ? 'bg-[#01A49E] text-white border-[#01A49E]'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#01A49E] hover:text-[#01A49E]'}`}
                        >
                            {f.label}
                            {f.value && (
                                <span className="ml-1 opacity-70">
                                    ({orders.filter(o => f.value ? o.orderStatus === f.value : true).length})
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* ── Loading ──────────────────────────────────────────────── */}
            {loading && (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                            <div className="flex justify-between mb-4">
                                <div className="space-y-2">
                                    <div className="h-3 w-32 bg-gray-200 rounded" />
                                    <div className="h-3 w-24 bg-gray-200 rounded" />
                                </div>
                                <div className="h-6 w-20 bg-gray-200 rounded-full" />
                            </div>
                            <div className="flex gap-3">
                                {[1, 2, 3].map(j => (
                                    <div key={j} className="h-16 w-28 bg-gray-200 rounded-xl" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Error ───────────────────────────────────────────────── */}
            {!loading && error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                    <p className="text-red-600 font-semibold text-sm mb-3">{error}</p>
                    <button
                        onClick={fetchOrders}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* ── Empty ───────────────────────────────────────────────── */}
            {!loading && !error && orders.length === 0 && <EmptyOrders />}

            {/* ── Empty filtered ──────────────────────────────────────── */}
            {!loading && !error && orders.length > 0 && filtered.length === 0 && (
                <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
                    <FiPackage size={32} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-semibold text-sm">No {filter} orders found</p>
                    <button onClick={() => setFilter('')} className="mt-2 text-xs text-[#01A49E] font-bold hover:underline">
                        Show all orders
                    </button>
                </div>
            )}

            {/* ── Orders List ─────────────────────────────────────────── */}
            {!loading && !error && filtered.length > 0 && (
                <div className="space-y-4">
                    {filtered.map(order => (
                        <OrderCard
                            key={order._id}
                            order={order}
                            imageBaseUrl={imageBaseUrl}
                            onCancelSuccess={(orderId, updatedFields) => {
                                setOrders(prev => prev.map(o =>
                                    o._id === orderId ? { ...o, ...updatedFields } : o
                                ))
                            }}
                        />
                    ))}
                </div>
            )}

        </div>
    )
}
