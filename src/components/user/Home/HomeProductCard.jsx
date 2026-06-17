'use client'

import { useDispatch, useSelector } from 'react-redux'
import { notify } from '@/utils/Helper'
import { addToCartWithSync, changeQtyWithSync } from '@/utils/cartHelper'
import { FiTruck, FiShoppingCart, FiPlus, FiMinus, FiHeart } from 'react-icons/fi'
import { IoCheckmarkCircle } from 'react-icons/io5'
import Link from 'next/link'
import { useState } from 'react'

export default function HomeProductCard({ product, imageBaseUrl }) {

    const dispatch  = useDispatch()
    const cartItems = useSelector(s => s.cart.items)
    const cartItem  = cartItems.find(i => i.id === product._id || i.id === product.id)
    const [wished, setWished] = useState(false)

    const image   = imageBaseUrl + (product.thumbnail || '')
    const id      = product._id || product.id
    const savings = (product.original_price || 0) - (product.final_price || 0)

    const handleAdd = async () => {
        await addToCartWithSync(dispatch, {
            id,
            name:           product.name,
            final_price:    product.final_price,
            original_price: product.original_price,
            discount:       product.discount,
            stock:          product.stock,
            thumbnail:      image,
            qty:            1,
        })
        notify(`${product.name} added to cart`, true)
    }

    return (
        <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col">

            {/* ── Image ─────────────────────────────────────────── */}
            <div className="relative mb-3">

                {/* Wishlist */}
                <button
                    onClick={() => setWished(w => !w)}
                    className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white shadow-md hover:bg-red-50 transition flex items-center justify-center"
                >
                    <FiHeart className={wished ? 'text-red-500 fill-red-500' : 'text-gray-400'} size={14} />
                </button>

                {/* Discount badge */}
                {product.discount > 0 && (
                    <span className="absolute top-2 left-2 z-10 bg-[#01A49E] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        -{product.discount}%
                    </span>
                )}

                {/* Image — click pe detail page */}
                <Link href={`/product/${id}`}>
                    <div className="aspect-square flex items-center justify-center overflow-hidden rounded-xl bg-gray-50 p-3">
                        <img
                            src={image}
                            alt={product.name}
                            className="object-contain h-full w-full group-hover:scale-110 transition-transform duration-300"
                        />
                    </div>
                </Link>
            </div>

            {/* ── Name ─────────────────────────────────────────── */}
            <Link href={`/product/${id}`}>
                <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-2 line-clamp-2 group-hover:text-[#01A49E] transition-colors">
                    {product.name}
                </h3>
            </Link>

            {/* ── Price ─────────────────────────────────────────── */}
            <div className="mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-bold text-black">
                        ₹{product.final_price?.toLocaleString('en-IN')}
                    </span>
                    {product.original_price > product.final_price && (
                        <span className="text-sm text-gray-400 line-through">
                            ₹{product.original_price?.toLocaleString('en-IN')}
                        </span>
                    )}
                    {savings > 0 && (
                        <span className="bg-red-100 text-red-600 text-[10px] font-semibold px-2 py-0.5 rounded">
                            {product.discount}% OFF
                        </span>
                    )}
                </div>
            </div>

            {/* ── Shipping tag ──────────────────────────────────── */}
            <div className="flex gap-2 mb-2 flex-wrap">
                <span className="bg-cyan-50 text-cyan-600 text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                    <FiTruck size={9} /> FREE SHIPPING
                </span>
            </div>

            {/* ── Stock ─────────────────────────────────────────── */}
            <div className="flex items-center gap-1.5 mb-3 text-xs font-medium">
                <IoCheckmarkCircle
                    className={product.stock ? 'text-green-500' : 'text-red-400'}
                    size={14}
                />
                <span className={product.stock ? 'text-green-600' : 'text-red-400'}>
                    {product.stock ? 'In Stock' : 'Out of Stock'}
                </span>
            </div>

            {/* ── Cart Button ───────────────────────────────────── */}
            <div className="mt-auto">
                {cartItem ? (
                    <div className="flex items-center justify-between w-full border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => changeQtyWithSync(dispatch, { id, flag: 'dec' }, cartItems)}
                            className="w-10 h-9 flex items-center justify-center text-red-500 hover:bg-red-50 transition text-lg font-semibold"
                        >
                            <FiMinus size={13} />
                        </button>
                        <span className="flex-1 text-center text-sm font-semibold text-gray-800 bg-gray-50 h-9 flex items-center justify-center">
                            {cartItem.qty}
                        </span>
                        <button
                            onClick={() => changeQtyWithSync(dispatch, { id, flag: 'inc' }, cartItems)}
                            className="w-10 h-9 flex items-center justify-center text-white bg-black hover:bg-gray-800 transition text-lg font-semibold"
                        >
                            <FiPlus size={13} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleAdd}
                        disabled={!product.stock}
                        className="w-full flex items-center justify-center gap-1.5 bg-black text-white text-xs font-medium py-2 rounded-lg hover:bg-gray-900 transition disabled:bg-gray-200 disabled:cursor-not-allowed"
                    >
                        <FiShoppingCart size={13} />
                        Add to Cart
                    </button>
                )}
            </div>
        </div>
    )
}
