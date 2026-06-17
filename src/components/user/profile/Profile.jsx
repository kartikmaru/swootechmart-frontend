'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { client, notify } from '@/utils/Helper';
import {
    FiMail, FiPhone, FiMapPin, FiPlus, FiTrash2,
    FiLogOut, FiShoppingBag, FiHome, FiCheckCircle,
    FiX, FiPackage, FiUser
} from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';
import Link from 'next/link';

export default function Profile({ user }) {

    const router = useRouter();
    const [addresses, setAddresses] = useState(user?.addresses || []);
    const [showForm, setShowForm] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    const emptyForm = { fullName: '', mobile: '', pincode: '', addressLine: '', city: '', state: '' };
    const [form, setForm] = useState(emptyForm);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    // ── Logout ──────────────────────────────────────────────────────────────
    const handleLogout = async () => {
        setLogoutLoading(true);
        try {
            await client.post('User/logout');
            notify('Logged out successfully', true);
            router.push('/login');
        } catch {
            notify('Logout failed', false);
        } finally {
            setLogoutLoading(false);
        }
    };

    // ── Delete Address ───────────────────────────────────────────────────────
    const handleDelete = async (index) => {
        setDeleteIndex(index);
        try {
            await client.put('User/deleteaddress', { index });
            setAddresses(prev => prev.filter((_, i) => i !== index));
            notify('Address removed', true);
        } catch {
            notify('Failed to delete', false);
        } finally {
            setDeleteIndex(null);
        }
    };

    // ── Add Address ──────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            const res = await client.post('User/addaddresses', form);
            setAddresses(res.data.data);
            setForm(emptyForm);
            setShowForm(false);
            notify('Address added!', true);
        } catch {
            notify('Failed to add address', false);
        } finally {
            setSubmitLoading(false);
        }
    };

    const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Hero Banner ─────────────────────────────────────────────── */}
            <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 pt-10 pb-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="max-w-4xl mx-auto relative">
                    <p className="text-teal-100 text-sm font-medium mb-1">My Account</p>
                    <h1 className="text-3xl font-black text-white">Profile</h1>
                </div>
            </div>

            {/* ── Main Content ─────────────────────────────────────────────── */}
            <div className="max-w-4xl mx-auto px-4 -mt-10 sm:-mt-12 pb-12 sm:pb-16 space-y-5">

                {/* ── User Card ─────────────────────────────────────────────── */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">

                        {/* Left — Avatar + Info */}
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-2xl font-black shadow-md shrink-0">
                                {initial}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-black text-gray-900 capitalize">
                                        {user?.name || 'User'}
                                    </h2>
                                    {user?.isVerified && (
                                        <MdVerified className="text-teal-500" size={18} title="Verified Account" />
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                    <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                        <FiMail size={13} className="text-teal-400" />
                                        {user?.email || '—'}
                                    </span>
                                    {user?.mobile && (
                                        <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                            <FiPhone size={13} className="text-teal-400" />
                                            {user.mobile}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${user?.isVerified ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                        {user?.isVerified ? '✓ Verified' : '⚠ Unverified'}
                                    </span>
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-100 text-teal-600 capitalize">
                                        {user?.role || 'user'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right — Logout */}
                        <button
                            onClick={handleLogout}
                            disabled={logoutLoading}
                            className="flex items-center gap-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border border-red-200 hover:border-red-500 px-5 py-2.5 rounded-xl text-sm font-bold transition disabled:opacity-50 group"
                        >
                            <FiLogOut size={15} className="group-hover:rotate-12 transition-transform" />
                            {logoutLoading ? 'Signing out...' : 'Logout'}
                        </button>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5 pt-5 border-t border-gray-100">
                        {[
                            { label: 'Addresses', value: addresses.length, icon: <FiMapPin size={16} />, color: 'text-teal-500 bg-teal-50' },
                            { label: 'Orders', value: '0', icon: <FiPackage size={16} />, color: 'text-orange-500 bg-orange-50' },
                            { label: 'Member', value: user?.createdAt ? new Date(user.createdAt).getFullYear() : '—', icon: <FiUser size={16} />, color: 'text-purple-500 bg-purple-50' },
                        ].map((stat) => (
                            <div key={stat.label} className="flex flex-col items-center py-3 rounded-2xl bg-gray-50">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1.5 ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <span className="text-xl font-black text-gray-800">{stat.value}</span>
                                <span className="text-xs text-gray-400 font-medium">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Addresses Section ──────────────────────────────────────── */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4">
                        <div>
                            <h3 className="font-black text-gray-800 text-base">Delivery Addresses</h3>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowForm(p => !p)}
                            className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition
                                ${showForm
                                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    : 'bg-teal-500 hover:bg-teal-600 text-white shadow-sm'}`}
                        >
                            {showForm ? <><FiX size={14} /> Cancel</> : <><FiPlus size={14} /> Add New</>}
                        </button>
                    </div>

                    {/* Add Form */}
                    {showForm && (
                        <div className="mx-4 mb-4 bg-teal-50 border border-teal-100 rounded-2xl p-5">
                            <h4 className="text-sm font-bold text-teal-700 mb-4 flex items-center gap-2">
                                <FiHome size={14} /> New Delivery Address
                            </h4>
                            <form onSubmit={handleSubmit} className="space-y-3">

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        { name: 'fullName', label: 'Full Name', placeholder: 'Enter full name', type: 'text' },
                                        { name: 'mobile', label: 'Mobile Number', placeholder: '10-digit mobile', type: 'text' },
                                    ].map(f => (
                                        <div key={f.name}>
                                            <label className="text-xs font-semibold text-gray-600 block mb-1">{f.label}</label>
                                            <input name={f.name} value={form[f.name]} onChange={handleChange}
                                                type={f.type} placeholder={f.placeholder} required
                                                className="w-full bg-white border border-gray-200 px-3.5 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-teal-400 text-sm transition" />
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Address Line</label>
                                    <textarea name="addressLine" value={form.addressLine} onChange={handleChange}
                                        rows={2} placeholder="House no., street, area, landmark..." required
                                        className="w-full bg-white border border-gray-200 px-3.5 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-teal-400 text-sm transition resize-none" />
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                                    {[
                                        { name: 'city', placeholder: 'City' },
                                        { name: 'state', placeholder: 'State' },
                                        { name: 'pincode', placeholder: 'Pincode' },
                                    ].map(f => (
                                        <div key={f.name}>
                                            <label className="text-xs font-semibold text-gray-600 block mb-1 capitalize">{f.name}</label>
                                            <input name={f.name} value={form[f.name]} onChange={handleChange}
                                                type="text" placeholder={f.placeholder} required
                                                className="w-full bg-white border border-gray-200 px-3.5 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-teal-400 text-sm transition" />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3 pt-1">
                                    <button type="submit" disabled={submitLoading}
                                        className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-bold px-5 py-2.5 rounded-xl transition text-sm disabled:opacity-60 shadow-sm">
                                        {submitLoading
                                            ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                                            : <><FiCheckCircle size={14} /> Save Address</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Address List */}
                    <div className="px-4 pb-4 space-y-3">

                        {/* Empty State */}
                        {addresses.length === 0 && !showForm && (
                            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                                    <FiMapPin size={24} className="text-gray-300" />
                                </div>
                                <p className="text-gray-600 font-semibold text-sm">No saved addresses</p>
                                <p className="text-xs text-gray-400 mt-1">Add your delivery address to get started</p>
                                <button onClick={() => setShowForm(true)}
                                    className="mt-4 text-sm text-teal-600 font-bold hover:underline">
                                    + Add your first address
                                </button>
                            </div>
                        )}

                        {addresses.map((addr, index) => (
                            <div key={addr._id || index}
                                className="flex items-start gap-4 bg-gray-50 hover:bg-teal-50 border border-gray-100 hover:border-teal-200 rounded-2xl p-4 transition group">

                                {/* Number badge */}
                                <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 group-hover:bg-teal-500 group-hover:border-teal-500 group-hover:text-white flex items-center justify-center text-sm font-black text-gray-400 transition shrink-0 shadow-sm">
                                    {index + 1}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h4 className="font-bold text-gray-800 text-sm">{addr.fullName}</h4>
                                        {index === 0 && (
                                            <span className="text-xs bg-teal-500 text-white font-semibold px-2 py-0.5 rounded-full">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {addr.addressLine}, {addr.city}, {addr.state} — {addr.pincode}
                                    </p>
                                    <span className="inline-flex items-center gap-1 text-xs text-gray-400 mt-1.5">
                                        <FiPhone size={10} /> {addr.mobile}
                                    </span>
                                </div>

                                {/* Delete */}
                                <button onClick={() => handleDelete(index)} disabled={deleteIndex === index}
                                    className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition border border-transparent hover:border-red-100 disabled:opacity-40 shrink-0">
                                    {deleteIndex === index
                                        ? <div className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                                        : <FiTrash2 size={15} />}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Quick Actions ──────────────────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href="/store"
                        className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 hover:border-teal-200 hover:shadow-sm transition group">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-400 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition shrink-0">
                            <FiShoppingBag size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">Continue Shopping</p>
                            <p className="text-xs text-gray-400 mt-0.5">Explore our latest products</p>
                        </div>
                    </Link>

                    <button onClick={handleLogout} disabled={logoutLoading}
                        className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 hover:border-red-200 hover:shadow-sm transition group w-full text-left disabled:opacity-60">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-400 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition shrink-0">
                            <FiLogOut size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">
                                {logoutLoading ? 'Signing out...' : 'Sign Out'}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">See you next time!</p>
                        </div>
                    </button>
                </div>

            </div>
        </div>
    );
}
