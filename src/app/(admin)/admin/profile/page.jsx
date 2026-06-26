'use client'
// Admin Profile Page — shows real admin user details from backend
// Accessible only to admin/superAdmin roles (enforced by AdminGuard in layout)

import { useState } from 'react'
import { useAdminUser } from '@/components/admin/AdminGuard'
import { client, notify } from '@/utils/Helper'
import {
    FiUser, FiMail, FiShield, FiCalendar,
    FiEdit2, FiCheckCircle, FiX, FiSave
} from 'react-icons/fi'

export const dynamic = 'force-dynamic'

export default function AdminProfilePage() {
    const adminUser  = useAdminUser()
    const [editing,  setEditing]  = useState(false)
    const [saving,   setSaving]   = useState(false)
    const [form,     setForm]     = useState({ name: '', mobile: '' })

    if (!adminUser) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const initials    = adminUser.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'A'
    const displayRole = adminUser.role === 'superAdmin' ? 'Super Admin' : 'Admin'
    const joinDate    = adminUser.createdAt
        ? new Date(adminUser.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : '—'

    const handleEdit = () => {
        setForm({ name: adminUser.name || '', mobile: adminUser.mobile || '' })
        setEditing(true)
    }

    const handleSave = async () => {
        if (!form.name.trim()) { notify('Name cannot be empty', false); return }
        setSaving(true)
        try {
            await client.put('User/update-profile', form)
            notify('Profile updated successfully', true)
            setEditing(false)
            // Refresh the page so AdminGuard re-fetches updated user data
            window.location.reload()
        } catch (err) {
            notify(err?.response?.data?.msg || 'Failed to update profile', false)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">

            {/* ── Profile Card ──────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Banner */}
                <div className="h-24 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 relative">
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                </div>

                {/* Avatar overlapping banner */}
                <div className="px-6 pb-6">
                    <div className="flex items-end justify-between -mt-10 mb-4">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-black shadow-lg border-4 border-white">
                            {initials}
                        </div>
                        {!editing ? (
                            <button onClick={handleEdit}
                                className="flex items-center gap-2 text-sm font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-xl transition border border-orange-200">
                                <FiEdit2 size={14} /> Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={() => setEditing(false)}
                                    className="flex items-center gap-1.5 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition">
                                    <FiX size={14} /> Cancel
                                </button>
                                <button onClick={handleSave} disabled={saving}
                                    className="flex items-center gap-1.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl transition disabled:opacity-60">
                                    {saving
                                        ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                                        : <><FiSave size={14} /> Save</>}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Name + Role */}
                    {!editing ? (
                        <div>
                            <h2 className="text-xl font-black text-gray-900">{adminUser.name}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
                                    <FiShield size={11} /> {displayRole}
                                </span>
                                {adminUser.isVerified && (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full border border-green-200">
                                        <FiCheckCircle size={11} /> Verified
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3 mt-1">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name</label>
                                <input
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    className="w-full border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 focus:bg-white transition"
                                    placeholder="Full name"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-1">Mobile (optional)</label>
                                <input
                                    value={form.mobile}
                                    onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
                                    className="w-full border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 focus:bg-white transition"
                                    placeholder="10-digit mobile"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Details Card ──────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-4">Account Details</h3>
                <div className="space-y-4">
                    {[
                        { icon: <FiMail size={16} />,     label: 'Email Address',  value: adminUser.email,     color: 'bg-blue-50 text-blue-500' },
                        { icon: <FiShield size={16} />,   label: 'Role',           value: displayRole,         color: 'bg-orange-50 text-orange-500' },
                        { icon: <FiUser size={16} />,     label: 'Account Status', value: adminUser.isVerified ? 'Verified' : 'Unverified', color: adminUser.isVerified ? 'bg-green-50 text-green-500' : 'bg-yellow-50 text-yellow-500' },
                        { icon: <FiCalendar size={16} />, label: 'Member Since',   value: joinDate,             color: 'bg-purple-50 text-purple-500' },
                    ].map(({ icon, label, value, color }) => (
                        <div key={label} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                                {icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
                                <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Security Note ─────────────────────────────────────────── */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <FiShield size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-bold text-amber-800">Security Note</p>
                    <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
                        To change your password, please contact the Super Admin or use the account recovery flow.
                        Never share your admin credentials with anyone.
                    </p>
                </div>
            </div>

        </div>
    )
}
