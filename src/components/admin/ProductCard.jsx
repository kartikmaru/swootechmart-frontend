import React from 'react'

export default function ProductCard({name,image,desc,price}) {
    return (
                <div className="max-w-sm bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">

                    {/* Product Image */}
                    <div className="relative">
                        <img
                            src={image}
                            alt="Wireless Headphones"
                            className="w-full h-60 object-cover"
                        />
                        <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                            New
                        </span>
                    </div>

                    {/* Product Content */}
                    <div className="p-5">
                        <h2 className="text-lg font-semibold text-gray-800">
                           {name}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1 truncate">
                           {desc}
                        </p>

                        {/* Price */}
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-xl font-bold text-gray-900">${price}</span>
                        </div>

                        {/* Add to Cart Button */}
                        <button className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                            Add to Cart
                        </button>
                    </div>
                </div>
  )
}
