'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { client, notify } from '@/utils/Helper';
import {
    FiMail, FiMapPin, FiPlus, FiTrash2,
    FiShoppingBag, FiHome, FiCheckCircle, FiX,
    FiPackage, FiUser, FiPhone, FiChevronRight,
    FiSettings, FiShield, FiGrid, FiBell, FiRefreshCw,
    FiAlertTriangle, FiCreditCard, FiEye, FiEyeOff, FiLock
} from 'react-icons/fi';
import Link from 'next/link';

// ── AddressForm — top-level stable component ──────────────────────────────────
function AddressForm({ onSave, loading }) {
    const emptyForm = { fullName: '', mobile: '', pincode: '', addressLine: '', city: '', state: '' }
    const [form, setForm] = useState(emptyForm)
    const handleChange = useCallback((e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }, [])
    const handleSubmit = async (e) => {
        e.preventDefault()
        await onSave(form)
        setForm(emptyForm)
    }
    return (
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 sm:p-5">
            <h4 className="text-sm font-bold text-teal-700 mb-4 flex items-center gap-2">
                <FiHome size={14} /> New Delivery Address
            </h4>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[{ name: 'fullName', label: 'Full Name', placeholder: 'Enter full name' },
                    { name: 'mobile', label: 'Mobile', placeholder: '10-digit number' }].map(f => (
                        <div key={f.name}>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">{f.label}</label>
                            <input name={f.name} value={form[f.name]} onChange={handleChange}
                                type="text" placeholder={f.placeholder} required autoComplete="off"
                                className="w-full bg-white border border-gray-200 px-3.5 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-teal-400 text-sm" />
                        </div>
                    ))}
                </div>
                <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Address Line</label>
                    <textarea name="addressLine" value={form.addressLine} onChange={handleChange}
                        rows={2} placeholder="House no., street, area..." required
                        className="w-full bg-white border border-gray-200 px-3.5 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-teal-400 text-sm resize-none" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[{ name: 'city', placeholder: 'City' }, { name: 'state', placeholder: 'State' }, { name: 'pincode', placeholder: 'Pincode' }].map(f => (
                        <div key={f.name}>
                            <label className="text-xs font-semibold text-gray-600 block mb-1 capitalize">{f.name}</label>
                            <input name={f.name} value={form[f.name]} onChange={handleChange}
                                type="text" placeholder={f.placeholder} required autoComplete="off"
                                className="w-full bg-white border border-gray-200 px-3 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-teal-400 text-sm" />
                        </div>
                    ))}
                </div>
                <button type="submit" disabled={loading}
                    className="flex items-center gap-2 bg-[#01A49E] hover:bg-[#01857f] text-white font-bold px-5 py-2.5 rounded-xl transition text-sm disabled:opacity-60">
                    {loading ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</> : <><FiCheckCircle size={14} /> Save Address</>}
                </button>
            </form>
        </div>
    )
}

