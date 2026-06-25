'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { client, notify } from '@/utils/Helper';
import {
    FiMail, FiMapPin, FiPlus, FiTrash2,
    FiShoppingBag, FiHome, FiCheckCircle, FiX,
    FiPackage, FiUser, FiPhone, FiChevronRight,
    FiSettings, FiShield, FiGrid, FiBell, FiRefreshCw,
    FiAlertTriangle, FiCreditCard, FiEye
} from 'react-icons/fi';
import Link from 'next/link';

// ── AddressForm — MUST be defined OUTSIDE Profile component ───────────────────
// If defined inside, every Profile re-render creates a new function reference,
// causing React to unmount/remount the form → input loses focus on every keystroke.
// Keeping it here as a stable top-level component fixes the blur bug completely.
function AddressForm({ onSave, loading }) {
    const emptyForm = { fullName: '', mobile: '', pincode: '', addressLine: '', city: '', state: '' }
    const [form, setForm] = useState(emptyForm)

    // useCallback ensures handleChange reference is stable — no unnecessary re-renders
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await onSave(form)
        setForm(emptyForm)   // reset only after successful save
    }

    return (
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5">
            <h4 className="text-sm font-bold text-teal-700 mb-4 flex items-center gap-2">
                <FiHome size={14} /> New Delivery Address
            </h4>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name</label>
                        <input
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            type="text"
                            placeholder="Enter full name"
                            required
                            autoComplete="off"
                            className="w-full bg-white border border-gray-200 px-3.5 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">Mobile</label>
                        <input
                            name="mobile"
                            value={form.mobile}
                            onChange={handleChange}
                            type="text"
                            placeholder="10-digit number"
                            required
                            autoComplete="off"
                            className="w-full bg-white border border-gray-200 px-3.5 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Address Line</label>
                    <textarea
                        name="addressLine"
                        value={form.addressLine}
                        onChange={handleChange}
                        rows={2}
                        placeholder="House no., street, area..."
                        required
                        className="w-full bg-white border border-gray-200 px-3.5 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-teal-400 text-sm resize-none"
                    />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                        { name: 'city',    placeholder: 'City' },
                        { name: 'state',   placeholder: 'State' },
                        { name: 'pincode', placeholder: 'Pincode' },
                    ].map(f => (
                        <div key={f.name}>
                            <label className="text-xs font-semibold text-gray-600 block mb-1 capitalize">{f.name}</label>
                            <input
                                name={f.name}
                                value={form[f.name]}
                                onChange={handleChange}
                                type="text"
                                placeholder={f.placeholder}
                                required
                                autoComplete="off"
                                className="w-full bg-white border border-gray-200 px-3 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                            />
                        </div>
                    ))}
                </div>
                <button type="submit" disabled={loading}
                    className="flex items-center gap-2 bg-[#01A49E] hover:bg-[#01857f] text-white font-bold px-5 py-2.5 rounded-xl transition text-sm disabled:opacity-60">
                    {loading
                        ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                        : <><FiCheckCircle size={14} /> Save Address</>}
                </button>
            </form>
        </div>
    )
}

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
    { id: 'orders',    label: 'My Orders', icon: FiPackage },
    { id: 'addresses', label: 'Addresses', icon: FiMapPin },
    { id: 'security',  label: 'Security',  icon: FiShield },
    { id: 'settings',  label: 'Settings',  icon: FiSettings },
]

