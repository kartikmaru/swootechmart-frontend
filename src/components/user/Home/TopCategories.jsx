"use client";

import { FaLaptop, FaDesktop, FaHeadphones, FaTv } from "react-icons/fa";

const categories = [
    { name: "Laptops", icon: <FaLaptop size={28} /> },
    { name: "PC Gaming", icon: <FaDesktop size={28} /> },
    { name: "Headphones", icon: <FaHeadphones size={28} /> },
    { name: "Monitors", icon: <FaTv size={28} /> },
];

export function TopCategories() {
    return (
        <div className="bg-gray-100 rounded-2xl p-6 w-full">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                        TOP CATEGORIES
                    </h2>
                    <button className="text-sm text-gray-500 hover:text-black">
                        View All
                    </button>
                </div>

                {/* Right small dots */}
                <div className="flex gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
                </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-4 text-center gap-6">
                {categories.map((cat, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center gap-3 hover:scale-105 transition cursor-pointer"
                    >
                        <div className="text-gray-700">
                            {cat.icon}
                        </div>
                        <span className="text-sm text-gray-700 font-medium">
                            {cat.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}