// ── PasswordField — module-level stable component ────────────────────────────
function PasswordField({ name, label, show, onToggleShow, value, onChange }) {
    return (
        <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">{label}</label>
            <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                    type={show ? 'text' : 'password'}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required
                    autoComplete="new-password"
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-400 bg-gray-50 focus:bg-white transition"
                    placeholder="••••••••"
                />
                <button type="button" onClick={onToggleShow}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                    {show ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
            </div>
        </div>
    )
}

// ── SecurityForm — module-level stable component ──────────────────────────────
function SecurityForm() {
    const [fields, setFields] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
    const [show, setShow] = useState({ current: false, newP: false, confirm: false })
    const [saving, setSaving] = useState(false)

    const handleChange = useCallback((e) => {
        const { name, value } = e.target
        setFields(prev => ({ ...prev, [name]: value }))
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (fields.newPassword.length < 6) { notify('New password must be at least 6 characters', false); return }
        if (fields.newPassword !== fields.confirmPassword) { notify('Passwords do not match', false); return }
        setSaving(true)
        try {
            await client.patch('User/change-password', {
                currentPassword: fields.currentPassword,
                newPassword: fields.newPassword,
                confirmPassword: fields.confirmPassword,
            })
            notify('Password changed successfully ✓', true)
            setFields({ currentPassword: '', newPassword: '', confirmPassword: '' })
        } catch (err) {
            notify(err?.response?.data?.msg || 'Failed to change password', false)
        } finally { setSaving(false) }
    }

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-lg sm:text-xl font-black text-gray-900">Security</h2>
                <p className="text-sm text-gray-500 mt-0.5">Change your password to keep your account secure</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-black text-gray-700 mb-4 flex items-center gap-2">
                    <FiLock size={15} className="text-teal-500" /> Change Password
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
                    <PasswordField
                        name="currentPassword" label="Current Password"
                        show={show.current}
                        onToggleShow={() => setShow(s => ({ ...s, current: !s.current }))}
                        value={fields.currentPassword} onChange={handleChange}
                    />
                    <PasswordField
                        name="newPassword" label="New Password (min 6 chars)"
                        show={show.newP}
                        onToggleShow={() => setShow(s => ({ ...s, newP: !s.newP }))}
                        value={fields.newPassword} onChange={handleChange}
                    />
                    <PasswordField
                        name="confirmPassword" label="Confirm New Password"
                        show={show.confirm}
                        onToggleShow={() => setShow(s => ({ ...s, confirm: !s.confirm }))}
                        value={fields.confirmPassword} onChange={handleChange}
                    />
                    <button type="submit" disabled={saving}
                        className="flex items-center gap-2 bg-[#01A49E] hover:bg-[#01857f] text-white font-bold px-5 py-2.5 rounded-xl transition text-sm disabled:opacity-60">
                        {saving ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</> : <><FiCheckCircle size={14} /> Update Password</>}
                    </button>
                </form>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <FiShield size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                    Use a strong unique password. Never share your credentials with anyone.
                </p>
            </div>
        </div>
    )
}

// ✅ NAV_ITEMS — TOP LEVEL PAR (yahi bug tha - pehle missing tha)
const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
    { id: 'orders', label: 'My Orders', icon: FiPackage },
    { id: 'addresses', label: 'Addresses', icon: FiMapPin },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'settings', label: 'Settings', icon: FiSettings },
]

