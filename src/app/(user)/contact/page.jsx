'use client'

import { useState } from 'react'
import { FiMapPin, FiPhone, FiMail, FiClock, FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiSend, FiCheckCircle } from 'react-icons/fi'
import { client, notify } from '@/utils/Helper'

const infoCards = [
  { icon: FiMapPin, title: 'Our Address',    lines: ['123 Tech Park, MG Road', 'Bangalore, Karnataka â€” 560001', 'India'] },
  { icon: FiPhone,  title: 'Phone',          lines: ['+91 98765 43210  (24/7 Hotline)', '+91 80031 22456  (Sales)'] },
  { icon: FiMail,   title: 'Email',          lines: ['support@swootechmart.com', 'sales@swootechmart.com'] },
  { icon: FiClock,  title: 'Working Hours',  lines: ['Mon â€“ Sat: 9:00 AM â€“ 8:00 PM', 'Sunday: 10:00 AM â€“ 6:00 PM'] },
]

const socialLinks = [
  { icon: FiInstagram, label: 'Instagram', href: '#' },
  { icon: FiTwitter,   label: 'Twitter',   href: '#' },
  { icon: FiFacebook,  label: 'Facebook',  href: '#' },
  { icon: FiYoutube,   label: 'YouTube',   href: '#' },
]

const subjectOptions = ['General Inquiry', 'Order Support', 'Product Question', 'Return / Refund', 'Other']
const initialForm = { name: '', email: '', subject: '', message: '' }

export default function ContactPage() {
  const [form,    setForm]    = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      notify('Please fill in all required fields.', false)
      return
    }
    setLoading(true)
    try {
      const res = await client.post('contact/send', form)
      if (res.data.success) {
        setSent(true)
        setForm(initialForm)
        notify("Message sent! We'll get back to you soon ðŸŽ‰", true)
      } else {
        notify(res.data.message || 'Failed to send message.', false)
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to send message. Please try again.'
      notify(msg, false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6">

      {/* â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 py-20 px-6 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative">
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase backdrop-blur-sm">Contact Us</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">Get in Touch</h1>
          <p className="text-lg sm:text-xl text-teal-50 max-w-xl mx-auto">We're here to help â€” reach out anytime</p>
        </div>
      </section>

      <div className="container-app py-14 px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* LEFT â€” Contact info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
            {infoCards.map(({ icon: Icon, title, lines }) => (
              <div key={title} className="flex items-start gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
                <div className="shrink-0 w-11 h-11 bg-teal-50 rounded-xl flex items-center justify-center">
                  <Icon className="text-teal-600 text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1 text-sm">{title}</p>
                  {lines.map((line, i) => <p key={i} className="text-sm text-gray-500 leading-relaxed">{line}</p>)}
                </div>
              </div>
            ))}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <p className="font-semibold text-gray-800 mb-3 text-sm">Follow Us</p>
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, label, href }) => (
                  <a key={label} href={href} aria-label={label}
                    className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 hover:bg-teal-600 hover:text-white transition-colors duration-200 shadow-sm">
                    <Icon className="text-lg" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT â€” Contact form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>

            {/* Success state */}
            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <FiCheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Message Sent!</h3>
                <p className="text-sm text-gray-500 max-w-xs">Thanks for reaching out. We'll reply to your email within 24 hours.</p>
                <button onClick={() => setSent(false)} className="mt-2 text-sm text-teal-600 font-bold hover:underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input id="name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                  <input id="email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select id="subject" name="subject" value={form.subject} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition text-gray-700">
                    <option value="">Select a subjectâ€¦</option>
                    {subjectOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
                  <textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange} placeholder="Write your message hereâ€¦"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sendingâ€¦</>
                    : <><FiSend /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* â”€â”€ Map Placeholder */}
        <div className="mt-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-64 flex flex-col items-center justify-center gap-2 shadow-inner border border-gray-200">
          <span className="text-5xl">ðŸ“</span>
          <p className="text-gray-700 font-bold text-lg">SwooTechMart HQ â€” Bangalore, Karnataka</p>
          <p className="text-gray-400 text-sm">123 Tech Park, MG Road, 560001</p>
        </div>
      </div>
    </div>
  )
}

