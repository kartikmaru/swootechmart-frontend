"use client";

import { FaPaperPlane } from "react-icons/fa";

export default function HeroNew() {
    return (
        <div className="w-full rounded-2xl overflow-hidden  relative">

            {/* Background Image */}
            <div
                className="h-[400px] rounded-2xl w-full bg-cover bg-center relative"
                style={{
                    backgroundImage:
                        "url('')",
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-center px-10 md:px-16 text-white">

                    {/* Heading */}
                    <h1 className="text-3xl md:text-5xl font-semibold leading-tight max-w-xl">
                        Don’t miss amazing grocery deals
                    </h1>

                    {/* Subtext */}
                    <p className="mt-4 text-lg text-gray-200">
                        Sign up for the daily newsletter
                    </p>

                    {/* Input + Button */}
                    <div className="mt-6 flex items-center bg-white/10 backdrop-blur-md border border-white/30 rounded-full overflow-hidden max-w-md">

                        {/* Icon */}
                        <div className="px-4 text-white">
                            <FaPaperPlane />
                        </div>

                        {/* Input */}
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="flex-1 bg-transparent outline-none text-white placeholder-gray-300 text-sm px-2 py-3"
                        />

                        {/* Button */}
                        <button className="bg-teal-500 hover:bg-teal-600 px-6 py-3 text-sm font-medium rounded-full mr-1 transition">
                            Subscribe
                        </button>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex items-center gap-2 mt-6">
                        <span className="w-3 h-3 rounded-full bg-teal-400"></span>
                        <span className="w-3 h-3 rounded-full border border-white/50"></span>
                    </div>
                </div>
            </div>
        </div>
    );
}