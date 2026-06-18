import Link from 'next/link'
import { FiPackage } from 'react-icons/fi'

export default function EmptyOrders() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mb-4">
                <FiPackage size={36} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2">No orders yet</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-xs">
                You haven't placed any orders. Start shopping to see your order history here.
            </p>
            <Link href="/store"
                className="bg-[#01A49E] hover:bg-[#01857f] text-white font-bold px-6 py-3 rounded-xl transition shadow-sm">
                Start Shopping
            </Link>
        </div>
    )
}
