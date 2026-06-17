import React from 'react'

export default function PromoBanners() {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Banner 1 — Teal */}
            <div className="relative bg-gradient-to-r from-[#01A49E] to-emerald-400 rounded-2xl overflow-hidden flex items-center justify-between px-5 sm:px-6 py-5 min-h-[120px] sm:min-h-[140px]">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                <div className="relative z-10">
                    <p className="text-teal-100 text-xs font-semibold uppercase tracking-wider mb-1">Massage Chair</p>
                    <h3 className="text-white font-black text-lg sm:text-xl leading-tight mb-0.5">Luxury</h3>
                    <p className="text-teal-100 text-xs mb-3 hidden sm:block">Total Body Full Body<br />Massage Chair</p>
                    <button className="bg-white text-[#01A49E] font-black text-xs px-4 py-2 rounded-full hover:bg-teal-50 transition shadow">
                        Shop Now
                    </button>
                </div>
                <img
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=180&h=130&fit=crop"
                    alt="Massage Chair"
                    className="relative z-10 h-20 sm:h-28 object-contain drop-shadow-xl"
                />
            </div>

            {/* Banner 2 — Dark */}
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-between px-5 sm:px-6 py-5 min-h-[120px] sm:min-h-[140px]">
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                <div className="relative z-10">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">New Arrival</p>
                    <h3 className="text-white font-black text-lg sm:text-xl leading-tight mb-0.5">Smart Speaker</h3>
                    <p className="text-gray-400 text-xs mb-3 hidden sm:block">Premium sound quality<br />for your home</p>
                    <button className="bg-[#01A49E] text-white font-black text-xs px-4 py-2 rounded-full hover:bg-teal-500 transition shadow">
                        Explore Now
                    </button>
                </div>
                <img
                    src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=180&h=130&fit=crop"
                    alt="Speaker"
                    className="relative z-10 h-20 sm:h-28 object-contain drop-shadow-xl opacity-90"
                />
            </div>

        </section>
    )
}
