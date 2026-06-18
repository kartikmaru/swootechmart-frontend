'use client'
import { useState } from 'react'
import { client, notify } from '@/utils/Helper'
import { useRouter } from 'next/navigation'
import { FiMapPin, FiCreditCard, FiPackage } from 'react-icons/fi'

const STATUS_STEPS = ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered']

export default function OrderDetails({ order, imageBaseUrl }) {
    const [cancelling, setCancelling] = useState(false)
    const router = useRouter()

    const currentStep = STATUS_STEPS.indexOf(order.orderStatus)
    const canCancel   = ['placed', 'confirmed'].includes(order.orderStatus)

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel this order?')) return
        setCancelling(true)
        try {
            await client.patch(`order/cancel/${order._id}`)
            notify('Order cancelled successfully', true)
            router.refresh()
        } catch {
            notify('Failed to cancel order', false)
        } finally {
            setCancelling(false)
        }
    }

    return (
        <div className="border-t border-gray-100 px-5 pb-5 space-y-5 pt-4 bg-gray-50/50">

            {/* ── Status Timeline ──────────────────────────────────────── */}
            {order.orderStatus !== 'cancelled' && order.orderStatus !== 'return' && (
                <div>
                    <p className="text-xs font-black text-gray-700 uppercase tracking-wide mb-3">Order Progress</p>
                    <div className="flex items-center gap-0">
                        {STATUS_STEPS.map((step, i) => {
                            const done    = i <= currentStep
                            const active  = i === currentStep
                            const labels  = ['Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered']
                            return (
                                <div key={step} className="flex items-center flex-1 min-w-0">
                                    <div className="flex flex-col items-center shrink-0">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border-2 transition
                                            ${done ? 'bg-[#01A49E] border-[#01A49E] text-white' : 'bg-white border-gray-300 text-gray-400'}
                                            ${active ? 'ring-2 ring-[#01A49E]/30 scale-110' : ''}`}>
                                            {done ? '✓' : i + 1}
                                        </div>
                                        <p className={`text-[9px] font-semibold mt-1 text-center leading-tight max-w-[60px] ${done ? 'text-[#01A49E]' : 'text-gray-400'}`}>
                                            {labels[i]}
                                        </p>
                                    </div>
                                    {i < STATUS_STEPS.length - 1 && (
                                        <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < currentStep ? 'bg-[#01A49E]' : 'bg-gray-200'}`} />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* ── Items List ───────────────────────────────────────────── */}
            <div>
                <p className="text-xs font-black text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <FiPackage size={12} /> Items Ordered
                </p>
                <div className="space-y-2">
                    {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 py-2.5">
                            <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                {item.product_id?.thumbnail
                                    ? <img src={imageBaseUrl + item.product_id.thumbnail} alt="" className="w-full h-full object-contain p-1" />
                                    : <FiPackage size={18} className="text-gray-300" />
                                }
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">
                                    {item.product_id?.name || 'Product'}
                                </p>
                                <p className="text-xs text-gray-400">
                                    ₹{item.price?.toLocaleString('en-IN')} × {item.qty}
                                </p>
                            </div>
                            <span className="text-sm font-black text-gray-800 shrink-0">
                                ₹{item.total?.toLocaleString('en-IN')}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Order Summary + Address ──────────────────────────────── */}
            <div className="grid sm:grid-cols-2 gap-4">

                {/* Summary */}
                <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-black text-gray-700 uppercase tracking-wide flex items-center gap-1 mb-3">
                        <FiCreditCard size={12} /> Payment Summary
                    </p>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span className="font-semibold">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Shipping</span>
                        <span className="font-semibold text-green-600">Free</span>
                    </div>
                    <div className="border-t border-gray-100 pt-2 flex justify-between text-sm font-black text-gray-900">
                        <span>Total</span>
                        <span>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 pt-1">
                        <span>Payment Method</span>
                        <span className="font-semibold uppercase">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Payment Status</span>
                        <span className={`font-bold capitalize ${order.paymentStatus === 'paid' ? 'text-green-600' : order.paymentStatus === 'failed' ? 'text-red-500' : 'text-yellow-600'}`}>
                            {order.paymentStatus}
                        </span>
                    </div>
                </div>

                {/* Address */}
                <div className="bg-white border border-gray-100 rounded-xl p-4">
                    <p className="text-xs font-black text-gray-700 uppercase tracking-wide flex items-center gap-1 mb-3">
                        <FiMapPin size={12} /> Shipping Address
                    </p>
                    <div className="space-y-1 text-sm text-gray-600">
                        <p className="font-bold text-gray-800">{order.shippingAddress?.fullName}</p>
                        <p>{order.shippingAddress?.addressLine}</p>
                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}</p>
                        <p>{order.shippingAddress?.country}</p>
                        <p className="text-xs text-gray-400 pt-1">📞 {order.shippingAddress?.mobile}</p>
                    </div>
                </div>
            </div>

            {/* ── Cancel Button ─────────────────────────────────────────── */}
            {canCancel && (
                <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="flex items-center gap-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border border-red-200 hover:border-red-500 px-4 py-2 rounded-xl text-sm font-bold transition disabled:opacity-50"
                >
                    {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
            )}
        </div>
    )
}
