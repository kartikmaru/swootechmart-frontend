'use client'
import { useState } from 'react'
import OrderStatusBadge from './OrderStatusBadge'
import OrderDetails from './OrderDetails'
import { FiChevronDown, FiChevronUp, FiPackage } from 'react-icons/fi'

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
    })
}

export default function OrderCard({ order, imageBaseUrl }) {
    const [open, setOpen] = useState(false)

    const paymentBadge = {
        pending: 'bg-yellow-100 text-yellow-700',
        paid:    'bg-green-100 text-green-700',
        failed:  'bg-red-100 text-red-700',
    }[order.paymentStatus] || 'bg-gray-100 text-gray-600'

    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition">

            {/* ── Card Header ─────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Order ID</p>
                        <p className="text-xs font-black text-gray-700 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="hidden sm:block w-px h-8 bg-gray-200" />
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Date</p>
                        <p className="text-xs font-semibold text-gray-700">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="hidden sm:block w-px h-8 bg-gray-200" />
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Items</p>
                        <p className="text-xs font-semibold text-gray-700">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <OrderStatusBadge status={order.orderStatus} />
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${paymentBadge}`}>
                        {order.paymentStatus}
                    </span>
                    <span className="text-base font-black text-gray-900">
                        ₹{order.totalAmount?.toLocaleString('en-IN')}
                    </span>
                </div>
            </div>

            {/* ── Products Preview ─────────────────────────────────────── */}
            <div className="px-5 py-4">
                <div className="flex gap-3 flex-wrap">
                    {order.items.slice(0, 4).map((item, i) => (
                        <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                {item.product_id?.thumbnail
                                    ? <img src={imageBaseUrl + item.product_id.thumbnail} alt=""
                                        className="w-full h-full object-contain p-1" />
                                    : <FiPackage size={16} className="text-gray-300" />
                                }
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-800 max-w-[120px] truncate">
                                    {item.product_id?.name || 'Product'}
                                </p>
                                <p className="text-[10px] text-gray-400">
                                    Qty: {item.qty} · ₹{item.price?.toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>
                    ))}
                    {order.items.length > 4 && (
                        <div className="flex items-center justify-center bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                            <span className="text-xs text-gray-500 font-semibold">+{order.items.length - 4} more</span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── View Details Toggle ──────────────────────────────────── */}
            <div className="px-5 pb-4">
                <button
                    onClick={() => setOpen(o => !o)}
                    className="flex items-center gap-2 text-sm font-bold text-[#01A49E] hover:text-[#01857f] transition"
                >
                    {open ? <><FiChevronUp size={15} /> Hide Details</> : <><FiChevronDown size={15} /> View Details</>}
                </button>
            </div>

            {/* ── Expanded Details ─────────────────────────────────────── */}
            {open && <OrderDetails order={order} imageBaseUrl={imageBaseUrl} />}
        </div>
    )
}
