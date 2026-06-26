'use client'
import { useState, useCallback } from 'react'
import { useAdminUser } from '@/components/admin/AdminGuard'
import { client, notify } from '@/utils/Helper'
import {
    FiUser, FiMail, FiShield, FiCalendar, FiEdit2,
    FiCheckCircle, FiX, FiSave, FiLock, FiEye, FiEyeOff, FiKey
} from 'react-icons/fi'

export const dynamic = 'force-dynamic'

// ── AdminPasswordField — module-level, never remounts ────────────────────────
function AdminPasswordField({ name, label, show, onToggleShow, value, onChange }) {
    return (
        <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">{label}</label>
            <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                    type={show ? 'text' : 'password'}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required
                    autoComplete="new-password"
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 focus:bg-white transition"
                    placeholder="••••••••"
                />
                <button type="button" onClick={onToggleShow}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                    {show ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
            </div>
        </div>
    )
}

// ── AdminSecurityForm — module-level, stable state ────────────────────────────
function AdminSecurityForm() {
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
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                    <FiKey size={15} className="text-orange-500" /> Change Password
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">Update your admin account password</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <AdminPasswordField
                        name="currentPassword" label="Current Password"
                        show={show.current} onToggleShow={() => setShow(s => ({ ...s, current: !s.current }))}
                        value={fields.currentPassword} onChange={handleChange}
                    />
                    <AdminPasswordField
                        name="newPassword" label="New Password (min 6 chars)"
                        show={show.newP} onToggleShow={() => setShow(s => ({ ...s, newP: !s.newP }))}
                        value={fields.newPassword} onChange={handleChange}
                    />
                    <AdminPasswordField
                        name="confirmPassword" label="Confirm New Password"
                        show={show.confirm} onToggleShow={() => setShow(s => ({ ...s, confirm: !s.confirm }))}
                        value={fields.confirmPassword} onChange={handleChange}
                    />
                    <button type="submit" disabled={saving}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl transition text-sm disabled:opacity-60 w-full justify-center">
                        {saving ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</> : <><FiCheckCircle size={14} /> Update Password</>}
                    </button>
                </form>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 max-w-sm">
                <FiShield size={15} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                    Admin passwords must be at least 6 characters. Use a strong unique password.
                </p>
            </div>
        </div>
    )
}

const TABS = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'security', label: 'Change Password', icon: FiLock },
]

export default function AdminProfilePage() {
    const adminUser = useAdminUser()
    const [activeTab, setActiveTab] = useState('profile')
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({ name: '', mobile: '' })

    if (!adminUser) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const initials = adminUser.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'A'
    const displayRole = adminUser.role === 'superAdmin' ? 'Super Admin' : 'Admin'
    const joinDate = adminUser.createdAt
        ? new Date(adminUser.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : '—'

    const handleEdit = () => { setForm({ name: adminUser.name || '', mobile: adminUser.mobile || '' }); setEditing(true) }

    const handleSave = async () => {
        if (!form.name.trim()) { notify('Name cannot be empty', false); return }
        setSaving(true)
        try {
            await client.put('User/update-profile', form)
            notify('Profile updated successfully', true)
            setEditing(false)
            window.location.reload()
        } catch (err) {
            notify(err?.response?.data?.msg || 'Failed to update', false)
        } finally { setSaving(false) }
    }

    // ── SecurityTab delegates to module-level AdminSecurityForm ─────────────
    const SecurityTab = () => <AdminSecurityForm />

    return (
        <div className="max-w-2xl mx-auto space-y-5">

            {/* ── Profile Header Card — NO overlap, clean layout ─────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Banner */}
                <div className="h-24 sm:h-28 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 relative">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                </div>

                <div className="px-4 sm:px-6 pt-0 pb-5">
                    {/* Avatar + buttons row - ✅ margin theek karo */}
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 -mt-8 sm:-mt-9 mb-4">
                        <div className="w-[60px] h-[60px] rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xl font-black shadow-lg border-4 border-white shrink-0">
                            {initials}
                        </div>
                        <div className="flex gap-2 pt-1">
                            {!editing ? (
                                <button onClick={handleEdit}
                                    className="flex items-center gap-1.5 text-sm font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 sm:px-4 py-2 rounded-xl transition border border-orange-200">
                                    <FiEdit2 size={13} /> Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button onClick={() => setEditing(false)}
                                        className="flex items-center gap-1.5 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition">
                                        <FiX size={13} /> Cancel
                                    </button>
                                    <button onClick={handleSave} disabled={saving}
                                        className="flex items-center gap-1.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 px-3 sm:px-4 py-2 rounded-xl transition disabled:opacity-60">
                                        {saving ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</> : <><FiSave size={13} /> Save</>}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Name / Edit form */}
                    {!editing ? (
                        <div>
                            <h2 className="text-lg sm:text-xl font-black text-gray-900">{adminUser.name}</h2>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
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
                        <div className="space-y-3 max-w-sm">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name</label>
                                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    className="w-full border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 focus:bg-white transition"
                                    placeholder="Full name" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-1">Mobile (optional)</label>
                                <input value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
                                    className="w-full border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 focus:bg-white transition"
                                    placeholder="10-digit mobile" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Tabs ─────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Tab strip */}
                <div className="flex border-b border-gray-100">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold border-b-2 transition shrink-0
                                ${activeTab === id ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                            <Icon size={14} /> <span className="hidden sm:inline">{label}</span><span className="sm:hidden">{id === 'profile' ? 'Info' : 'Password'}</span>
                        </button>
                    ))}
                </div>

                <div className="p-4 sm:p-5">
                    {activeTab === 'profile' && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-3">Account Details</h3>
                            {[
                                { icon: <FiMail size={15} />, label: 'Email Address', value: adminUser.email, color: 'bg-blue-50 text-blue-500' },
                                { icon: <FiShield size={15} />, label: 'Role', value: displayRole, color: 'bg-orange-50 text-orange-500' },
                                { icon: <FiUser size={15} />, label: 'Account Status', value: adminUser.isVerified ? 'Verified' : 'Unverified', color: adminUser.isVerified ? 'bg-green-50 text-green-500' : 'bg-yellow-50 text-yellow-500' },
                                { icon: <FiCalendar size={15} />, label: 'Member Since', value: joinDate, color: 'bg-purple-50 text-purple-500' },
                            ].map(({ icon, label, value, color }) => (
                                <div key={label} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${color}`}>{icon}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
                                        <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'security' && <SecurityTab />}
                </div>
            </div>
        </div>
    )
}
