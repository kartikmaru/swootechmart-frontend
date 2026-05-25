"use client";

export function ShopHero() {
    return (
        <div className="w-full bg-gray-100 rounded-xl p-5 mt-4">

            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                TOP CELL PHONES & TABLETS
            </h2>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Left Banner */}
                <div className="relative rounded-xl overflow-hidden h-[220px] bg-gray-300">

                    <img
                        src="https://images.unsplash.com/photo-1580894908361-967195033215"
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/30"></div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-center px-6 text-white">
                        <h3 className="text-xl font-semibold">
                            Noise Cancelling
                        </h3>
                        <p className="text-lg">Headphone</p>

                        <p className="text-xs mt-2 text-gray-200 max-w-xs">
                            Boso Over-Ear Headphone Wifi, Voice Assistant,
                            Low Latency Game Mode
                        </p>

                        <button className="mt-4 bg-white text-black text-xs px-4 py-2 rounded-full w-fit">
                            BUY NOW
                        </button>
                    </div>

                    {/* Slider Count */}
                    <div className="absolute bottom-3 right-3 bg-white/80 text-xs px-3 py-1 rounded-full">
                        3 / 3
                    </div>
                </div>

                {/* Right Banner */}
                <div className="relative rounded-xl overflow-hidden h-[220px] bg-gray-200">

                    <img
                        src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf"
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-white/60"></div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-center px-6 text-gray-900">

                        <h3 className="text-lg font-semibold">
                            redmi note 12
                        </h3>

                        <p className="text-xl font-bold">
                            Pro+ 5g
                        </p>

                        <p className="text-xs text-gray-600 mt-1">
                            Rise to the challenge
                        </p>

                        <button className="mt-4 bg-black text-white text-xs px-4 py-2 rounded-full w-fit">
                            SHOP NOW
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}