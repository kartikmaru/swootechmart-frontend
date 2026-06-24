'use client'
import { useState } from 'react'
import { client, notify } from '@/utils/Helper'
import { FiMapPin, FiCreditCard, FiPackage, FiAlertTriangle, FiX } from 'react-icons/fi'

const STATUS_STEPS = ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered']

// ── Confirmation Dialog ────────────────────────────────────────────────────
function CancelConfirmDialog({ onConfirm, onClose, cancelling }) {
    return (
        // Backdrop
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in duration-200">

                {/* Close */}
                <button
                    onClick={onClose}
                    disabled={cancelling}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
                >
                    <FiX size={18} />
                </button>

                {/* Icon */}
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FiAlertTriangle size={26} className="text-red-500" />
                </div>

                {/* Text */}
                <h3 className="text-lg font-black text-gray-900 text-center mb-1">
                    Cancel Order?
                </h3>
                <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
                    Are you sure you want to cancel this order?
                    This action <span className="font-semibold text-gray-700">cannot be undone</span>.
                    If you already paid, a refund will be initiated.
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={cancelling}
                        className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition text-sm disabled:opacity-50"
                    >
                        Keep Order
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={cancelling}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {cancelling ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Cancelling...
                            </>
                        ) : 'Yes, Cancel'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── Main Component ────────────────────────────────────────────────────────
export default function OrderDetails({ order, imageBaseUrl, onCancelSuccess }) {
    const [showConfirm, setShowConfirm] = useState(false)
    const [cancelling,  setCancelling]  = useState(false)

    const currentStep = STATUS_STEPS.indexOf(order.orderStatus)

    // Only 'placed' orders can be cancelled (placed = the initial/pending status in this app)
    const canCancel = order.orderStatus === 'placed'

    const handleCancel = async () => {
        setCancelling(true)
        try {
            const res = await client.patch(`order/cancel/${order._id}`)

            if (res.data.success) {
                notify('Order cancelled successfully', true)
                setShowConfirm(false)
                // Pass updated fields back to OrderCard → OrdersClient
                // This updates the UI instantly without any page reload
                onCancelSuccess?.({
                    orderStatus:   res.data.data.orderStatus,   // 'cancelled'
                    paymentStatus: res.data.data.paymentStatus, // 'refund_pending' if was paid
                })
            } else {
                notify(res.data.msg || 'Failed to cancel order', false)
                setShowConfirm(false)
            }
        } catch (err) {
            const msg = err?.response?.data?.msg
                || err?.response?.data?.message
                || 'Failed to cancel order. Please try again.'
            notify(msg, false)
            setShowConfirm(false)
        } finally {
            setCancelling(false)
        }
    }

    return (
        <>
            {/* Confirmation Dialog — rendered in portal position */}
            {showConfirm && (
                <CancelConfirmDialog
                    onConfirm={handleCancel}
                    onClose={() => !cancelling && setShowConfirm(false)}
                    cancelling={cancelling}
                />
            )}

            <div className="border-t border-gray-100 px-5 pb-5 space-y-5 pt-4 bg-gray-50/50">

                {/* ── Status Timeline ──────────────────────────────────────── */}
                {order.orderStatus !== 'cancelled' && order.orderStatus !== 'return' && (
                    <div>
                        <p className="text-xs font-black text-gray-700 uppercase tracking-wide mb-3">Order Progress</p>
                        <div className="flex items-center gap-0">
                            {STATUS_STEPS.map((step, i) => {
                                const done   = i <= currentStep
                                const active = i === currentStep
                                const labels = ['Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered']
                                return (
                                    <div key={step} className="flex items-center flex-1 min-w-0">
                                        <div className="flex flex-col items-center shrink-0">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border-2 transition
                                                ${done   ? 'bg-[#01A49E] border-[#01A49E] text-white' : 'bg-white border-gray-300 text-gray-400'}
                                                ${active ? 'ring-2 ring-[#01A49E]/30 scale-110' : ''}`}>
                                                {done ? '✓' : i + 1}
                                            </div>
                                            <p className={`text-[9px] font-semibold mt-1 text-center leading-tight max-w-[60px]
                                                ${done ? 'text-[#01A49E]' : 'text-gray-400'}`}>
                                                {labels[i]}
                                            </p>
                                        </div>
                                        {i < STATUS_STEPS.length - 1 && (
                                            <div className={`flex-1 h-0.5 mx-1 mb-4
                                                ${i < currentStep ? 'bg-[#01A49E]' : 'bg-gray-200'}`}
                                            />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* ── Cancelled Banner ─────────────────────────────────────── */}
                {order.orderStatus === 'cancelled' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
                        <FiAlertTriangle size={18} className="text-red-500 shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-red-700">Order Cancelled</p>
                            {order.paymentStatus === 'refund_pending' && (
                                <p className="text-xs text-red-500 mt-0.5">
                                    Refund is being processed and will reflect in 5–7 business days.
                                </p>
                            )}
                            {order.paymentStatus === 'refunded' && (
                                <p className="text-xs text-green-600 mt-0.5">
                                    Refund has been processed successfully.
                                </p>
                            )}
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
                                        ? <img src={imageBaseUrl + item.product_id.thumbnail} alt=""
                                            className="w-full h-full object-contain p-1" />
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

                    {/* Payment Summary */}
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
                            <span className={`font-bold capitalize ${
                                order.paymentStatus === 'paid'           ? 'text-green-600'  :
                                order.paymentStatus === 'failed'         ? 'text-red-500'    :
                                order.paymentStatus === 'refund_pending' ? 'text-orange-500' :
                                order.paymentStatus === 'refunded'       ? 'text-teal-600'   :
                                'text-yellow-600'
                            }`}>
                                {order.paymentStatus === 'refund_pending' ? 'Refund Pending' : order.paymentStatus}
                            </span>
                        </div>
                    </div>

                    {/* Shipping Address */}
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

                {/* ── Cancel Button — only shown when order is 'placed' ─────── */}
                {canCancel && (
                    <div className="pt-1">
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="flex items-center gap-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border border-red-200 hover:border-red-500 px-5 py-2.5 rounded-xl text-sm font-bold transition group"
                        >
                            <FiX size={14} className="group-hover:rotate-90 transition-transform duration-200" />
                            Cancel Order
                        </button>
                        <p className="text-xs text-gray-400 mt-1.5 ml-1">
                            Orders can only be cancelled before they are confirmed.
                        </p>
                    </div>
                )}

            </div>
        </>
    )
}
