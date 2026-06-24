'use client'

import { IoCheckmarkCircle } from "react-icons/io5"
import { FiHeart, FiEye } from "react-icons/fi"
import AddToCart from "./AddToCart"
import Link from "next/link"

export default function ProductCard({ product, image }) {
  const savings = product.original_price - product.final_price

  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:border-[#01A49E]/30 hover:shadow-lg transition-all duration-300 group overflow-hidden flex flex-col">

      {/* ── Image ──────────────────────────────────────────────── */}
      <Link href={`/product/${product._id}`} className="relative bg-gray-50 p-4 block">

        {/* Discount badge */}
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 bg-[#01A49E] text-white text-[10px] font-black px-2 py-0.5 rounded-full z-10">
            -{product.discount}%
          </span>
        )}

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10 lg:opacity-0 lg:group-hover:opacity-100 opacity-100 transition-all duration-200 lg:translate-x-2 lg:group-hover:translate-x-0">
          <button className="w-8 h-8 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition border border-gray-100">
            <FiHeart size={14} />
          </button>
          {/* Quick-view button — outer Link already wraps the whole image section,
              so we use a plain button here to avoid nested <a> tags */}
          <button
            onClick={(e) => { e.preventDefault(); window.location.href = `/product/${product._id}` }}
            className="w-8 h-8 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-400 hover:text-[#01A49E] hover:bg-teal-50 transition border border-gray-100"
          >
            <FiEye size={14} />
          </button>
        </div>

        {/* Product image */}
        <div className="aspect-square flex items-center justify-center overflow-hidden">
          <img
            src={image}
            alt={product.name}
            className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-400"
          />
        </div>
      </Link>

      {/* ── Info ───────────────────────────────────────────────── */}
      <div className="p-3.5 flex flex-col flex-1 gap-2">

        {/* Category pill */}
        {product.category_Id?.name && (
          <span className="text-[10px] font-semibold text-[#01A49E] bg-teal-50 px-2 py-0.5 rounded-full w-fit">
            {product.category_Id.name}
          </span>
        )}

        {/* Name */}
        <h3 className="text-xs font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-[#01A49E] transition-colors">
          {product.name}
        </h3>

        {/* Price row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-base font-black text-gray-900">
            ₹{product.final_price?.toLocaleString('en-IN')}
          </span>
          {product.original_price > product.final_price && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.original_price?.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Savings */}
        {savings > 0 && (
          <p className="text-[10px] text-green-600 font-semibold">
            You save ₹{savings.toLocaleString('en-IN')}
          </p>
        )}

        {/* Stock */}
        <div className="flex items-center gap-1.5 text-[10px] font-semibold mt-auto">
          <IoCheckmarkCircle
            className={product.stock ? 'text-green-500' : 'text-red-400'}
            size={13}
          />
          <span className={product.stock ? 'text-green-600' : 'text-red-400'}>
            {product.stock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Add to cart */}
        <AddToCart product={product} image={image} />
      </div>
    </div>
  )
}
