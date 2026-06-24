'use client';
import Link from 'next/link';
import { FiPackage, FiCheckCircle, FiHome, FiShoppingBag } from 'react-icons/fi';

export default function ThankYouPage({ orderId }) {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
            <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 sm:p-12 text-center w-full max-w-md">

                {/* Success icon */}
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <FiCheckCircle size={40} className="text-green-500" />
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
                    Order Placed!
                </h1>
                <p className="text-gray-500 text-sm sm:text-base mb-6 leading-relaxed">
                    Thank you for shopping with SwooTechMart. Your order has been confirmed and will be delivered soon.
                </p>

                {/* Order ID */}
                <div className="bg-teal-50 border border-teal-100 rounded-2xl px-5 py-4 mb-8">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide flex items-center justify-center gap-1.5 mb-1">
                        <FiPackage size={12} /> Order ID
                    </p>
                    <p className="text-lg font-black text-[#01A49E] font-mono tracking-wide">
                        #{orderId}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/orders"
                        className="flex-1 flex items-center justify-center gap-2 bg-[#01A49E] hover:bg-[#01857f] text-white font-bold py-3 rounded-xl transition text-sm">
                        <FiPackage size={15} /> Track Orders
                    </Link>
                    <Link href="/"
                        className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold py-3 rounded-xl transition text-sm">
                        <FiHome size={15} /> Go Home
                    </Link>
                </div>

                <Link href="/store"
                    className="mt-4 flex items-center justify-center gap-1.5 text-sm text-[#01A49E] font-semibold hover:underline">
                    <FiShoppingBag size={14} /> Continue Shopping
                </Link>
            </div>
        </div>
    );
}
