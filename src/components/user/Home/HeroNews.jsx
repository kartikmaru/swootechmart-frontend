"use client";

import { FaPaperPlane } from "react-icons/fa";

export default function HeroNews() {
  return (
    <div className="w-full rounded-2xl overflow-hidden relative">
      {/* Background Image */}
      <div
        className="h-[220px] sm:h-[300px] md:h-[360px] w-full rounded-2xl bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/hero/images.jpg')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 md:px-14 text-white">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-semibold leading-tight max-w-xs sm:max-w-md">
            Don&apos;t miss amazing grocery deals
          </h1>
          <p className="mt-2 sm:mt-4 text-sm sm:text-base text-gray-200">
            Sign up for the daily newsletter
          </p>
          <div className="mt-4 sm:mt-6 flex items-center bg-white/10 backdrop-blur-md border border-white/30 rounded-full overflow-hidden max-w-xs sm:max-w-md">
            <div className="px-3 sm:px-4">
              <FaPaperPlane size={13} />
            </div>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-300 text-xs sm:text-sm px-2 py-2.5 sm:py-3"
            />
            <button className="bg-teal-500 hover:bg-teal-600 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium rounded-full mr-1 transition">
              Subscribe
            </button>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-6">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
            <span className="w-2.5 h-2.5 rounded-full border border-white/50" />
          </div>
        </div>
      </div>
    </div>
  );
}