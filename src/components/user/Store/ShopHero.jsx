"use client"

export function ShopHero() {
    return (
        <div className="w-full rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-auto sm:h-52">

                {/* Left — Dark */}
                <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
                    <img
                        src="https://images.unsplash.com/photo-1580894908361-967195033215?w=700&h=400&fit=crop"
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20" />
                    <div className="relative z-10 h-full flex flex-col justify-center px-7 text-white">
                        <span className="text-xs font-semibold text-teal-300 uppercase tracking-widest mb-2">Featured</span>
                        <h3 className="text-2xl font-black leading-tight mb-1">Noise Cancelling<br />Headphone</h3>
                        <p className="text-xs text-gray-300 mb-4 max-w-[180px]">Premium audio experience with AI-powered ANC</p>
                        <button className="bg-[#01A49E] hover:bg-[#01857f] text-white text-xs font-bold px-5 py-2 rounded-full w-fit transition shadow-lg">
                            Shop Now
                        </button>
                    </div>
                </div>

                {/* Right — Light */}
                <div className="relative rounded-2xl overflow-hidden group cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-100">
                    <img
                        src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=700&h=400&fit=crop"
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="relative z-10 h-full flex flex-col justify-center px-7">
                        <span className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-2">New Launch</span>
                        <h3 className="text-2xl font-black text-gray-900 leading-tight mb-1">Redmi Note 12<br /><span className="text-blue-600">Pro+ 5G</span></h3>
                        <p className="text-xs text-gray-500 mb-4">Rise to the challenge — 200MP camera</p>
                        <button className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-5 py-2 rounded-full w-fit transition shadow-md">
                            Explore
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