export default function Profile({ user }) {
    const router = useRouter()

    const [activeTab,     setActiveTab]     = useState('dashboard')
    const [addresses,     setAddresses]     = useState(user?.addresses || [])
    const [showForm,      setShowForm]      = useState(false)
    const [deleteIndex,   setDeleteIndex]   = useState(null)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [orderStats,    setOrderStats]    = useState({ totalOrders: 0, totalSpent: 0 })
    const [statsLoading,  setStatsLoading]  = useState(true)
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        orderUpdates: true,
        promotionalOffers: false,
    })

    const initial = user?.name?.charAt(0)?.toUpperCase() || 'U'

    // Fetch order stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await client.get('order/stats')
                if (res.data.success) setOrderStats(res.data.data)
            } catch (_) {}
            finally { setStatsLoading(false) }
        }
        fetchStats()
    }, [])

    // Delete Address
    const handleDelete = async (index) => {
        setDeleteIndex(index)
        try {
            await client.put('User/deleteaddress', { index })
            setAddresses(prev => prev.filter((_, i) => i !== index))
            notify('Address removed', true)
        } catch { notify('Failed to delete', false) }
        finally { setDeleteIndex(null) }
    }

    // Toggle notification setting
    const toggleNotification = (key) => {
        setNotifications(prev => {
            const updated = { ...prev, [key]: !prev[key] }
            const labels = { emailNotifications: 'Email Notifications', orderUpdates: 'Order Updates', promotionalOffers: 'Promotional Offers' }
            notify(`${labels[key]} ${updated[key] ? 'enabled' : 'disabled'}`, true)
            return updated
        })
    }

    // ── Sidebar — NO logout button (logout is in header dropdown) ────────────
    const Sidebar = () => (
        <aside className="w-full lg:w-64 xl:w-72 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Avatar + User info */}
                <div className="bg-gradient-to-br from-[#01A49E] to-emerald-500 px-5 py-6 text-center relative">
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                    <div className="relative">
                        {/* Avatar circle */}
                        <div className="w-16 h-16 rounded-full bg-white/25 border-2 border-white/50 flex items-center justify-center text-2xl font-black text-white mx-auto mb-3 shadow-md">
                            {initial}
                        </div>
                        {/* Name */}
                        <p className="font-black text-base text-white capitalize leading-tight truncate px-2">
                            {user?.name || 'User'}
                        </p>
                        {/* Email */}
                        <p className="text-white/70 text-xs mt-0.5 truncate px-2">{user?.email}</p>
                        {/* Verified badge */}
                        {user?.isVerified && (
                            <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[11px] font-semibold px-3 py-1 rounded-full mt-2.5 border border-white/30">
                                <span className="w-1.5 h-1.5 bg-green-300 rounded-full" />
                                Verified Account
                            </div>
                        )}
                    </div>
                </div>

                {/* Nav items */}
                <nav className="p-2.5 space-y-0.5">
                    {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => setActiveTab(id)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition group
                                ${activeTab === id
                                    ? 'bg-teal-50 text-[#01A49E]'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                            <div className="flex items-center gap-2.5">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition shrink-0
                                    ${activeTab === id
                                        ? 'bg-[#01A49E] text-white'
                                        : 'bg-gray-100 text-gray-400 group-hover:bg-teal-50 group-hover:text-[#01A49E]'}`}>
                                    <Icon size={14} />
                                </div>
                                {label}
                            </div>
                            <div className="flex items-center gap-1.5">
                                {id === 'orders' && (
                                    <span className="bg-[#01A49E] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                        {statsLoading ? '-' : orderStats.totalOrders}
                                    </span>
                                )}
                                <FiChevronRight size={13}
                                    className={`transition-transform ${activeTab === id ? 'rotate-90 text-[#01A49E]' : 'text-gray-300'}`} />
                            </div>
                        </button>
                    ))}
                </nav>

                {/* Member since info */}
                <div className="mx-2.5 mb-2.5 px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Member Since</p>
                    <p className="text-sm font-bold text-gray-700 mt-0.5">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—'}
                    </p>
                </div>
            </div>
        </aside>
    )

    // ── Dashboard ─────────────────────────────────────────────────────────────
    const DashboardContent = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-black text-gray-900">Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
                <p className="text-sm text-gray-500 mt-1">Here's a summary of your account</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Saved Addresses', value: addresses.length, icon: <FiMapPin size={18} />, color: 'bg-teal-50 text-[#01A49E]', action: () => setActiveTab('addresses') },
                    { label: 'Total Orders', value: statsLoading ? '—' : orderStats.totalOrders, icon: <FiPackage size={18} />, color: 'bg-orange-50 text-orange-500', action: () => setActiveTab('orders') },
                    { label: 'Total Spent', value: statsLoading ? '—' : `₹${Number(orderStats.totalSpent).toLocaleString('en-IN')}`, icon: <FiUser size={18} />, color: 'bg-purple-50 text-purple-500', action: null },
                ].map(stat => (
                    <button key={stat.label} onClick={stat.action || undefined}
                        className={`bg-white border border-gray-100 rounded-2xl p-5 text-left transition
                            ${stat.action ? 'hover:border-teal-200 hover:shadow-sm cursor-pointer' : 'cursor-default'}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <p className="text-2xl font-black text-gray-800">{stat.value}</p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">{stat.label}</p>
                    </button>
                ))}
            </div>

            {/* Quick actions */}
            <div>
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link href="/store" className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 hover:border-teal-200 hover:shadow-sm transition group">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-400 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition shrink-0">
                            <FiShoppingBag size={16} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 text-sm">Continue Shopping</p>
                            <p className="text-xs text-gray-400">Explore latest products</p>
                        </div>
                        <FiChevronRight size={14} className="ml-auto text-gray-300 group-hover:text-teal-500 transition" />
                    </Link>
                    <button onClick={() => setActiveTab('orders')}
                        className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 hover:border-teal-200 hover:shadow-sm transition group text-left">
                        <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#01A49E] flex items-center justify-center group-hover:bg-[#01A49E] group-hover:text-white transition shrink-0">
                            <FiPackage size={16} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 text-sm">My Orders</p>
                            <p className="text-xs text-gray-400">Track your orders</p>
                        </div>
                        <FiChevronRight size={14} className="ml-auto text-gray-300 group-hover:text-teal-500 transition" />
                    </button>
                </div>
            </div>
        </div>
    )

    // ── Addresses ─────────────────────────────────────────────────────────────
    // AddressesContent renders AddressForm as a STABLE top-level component.
    // If AddressForm were defined here inside render, every keystroke would
    // cause Profile to re-render → new function ref → React unmounts form → focus lost.
    const AddressesContent = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-gray-900">Delivery Addresses</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}
                    </p>
                </div>
                <button onClick={() => setShowForm(p => !p)}
                    className={`flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl transition
                        ${showForm ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-[#01A49E] hover:bg-[#01857f] text-white shadow-sm'}`}>
                    {showForm ? <><FiX size={14} /> Cancel</> : <><FiPlus size={14} /> Add New</>}
                </button>
            </div>

            {/* AddressForm is a STABLE top-level component — not re-created on each render */}
            {showForm && (
                <AddressForm
                    onSave={async (formData) => {
                        setSubmitLoading(true)
                        try {
                            const res = await client.post('User/addaddresses', formData)
                            setAddresses(res.data.data)
                            setShowForm(false)
                            notify('Address added!', true)
                        } catch { notify('Failed to add address', false) }
                        finally { setSubmitLoading(false) }
                    }}
                    loading={submitLoading}
                />
            )}

            {addresses.length === 0 && !showForm && (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                        <FiMapPin size={22} className="text-gray-300" />
                    </div>
                    <p className="text-gray-600 font-semibold text-sm">No saved addresses</p>
                    <button onClick={() => setShowForm(true)}
                        className="mt-3 text-sm text-teal-600 font-bold hover:underline">
                        + Add your first address
                    </button>
                </div>
            )}

            <div className="space-y-3">
                {addresses.map((addr, index) => (
                    <div key={addr._id || index}
                        className="flex items-start gap-3 bg-white border border-gray-100 hover:border-teal-200 rounded-2xl p-4 transition">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#01A49E] flex items-center justify-center text-sm font-black shrink-0">
                            {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <h4 className="font-bold text-gray-800 text-sm">{addr.fullName}</h4>
                                {index === 0 && (
                                    <span className="text-[10px] bg-[#01A49E] text-white font-semibold px-2 py-0.5 rounded-full">
                                        Default
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {addr.addressLine}, {addr.city}, {addr.state} — {addr.pincode}
                            </p>
                            <span className="inline-flex items-center gap-1 text-xs text-gray-400 mt-1">
                                <FiPhone size={10} /> {addr.mobile}
                            </span>
                        </div>
                        <button onClick={() => handleDelete(index)} disabled={deleteIndex === index}
                            className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-40 shrink-0">
                            {deleteIndex === index
                                ? <div className="w-3 h-3 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                                : <FiTrash2 size={14} />}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )

    // ── Settings ─────────────────────────────────────────────────────────────
    const SettingsContent = () => {
        const toggleItems = [
            { key: 'emailNotifications', icon: FiMail,    label: 'Email Notifications', desc: 'Receive account and order emails' },
            { key: 'orderUpdates',       icon: FiPackage, label: 'Order Updates',        desc: 'Get notified on order status changes' },
            { key: 'promotionalOffers',  icon: FiBell,    label: 'Promotional Offers',   desc: 'Deals, discounts and new arrivals' },
        ]
        return (
            <div className="space-y-5">
                <div>
                    <h2 className="text-xl font-black text-gray-900">Settings</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manage your notification preferences</p>
                </div>
                <div className="space-y-3">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <FiBell size={11} /> Notifications
                    </p>
                    {toggleItems.map(({ key, icon: Icon, label, desc }) => (
                        <div key={key}
                            className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3.5">
                            <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition
                                    ${notifications[key] ? 'bg-teal-50 text-[#01A49E]' : 'bg-gray-100 text-gray-400'}`}>
                                    <Icon size={15} />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">{label}</p>
                                    <p className="text-xs text-gray-400">{desc}</p>
                                </div>
                            </div>
                            {/* Toggle switch */}
                            <button onClick={() => toggleNotification(key)} type="button"
                                role="switch" aria-checked={notifications[key]}
                                className={`relative inline-flex w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-1 shrink-0
                                    ${notifications[key] ? 'bg-[#01A49E]' : 'bg-gray-200'}`}>
                                <span className={`inline-block w-3.5 h-3.5 bg-white rounded-full shadow transform transition-transform duration-200 mt-[3px]
                                    ${notifications[key] ? 'translate-x-[22px]' : 'translate-x-[3px]'}`} />
                            </button>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-gray-400">ℹ️ Settings are saved locally in this session.</p>
            </div>
        )
    }

    // ── Order Detail Modal ────────────────────────────────────────────────────
    const OrderDetailModal = ({ orderId, imageBaseUrl: listBaseUrl, onClose }) => {
        const [order,   setOrder]   = useState(null)
        const [imgBase, setImgBase] = useState(listBaseUrl || '')
        const [loading, setLoading] = useState(true)
        const [error,   setError]   = useState(null)

        useEffect(() => {
            const fetch = async () => {
                try {
                    const res = await client.get(`order/${orderId}`)
                    setOrder(res.data.data)
                    setImgBase(res.data.meta?.imageBaseUrl || listBaseUrl || '')
                } catch (err) {
                    setError(err?.response?.data?.msg || 'Failed to load order details.')
                } finally { setLoading(false) }
            }
            fetch()
        }, [orderId])

        const S = {
            placed:           'bg-yellow-100 text-yellow-700 border-yellow-200',
            confirmed:        'bg-blue-100 text-blue-700 border-blue-200',
            shipped:          'bg-purple-100 text-purple-700 border-purple-200',
            out_for_delivery: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            delivered:        'bg-green-100 text-green-700 border-green-200',
            cancelled:        'bg-red-100 text-red-700 border-red-200',
        }
        const P = {
            pending: 'text-yellow-600', paid: 'text-green-600', failed: 'text-red-500',
            refund_pending: 'text-orange-500', refunded: 'text-teal-600',
        }

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
                        <div>
                            <h2 className="font-black text-gray-900 text-base">Order Details</h2>
                            {order && <p className="text-xs text-gray-400 font-mono mt-0.5">#{order._id.slice(-10).toUpperCase()}</p>}
                        </div>
                        <button onClick={onClose}
                            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition">
                            <FiX size={16} />
                        </button>
                    </div>
                    <div className="overflow-y-auto flex-1 p-5 space-y-5">
                        {loading && (
                            <div className="space-y-3 animate-pulse">
                                {[48, 32, 80, 80].map((h, i) => (
                                    <div key={i} className={`h-${h === 48 ? 12 : h === 32 ? 8 : 20} bg-gray-100 rounded-xl`} style={{ height: h }} />
                                ))}
                            </div>
                        )}
                        {!loading && error && (
                            <div className="text-center py-8">
                                <FiAlertTriangle size={28} className="text-red-400 mx-auto mb-2" />
                                <p className="text-sm font-semibold text-red-600">{error}</p>
                            </div>
                        )}
                        {!loading && order && (
                            <>
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border capitalize ${S[order.orderStatus] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                        {order.orderStatus.replace(/_/g, ' ')}
                                    </span>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-400 font-semibold uppercase">Order Date</p>
                                        <p className="text-xs font-semibold text-gray-700">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                        <FiPackage size={11} /> Items ({order.items.length})
                                    </p>
                                    <div className="space-y-2">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                                                <div className="w-11 h-11 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                                    {item.product_id?.thumbnail
                                                        ? <img src={imgBase + item.product_id.thumbnail} alt="" className="w-full h-full object-contain p-1" />
                                                        : <FiPackage size={14} className="text-gray-300" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-800 truncate">{item.product_id?.name || 'Product'}</p>
                                                    <p className="text-xs text-gray-400">₹{item.price?.toLocaleString('en-IN')} × {item.qty}</p>
                                                </div>
                                                <span className="text-sm font-black text-gray-800 shrink-0">₹{item.total?.toLocaleString('en-IN')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-teal-50 border border-teal-100 rounded-xl px-4 py-3 flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-700">Order Total</span>
                                    <span className="text-lg font-black text-[#01A49E]">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white border border-gray-100 rounded-xl p-3.5 space-y-2">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-wide flex items-center gap-1"><FiCreditCard size={10} /> Payment</p>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Method</span>
                                            <span className="font-bold text-gray-800 uppercase">{order.paymentMethod}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Status</span>
                                            <span className={`font-bold capitalize ${P[order.paymentStatus] || 'text-gray-600'}`}>
                                                {order.paymentStatus === 'refund_pending' ? 'Refund Pending' : order.paymentStatus}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-white border border-gray-100 rounded-xl p-3.5">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-wide flex items-center gap-1 mb-2"><FiMapPin size={10} /> Address</p>
                                        <p className="font-bold text-gray-800 text-sm">{order.shippingAddress?.fullName}</p>
                                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                            {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><FiPhone size={10} /> {order.shippingAddress?.mobile}</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    // ── Orders Tab ────────────────────────────────────────────────────────────
    const OrdersContent = () => {
        const [orders,       setOrders]       = useState([])
        const [imageBaseUrl, setImageBaseUrl] = useState('')
        const [ordLoading,   setOrdLoading]   = useState(true)
        const [ordError,     setOrdError]     = useState(null)
        const [selectedId,   setSelectedId]   = useState(null)
        const [cancelId,     setCancelId]     = useState(null)
        const [cancelling,   setCancelling]   = useState(false)

        const loadOrders = async () => {
            setOrdLoading(true); setOrdError(null)
            try {
                const res = await client.get('order/my-orders')
                setOrders(res.data.data || [])
                setImageBaseUrl(res.data.meta?.imageBaseUrl || '')
            } catch (err) {
                setOrdError(err?.response?.data?.msg || 'Failed to load orders.')
            } finally { setOrdLoading(false) }
        }

        useEffect(() => { loadOrders() }, [])

        const handleCancelConfirm = async () => {
            if (!cancelId) return
            setCancelling(true)
            try {
                const res = await client.patch(`order/cancel/${cancelId}`)
                if (res.data.success) {
                    setOrders(prev => prev.map(o =>
                        o._id === cancelId ? { ...o, orderStatus: res.data.data.orderStatus, paymentStatus: res.data.data.paymentStatus } : o
                    ))
                    notify('Order cancelled successfully', true)
                } else {
                    notify(res.data.msg || 'Could not cancel order', false)
                }
            } catch (err) {
                notify(err?.response?.data?.msg || 'Cancel failed. Try again.', false)
            } finally { setCancelling(false); setCancelId(null) }
        }

        const SC = {
            placed: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700',
            shipped: 'bg-purple-100 text-purple-700', out_for_delivery: 'bg-indigo-100 text-indigo-700',
            delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700',
        }

        return (
            <>
                {selectedId && <OrderDetailModal orderId={selectedId} imageBaseUrl={imageBaseUrl} onClose={() => setSelectedId(null)} />}

                {cancelId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => !cancelling && setCancelId(null)}>
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
                            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FiAlertTriangle size={22} className="text-red-500" />
                            </div>
                            <h3 className="text-base font-black text-gray-900 text-center mb-1">Cancel Order?</h3>
                            <p className="text-sm text-gray-500 text-center mb-5 leading-relaxed">
                                Are you sure you want to cancel this order? This <span className="font-semibold text-gray-700">cannot be undone</span>.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setCancelId(null)} disabled={cancelling}
                                    className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition text-sm disabled:opacity-50">
                                    Keep Order
                                </button>
                                <button onClick={handleCancelConfirm} disabled={cancelling}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                                    {cancelling ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Cancelling…</> : 'Yes, Cancel'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-gray-900">My Orders</h2>
                        <button onClick={loadOrders} disabled={ordLoading}
                            className="flex items-center gap-1.5 text-xs text-teal-600 font-bold hover:underline disabled:opacity-50">
                            <FiRefreshCw size={11} className={ordLoading ? 'animate-spin' : ''} /> Refresh
                        </button>
                    </div>

                    {ordLoading && (
                        <div className="space-y-3">
                            {[1, 2].map(i => (
                                <div key={i} className="bg-gray-50 rounded-2xl p-4 animate-pulse h-24" />
                            ))}
                        </div>
                    )}

                    {!ordLoading && ordError && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
                            <FiAlertTriangle size={22} className="text-red-400 mx-auto mb-2" />
                            <p className="text-red-600 text-sm font-semibold">{ordError}</p>
                        </div>
                    )}

                    {!ordLoading && !ordError && orders.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                            <FiPackage size={32} className="text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-600 font-semibold text-sm">No orders yet</p>
                            <Link href="/store" className="mt-2 inline-block text-sm text-teal-600 font-bold hover:underline">Start Shopping →</Link>
                        </div>
                    )}

                    {!ordLoading && orders.map(order => (
                        <div key={order._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-sm transition">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 bg-gray-50/70 border-b border-gray-100">
                                <div className="flex items-center gap-4 flex-wrap">
                                    <div>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Order ID</p>
                                        <p className="text-xs font-black text-gray-700 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Date</p>
                                        <p className="text-xs font-semibold text-gray-700">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${SC[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                                        {order.orderStatus.replace(/_/g, ' ')}
                                    </span>
                                    <span className="text-sm font-black text-gray-900">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                            <div className="px-4 py-3 flex gap-2 flex-wrap">
                                {order.items.slice(0, 3).map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl px-2.5 py-2 border border-gray-100 text-xs">
                                        <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                            {item.product_id?.thumbnail
                                                ? <img src={imageBaseUrl + item.product_id.thumbnail} alt="" className="w-full h-full object-contain p-0.5" />
                                                : <FiPackage size={11} className="text-gray-300" />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 max-w-[80px] truncate">{item.product_id?.name || 'Product'}</p>
                                            <p className="text-gray-400">Qty: {item.qty}</p>
                                        </div>
                                    </div>
                                ))}
                                {order.items.length > 3 && (
                                    <div className="flex items-center bg-gray-50 rounded-xl px-2.5 py-2 border border-gray-100">
                                        <span className="text-xs text-gray-500 font-semibold">+{order.items.length - 3} more</span>
                                    </div>
                                )}
                            </div>
                            <div className="px-4 pb-3 flex items-center gap-3">
                                <button onClick={() => setSelectedId(order._id)}
                                    className="flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-800 transition">
                                    <FiEye size={12} /> View Details
                                </button>
                                {order.orderStatus === 'placed' && (
                                    <button onClick={() => setCancelId(order._id)}
                                        className="ml-auto flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-100 transition">
                                        <FiX size={11} /> Cancel Order
                                    </button>
                                )}
                                {order.orderStatus === 'cancelled' && (
                                    <span className="ml-auto text-xs font-bold text-red-400 flex items-center gap-1">
                                        <FiX size={11} /> Cancelled
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )
    }

    // ── Coming Soon ───────────────────────────────────────────────────────────
    const ComingSoon = ({ title }) => (
        <div className="space-y-4">
            <h2 className="text-xl font-black text-gray-900">{title}</h2>
            <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl">
                <div className="text-4xl mb-3">🔒</div>
                <p className="text-gray-500 font-semibold text-sm">Coming soon</p>
            </div>
        </div>
    )

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':  return <DashboardContent />
            case 'orders':     return <OrdersContent />
            case 'addresses':  return <AddressesContent />
            case 'security':   return <ComingSoon title="Security" />
            case 'settings':   return <SettingsContent />
            default:           return <DashboardContent />
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6">

            {/* Hero — generous pb so the card pulls up without overlapping title */}
            <div className="bg-gradient-to-r from-[#01A49E] via-teal-500 to-emerald-500 pt-8 pb-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
                <div className="max-w-5xl mx-auto relative">
                    <p className="text-teal-100 text-xs font-semibold mb-1 uppercase tracking-widest">My Account</p>
                    <h1 className="text-2xl font-black text-white">Profile</h1>
                </div>
            </div>

            {/* Main layout */}
            <div className="container-app mt-4 sm:mt-6 pb-12 sm:pb-16">
                <div className="flex flex-col lg:flex-row gap-5 items-start">

                    {/* Sidebar */}
                    <Sidebar />

                    {/* Content */}
                    <div className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 min-h-[420px]">
                        {renderContent()}
                    </div>

                </div>
            </div>
        </div>
    )
}
