export default function OrderStatusBadge({ status }) {
    const map = {
        placed:           { label: 'Placed',           cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
        confirmed:        { label: 'Confirmed',        cls: 'bg-blue-100 text-blue-700 border-blue-200' },
        shipped:          { label: 'Shipped',          cls: 'bg-purple-100 text-purple-700 border-purple-200' },
        out_for_delivery: { label: 'Out for Delivery', cls: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
        delivered:        { label: 'Delivered',        cls: 'bg-green-100 text-green-700 border-green-200' },
        cancelled:        { label: 'Cancelled',        cls: 'bg-red-100 text-red-700 border-red-200' },
        return:           { label: 'Return',           cls: 'bg-orange-100 text-orange-700 border-orange-200' },
    }
    const s = map[status] || { label: status, cls: 'bg-gray-100 text-gray-600 border-gray-200' }
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${s.cls}`}>
            {s.label}
        </span>
    )
}
