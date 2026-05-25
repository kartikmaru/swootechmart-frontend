"use client";

import Link from "next/link";

export function BreadcrumbBar() {
    return (
        <div className="w-full bg-gray-100 rounded-xl px-6 py-3 text-sm text-gray-600">

            <div className="flex items-center gap-2">
                <Link href="/" className="hover:text-black">
                    Home
                </Link>

                <span>/</span>

                <Link href="/shop" className="hover:text-black">
                    Shop
                </Link>

                <span>/</span>

                <span className="text-gray-800 font-medium">
                    Top Cell Phones & Tablets
                </span>
            </div>

        </div>
    );
}