export default function Profile({ user }) {
    const router = useRouter()

    const [activeTab, setActiveTab] = useState('dashboard')
    const [addresses, setAddresses] = useState(user?.addresses || [])
    const [showForm, setShowForm] = useState(false)
    const [deleteIndex, setDeleteIndex] = useState(null)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [orderStats, setOrderStats] = useState({ totalOrders: 0, totalSpent: 0 })
    const [statsLoading, setStatsLoading] = useState(true)
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        orderUpdates: true,
        promotionalOffers: false,
    })

    const initial = user?.name?.charAt(0)?.toUpperCase() || 'U'

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await client.get('order/stats')
                if (res.data.success) setOrderStats(res.data.data)
            } catch (_) { }
            finally { setStatsLoading(false) }
        }
        fetchStats()
    }, [])

    const handleDelete = async (index) => {
        setDeleteIndex(index)
        try {
            await client.put('User/deleteaddress', { index })
            setAddresses(prev => prev.filter((_, i) => i !== index))
            notify('Address removed', true)
        } catch { notify('Failed to delete', false) }
        finally { setDeleteIndex(null) }
    }

    const toggleNotification = (key) => {
        setNotifications(prev => {
            const updated = { ...prev, [key]: !prev[key] }
            const labels = { emailNotifications: 'Email Notifications', orderUpdates: 'Order Updates', promotionalOffers: 'Promotional Offers' }
            notify(`${labels[key]} ${updated[key] ? 'enabled' : 'disabled'}`, true)
            return updated
        })
    }

    // ── Sidebar ───────────────────────────────────────────────────────────────
    const Sidebar = () => (
        <aside className="w-full lg:w-60 xl:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-br from-[#01A49E] to-emerald-500 px-5 py-5 text-center relative">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                    <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-white/25 border-2 border-white/50 flex items-center justify-center text-xl font-black text-white mx-auto mb-2.5 shadow-md">
                            {initial}
                        </div>
                        <p className="font-black text-sm text-white capitalize leading-tight truncate px-1">{user?.name || 'User'}</p>
                        <p className="text-white/70 text-xs mt-0.5 truncate px-1">{user?.email}</p>
                        {user?.isVerified && (
                            <div className="inline-flex items-center gap-1 bg-white/20 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full mt-2 border border-white/30">
                                <span className="w-1.5 h-1.5 bg-green-300 rounded-full" />
                                Verified
                            </div>
                        )}
                    </div>
                </div>

                {/* Desktop nav */}
                <nav className="hidden lg:block p-2 space-y-0.5">
                    {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => setActiveTab(id)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition group
                                ${activeTab === id ? 'bg-teal-50 text-[#01A49E]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                            <div className="flex items-center gap-2.5">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition
                                    ${activeTab === id ? 'bg-[#01A49E] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-teal-50 group-hover:text-[#01A49E]'}`}>
                                    <Icon size={14} />
                                </div>
                                {label}
                            </div>
                            <div className="flex items-center gap-1">
                                {id === 'orders' && (
                                    <span className="bg-[#01A49E] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                                        {statsLoading ? '-' : orderStats.totalOrders}
                                    </span>
                                )}
                                <FiChevronRight size={12} className={`transition-transform ${activeTab === id ? 'rotate-90 text-[#01A49E]' : 'text-gray-300'}`} />
                            </div>
                        </button>
                    ))}
                </nav>

                {/* Mobile nav */}
                <div className="lg:hidden flex overflow-x-auto scrollbar-hide border-t border-gray-100">
                    {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => setActiveTab(id)}
                            className={`flex flex-col items-center gap-1 px-4 py-3 shrink-0 border-b-2 transition
                                ${activeTab === id ? 'border-[#01A49E] text-[#01A49E] bg-teal-50/50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                            <Icon size={16} />
                            <span className="text-[10px] font-bold whitespace-nowrap">{label}</span>
                        </button>
                    ))}
                </div>

                {/* Member since */}
                <div className="hidden lg:block mx-2 mb-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide">Member Since</p>
                    <p className="text-xs font-bold text-gray-700 mt-0.5">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—'}
                    </p>
                </div>
            </div>
        </aside>
    )

    // ── Dashboard ─────────────────────────────────────────────────────────────
    const DashboardContent = () => (
        <div className="space-y-5">
            <div>
                <h2 className="text-lg sm:text-xl font-black text-gray-900">Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
                <p className="text-sm text-gray-500 mt-0.5">Here's a summary of your account</p>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                    { label: 'Saved Addresses', value: addresses.length, icon: <FiMapPin size={16} />, color: 'bg-teal-50 text-[#01A49E]', action: () => setActiveTab('addresses') },
                    { label: 'Total Orders', value: statsLoading ? '—' : orderStats.totalOrders, icon: <FiPackage size={16} />, color: 'bg-orange-50 text-orange-500', action: () => setActiveTab('orders') },
                    { label: 'Total Spent', value: statsLoading ? '—' : `₹${Number(orderStats.totalSpent).toLocaleString('en-IN')}`, icon: <FiUser size={16} />, color: 'bg-purple-50 text-purple-500', action: null },
                ].map(stat => (
                    <button key={stat.label} onClick={stat.action || undefined}
                        className={`bg-white border border-gray-100 rounded-2xl p-4 text-left transition
                            ${stat.action ? 'hover:border-teal-200 hover:shadow-sm cursor-pointer' : 'cursor-default'}`}>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${stat.color}`}>{stat.icon}</div>
                        <p className="text-xl sm:text-2xl font-black text-gray-800">{stat.value}</p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">{stat.label}</p>
                    </button>
                ))}
            </div>
            <div>
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2.5">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link href="/store" className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-3.5 hover:border-teal-200 hover:shadow-sm transition group">
                        <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-400 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition shrink-0">
                            <FiShoppingBag size={15} />
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-gray-800 text-sm truncate">Continue Shopping</p>
                            <p className="text-xs text-gray-400">Explore latest products</p>
                        </div>
                        <FiChevronRight size={13} className="ml-auto text-gray-300 group-hover:text-teal-500 transition shrink-0" />
                    </Link>
                    <button onClick={() => setActiveTab('orders')}
                        className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-3.5 hover:border-teal-200 hover:shadow-sm transition group text-left">
                        <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#01A49E] flex items-center justify-center group-hover:bg-[#01A49E] group-hover:text-white transition shrink-0">
                            <FiPackage size={15} />
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-gray-800 text-sm">My Orders</p>
                            <p className="text-xs text-gray-400">Track your orders</p>
                        </div>
                        <FiChevronRight size={13} className="ml-auto text-gray-300 group-hover:text-teal-500 transition shrink-0" />
                    </button>
                </div>
            </div>
        </div>
    )

    const SecurityContent = () => <SecurityForm />

    // ── Settings ──────────────────────────────────────────────────────────────
    const SettingsContent = () => {
        const toggleItems = [
            { key: 'emailNotifications', icon: FiMail, label: 'Email Notifications', desc: 'Receive account and order emails' },
            { key: 'orderUpdates', icon: FiPackage, label: 'Order Updates', desc: 'Get notified on order status changes' },
            { key: 'promotionalOffers', icon: FiBell, label: 'Promotional Offers', desc: 'Deals, discounts and new arrivals' },
        ]
        return (
            <div className="space-y-4">
                <div>
                    <h2 className="text-lg sm:text-xl font-black text-gray-900">Settings</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manage your notification preferences</p>
                </div>
                <div className="space-y-2.5">
                    {toggleItems.map(({ key, icon: Icon, label, desc }) => (
                        <div key={key} className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3.5 gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition ${notifications[key] ? 'bg-teal-50 text-[#01A49E]' : 'bg-gray-100 text-gray-400'}`}>
                                    <Icon size={14} />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-gray-800 text-sm truncate">{label}</p>
                                    <p className="text-xs text-gray-400 hidden sm:block">{desc}</p>
                                </div>
                            </div>
                            <button onClick={() => toggleNotification(key)} type="button" role="switch" aria-checked={notifications[key]}
                                className={`relative inline-flex w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none shrink-0 ${notifications[key] ? 'bg-[#01A49E]' : 'bg-gray-200'}`}>
                                <span className={`inline-block w-3.5 h-3.5 bg-white rounded-full shadow transform transition-transform duration-200 mt-[3px] ${notifications[key] ? 'translate-x-[22px]' : 'translate-x-[3px]'}`} />
                            </button>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-gray-400">ℹ️ Settings are saved locally in this session.</p>
            </div>
        )
    }

    // ── Addresses ─────────────────────────────────────────────────────────────
    const AddressesContent = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg sm:text-xl font-black text-gray-900">Delivery Addresses</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}</p>
                </div>
                <button onClick={() => setShowForm(p => !p)}
                    className={`flex items-center gap-1.5 text-sm font-bold px-3 sm:px-4 py-2 rounded-xl transition shrink-0
                        ${showForm ? 'bg-gray-100 text-gray-600' : 'bg-[#01A49E] hover:bg-[#01857f] text-white shadow-sm'}`}>
                    {showForm ? <><FiX size={13} /> Cancel</> : <><FiPlus size={13} /> Add New</>}
                </button>
            </div>
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
                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">
                    <div className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                        <FiMapPin size={20} className="text-gray-300" />
                    </div>
                    <p className="text-gray-600 font-semibold text-sm">No saved addresses</p>
                    <button onClick={() => setShowForm(true)} className="mt-2.5 text-sm text-teal-600 font-bold hover:underline">+ Add first address</button>
                </div>
            )}
            <div className="space-y-3">
                {addresses.map((addr, index) => (
                    <div key={addr._id || index} className="flex items-start gap-3 bg-white border border-gray-100 hover:border-teal-200 rounded-2xl p-3.5 sm:p-4 transition">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-teal-50 text-[#01A49E] flex items-center justify-center text-xs sm:text-sm font-black shrink-0">{index + 1}</div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                <h4 className="font-bold text-gray-800 text-sm">{addr.fullName}</h4>
                                {index === 0 && <span className="text-[10px] bg-[#01A49E] text-white font-semibold px-2 py-0.5 rounded-full">Default</span>}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{addr.addressLine}, {addr.city}, {addr.state} — {addr.pincode}</p>
                            <span className="inline-flex items-center gap-1 text-xs text-gray-400 mt-1"><FiPhone size={10} /> {addr.mobile}</span>
                        </div>
                        <button onClick={() => handleDelete(index)} disabled={deleteIndex === index}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-40 shrink-0">
                            {deleteIndex === index ? <div className="w-3 h-3 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" /> : <FiTrash2 size={13} />}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )

    // ── Orders ────────────────────────────────────────────────────────────────
    const OrderDetailModal = ({ orderId, imageBaseUrl: listBaseUrl, onClose }) => {
        const [order, setOrder] = useState(null)
        const [imgBase, setImgBase] = useState(listBaseUrl || '')
        const [loading, setLoading] = useState(true)
        const [error, setError] = useState(null)
        useEffect(() => {
            client.get(`order/${orderId}`).then(res => {
                setOrder(res.data.data)
                setImgBase(res.data.meta?.imageBaseUrl || listBaseUrl || '')
            }).catch(err => setError(err?.response?.data?.msg || 'Failed to load')).finally(() => setLoading(false))
        }, [orderId])
        const S = { placed: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', shipped: 'bg-purple-100 text-purple-700', out_for_delivery: 'bg-indigo-100 text-indigo-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' }
        const P = { pending: 'text-yellow-600', paid: 'text-green-600', failed: 'text-red-500', refund_pending: 'text-orange-500', refunded: 'text-teal-600' }
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-gray-100 shrink-0">
                        <div>
                            <h2 className="font-black text-gray-900 text-base">Order Details</h2>
                            {order && <p className="text-xs text-gray-400 font-mono mt-0.5">#{order._id.slice(-10).toUpperCase()}</p>}
                        </div>
                        <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition"><FiX size={15} /></button>
                    </div>
                    <div className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-4">
                        {loading && <div className="space-y-3 animate-pulse">{[40, 28, 70, 70].map((h, i) => <div key={i} className="bg-gray-100 rounded-xl" style={{ height: h }} />)}</div>}
                        {!loading && error && <div className="text-center py-8"><FiAlertTriangle size={26} className="text-red-400 mx-auto mb-2" /><p className="text-sm font-semibold text-red-600">{error}</p></div>}
                        {!loading && order && (
                            <>
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize ${S[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>{order.orderStatus.replace(/_/g, ' ')}</span>
                                    <div className="text-right"><p className="text-[10px] text-gray-400 font-semibold uppercase">Order Date</p><p className="text-xs font-semibold text-gray-700">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
                                </div>
                                <div className="space-y-2">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                                            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                                {item.product_id?.thumbnail ? <img src={imgBase + item.product_id.thumbnail} alt="" className="w-full h-full object-contain p-1" /> : <FiPackage size={13} className="text-gray-300" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-800 truncate">{item.product_id?.name || 'Product'}</p>
                                                <p className="text-xs text-gray-400">₹{item.price?.toLocaleString('en-IN')} × {item.qty}</p>
                                            </div>
                                            <span className="text-sm font-black text-gray-800 shrink-0">₹{item.total?.toLocaleString('en-IN')}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-teal-50 border border-teal-100 rounded-xl px-4 py-3 flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-700">Order Total</span>
                                    <span className="text-base font-black text-[#01A49E]">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white border border-gray-100 rounded-xl p-3 space-y-1.5">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wide flex items-center gap-1"><FiCreditCard size={9} /> Payment</p>
                                        <div className="flex justify-between text-xs"><span className="text-gray-500">Method</span><span className="font-bold text-gray-800 uppercase">{order.paymentMethod}</span></div>
                                        <div className="flex justify-between text-xs"><span className="text-gray-500">Status</span><span className={`font-bold capitalize ${P[order.paymentStatus] || 'text-gray-600'}`}>{order.paymentStatus === 'refund_pending' ? 'Refund Pending' : order.paymentStatus}</span></div>
                                    </div>
                                    <div className="bg-white border border-gray-100 rounded-xl p-3">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wide flex items-center gap-1 mb-1.5"><FiMapPin size={9} /> Address</p>
                                        <p className="font-bold text-gray-800 text-xs">{order.shippingAddress?.fullName}</p>
                                        <p className="text-[11px] text-gray-500 mt-0.5">{order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}</p>
                                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><FiPhone size={9} /> {order.shippingAddress?.mobile}</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    const OrdersContent = () => {
        const [orders, setOrders] = useState([])
        const [imageBaseUrl, setImageBaseUrl] = useState('')
        const [ordLoading, setOrdLoading] = useState(true)
        const [ordError, setOrdError] = useState(null)
        const [selectedId, setSelectedId] = useState(null)
        const [cancelId, setCancelId] = useState(null)
        const [cancelling, setCancelling] = useState(false)
        const loadOrders = async () => {
            setOrdLoading(true); setOrdError(null)
            try { const res = await client.get('order/my-orders'); setOrders(res.data.data || []); setImageBaseUrl(res.data.meta?.imageBaseUrl || '') }
            catch (err) { setOrdError(err?.response?.data?.msg || 'Failed to load orders.') }
            finally { setOrdLoading(false) }
        }
        useEffect(() => { loadOrders() }, [])
        const handleCancelConfirm = async () => {
            if (!cancelId) return; setCancelling(true)
            try {
                const res = await client.patch(`order/cancel/${cancelId}`)
                if (res.data.success) { setOrders(prev => prev.map(o => o._id === cancelId ? { ...o, orderStatus: res.data.data.orderStatus, paymentStatus: res.data.data.paymentStatus } : o)); notify('Order cancelled', true) }
                else notify(res.data.msg || 'Could not cancel', false)
            } catch (err) { notify(err?.response?.data?.msg || 'Cancel failed', false) }
            finally { setCancelling(false); setCancelId(null) }
        }
        const SC = { placed: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', shipped: 'bg-purple-100 text-purple-700', out_for_delivery: 'bg-indigo-100 text-indigo-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' }
        return (
            <>
                {selectedId && <OrderDetailModal orderId={selectedId} imageBaseUrl={imageBaseUrl} onClose={() => setSelectedId(null)} />}
                {cancelId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => !cancelling && setCancelId(null)}>
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5" onClick={e => e.stopPropagation()}>
                            <div className="w-11 h-11 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-3"><FiAlertTriangle size={20} className="text-red-500" /></div>
                            <h3 className="text-base font-black text-gray-900 text-center mb-1">Cancel Order?</h3>
                            <p className="text-sm text-gray-500 text-center mb-4">This <span className="font-semibold text-gray-700">cannot be undone</span>.</p>
                            <div className="flex gap-2.5">
                                <button onClick={() => setCancelId(null)} disabled={cancelling} className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition text-sm disabled:opacity-50">Keep</button>
                                <button onClick={handleCancelConfirm} disabled={cancelling} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                                    {cancelling ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Cancelling…</> : 'Yes, Cancel'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg sm:text-xl font-black text-gray-900">My Orders</h2>
                        <button onClick={loadOrders} disabled={ordLoading} className="flex items-center gap-1.5 text-xs text-teal-600 font-bold hover:underline disabled:opacity-50">
                            <FiRefreshCw size={11} className={ordLoading ? 'animate-spin' : ''} /> Refresh
                        </button>
                    </div>
                    {ordLoading && <div className="space-y-3">{[1, 2].map(i => <div key={i} className="bg-gray-50 rounded-2xl animate-pulse h-20" />)}</div>}
                    {!ordLoading && ordError && <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center"><FiAlertTriangle size={20} className="text-red-400 mx-auto mb-1" /><p className="text-red-600 text-sm font-semibold">{ordError}</p></div>}
                    {!ordLoading && !ordError && orders.length === 0 && (
                        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">
                            <FiPackage size={28} className="text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-600 font-semibold text-sm">No orders yet</p>
                            <Link href="/store" className="mt-2 inline-block text-sm text-teal-600 font-bold hover:underline">Start Shopping →</Link>
                        </div>
                    )}
                    {!ordLoading && orders.map(order => (
                        <div key={order._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-sm transition">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3.5 sm:px-4 py-3 bg-gray-50/70 border-b border-gray-100">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <div><p className="text-[9px] text-gray-400 font-bold uppercase">Order ID</p><p className="text-xs font-black text-gray-700 font-mono">#{order._id.slice(-8).toUpperCase()}</p></div>
                                    <div><p className="text-[9px] text-gray-400 font-bold uppercase">Date</p><p className="text-xs font-semibold text-gray-700">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${SC[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>{order.orderStatus.replace(/_/g, ' ')}</span>
                                    <span className="text-sm font-black text-gray-900">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                            <div className="px-3.5 sm:px-4 py-2.5 flex gap-2 flex-wrap">
                                {order.items.slice(0, 3).map((item, i) => (
                                    <div key={i} className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-2 py-1.5 border border-gray-100 text-xs">
                                        <div className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                            {item.product_id?.thumbnail ? <img src={imageBaseUrl + item.product_id.thumbnail} alt="" className="w-full h-full object-contain" /> : <FiPackage size={10} className="text-gray-300" />}
                                        </div>
                                        <span className="font-semibold text-gray-800 max-w-[70px] truncate">{item.product_id?.name || 'Product'}</span>
                                    </div>
                                ))}
                                {order.items.length > 3 && <div className="flex items-center bg-gray-50 rounded-xl px-2 py-1.5 border border-gray-100"><span className="text-xs text-gray-500 font-semibold">+{order.items.length - 3}</span></div>}
                            </div>
                            <div className="px-3.5 sm:px-4 pb-3 flex items-center gap-3">
                                <button onClick={() => setSelectedId(order._id)} className="flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-800 transition">
                                    <FiEye size={11} /> View
                                </button>
                                {order.orderStatus === 'placed' && (
                                    <button onClick={() => setCancelId(order._id)} className="ml-auto flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg border border-red-100 transition">
                                        <FiX size={10} /> Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardContent />
            case 'orders': return <OrdersContent />
            case 'addresses': return <AddressesContent />
            case 'security': return <SecurityContent />
            case 'settings': return <SettingsContent />
            default: return <DashboardContent />
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6">

            {/* Hero */}
            <div className="bg-gradient-to-r from-[#01A49E] via-teal-500 to-emerald-500 pt-6 sm:pt-8 pb-20 sm:pb-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
                <div className="max-w-5xl mx-auto relative">
                    <p className="text-teal-100 text-xs font-semibold mb-1 uppercase tracking-widest">My Account</p>
                    <h1 className="text-xl sm:text-2xl font-black text-white">Profile</h1>
                </div>
            </div>

            {/* Main layout */}
            <div className="container-app mt-4 sm:mt-6 pb-12 sm:pb-16">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 items-start">
                    <Sidebar />
                    <div className="flex-1 min-w-0 w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 lg:p-6 min-h-[380px]">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    )
}