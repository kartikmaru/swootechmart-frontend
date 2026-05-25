"use client";

import { FaSearch, FaChevronDown } from "react-icons/fa";

export default function SearchBar() {
    return (
        <div className="w-full bg-teal-600 rounded-xl px-4 py-3 flex items-center justify-between">

            {/* Left Section */}
            <div className="flex items-center gap-3 bg-white rounded-full px-3 py-2 w-[450px]">

                {/* Category Dropdown */}
                <div className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer whitespace-nowrap">
                    <span>All Categories</span>
                    <FaChevronDown size={12} />
                </div>

                {/* Divider */}
                <div className="h-5 w-px bg-gray-300"></div>

                {/* Search Input */}
                <div className="flex items-center flex-1">
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="w-full outline-none text-sm text-gray-600"
                    />
                    <FaSearch className="text-gray-500 ml-2" />
                </div>
            </div>

            {/* Right Section */}
            <div className="hidden md:flex items-center gap-10 text-white text-sm font-medium">
                <span>FREE SHIPPING OVER $199</span>
                <span>30 DAYS MONEY BACK</span>
                <span>100% SECURE PAYMENT</span>
            </div>

        </div>
    );
}