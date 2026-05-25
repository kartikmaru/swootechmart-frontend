"use client";

const brands = [
    "Jamx",
    "Digitek",
    "React",
    "Grafbase",
    "MSI",
    "Ohbear",
    "Oak",
    "Snyk",
    "Sonex",
    "Stropi",
];

export function FeaturedBrands() {
    return (
        <div className="bg-gray-100 rounded-2xl p-6 w-full">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                    FEATURED BRANDS
                </h2>
                <button className="text-sm text-gray-500 hover:text-black">
                    View All
                </button>
            </div>

            {/* Brands Grid */}
            <div className="grid grid-cols-5 gap-6 items-center">
                {brands.map((brand, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-center text-gray-700 font-semibold text-sm hover:scale-105 transition"
                    >
                        {brand}
                    </div>
                ))}
            </div>
        </div>
    );
}