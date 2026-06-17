import React from 'react'

export default function PreOrderBanner() {
    return (
        <section className="w-full">
            <div className="relative bg-gradient-to-r from-[#01A49E] via-teal-500 to-slate-700 rounded-2xl overflow-hidden flex flex-col sm:flex-row items-center justify-between px-6 sm:px-8 py-5 gap-4">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="relative z-10 shrink-0 text-center sm:text-left">
                    <p className="text-xs text-teal-200 font-semibold uppercase tracking-widest mb-0.5">Pre Order</p>
                    <p className="text-white font-black text-lg leading-tight">Be the first<br />to get it</p>
                    <p className="text-teal-200 text-xs mt-1">From $299</p>
                </div>
                <div className="relative z-10 flex justify-center">
                    <img src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=280&h=140&fit=crop"
                        alt="Apple Watch" className="h-20 sm:h-28 object-contain drop-shadow-2xl" />
                </div>
                <div className="relative z-10 text-center flex-1 hidden sm:block">
                    <p className="text-white/70 text-xs mb-1">Apple Watch Sport Series 8</p>
                    <h3 className="text-white font-black text-xl sm:text-2xl leading-tight">A healthy leap ahead</h3>
                </div>
                <div className="relative z-10 shrink-0">
                    <button className="bg-white text-[#01A49E] font-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-teal-50 transition text-sm shadow-lg">
                        Discover Now
                    </button>
                </div>
            </div>
        </section>
    )
}
