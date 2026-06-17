'use client'
// 🧠 LOGIC:
// 'use client' isliye — yahan user interaction hai:
//   • selectedImg state  → thumbnail click pe main image badlegi
//   • qty state          → +/- buttons se quantity change hogi
//   • wished state       → wishlist toggle
//   • tab state          → Description/Reviews tabs
// Server component me ye sab possible nahi hota

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { qtyChange, addRecentlyViewed } from '@/redux/features/CartSlice'
import { addToCartWithSync, changeQtyWithSync } from '@/utils/cartHelper'
import { notify } from '@/utils/Helper'
import Link from 'next/link'
import {
    FiShoppingCart, FiHeart, FiShare2, FiTruck,
    FiShield, FiRefreshCw, FiPhone, FiChevronRight, FiMinus, FiPlus
} from 'react-icons/fi'
import { IoCheckmarkCircle, IoStarSharp } from 'react-icons/io5'
import { MdCancel } from 'react-icons/md'
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'

export default function ProductDetailClient({ product, imageBaseUrl, thumbBaseUrl }) {

    // ── State ──────────────────────────────────────────────────────────────────
    //
    // selectedImg → kaun si image main box me dikhe
    //   default: 0 (pehli image — thumbnail)
    //   jab thumbnail click hoti hai → setSelectedImg(index) se change hota hai
    const [selectedImg, setSelectedImg] = useState(0)

    // qty → user kitne items add karna chahta hai
    //   + button → qty++ (stock tak)
    //   - button → qty-- (1 se kam nahi hoga)
    const [qty, setQty] = useState(1)

    // wished → wishlist me hai ya nahi (toggle)
    const [wished, setWished] = useState(false)

    // activeTab → Description ya Reviews tab
    const [activeTab, setActiveTab] = useState('description')

    // ── Redux ──────────────────────────────────────────────────────────────────
    const dispatch  = useDispatch()
    const cartItems = useSelector(s => s.cart.items)

    // Cart me ye product pehle se hai ya nahi
    // Array.find() → id match hone wala item return karta hai, warna undefined
    const cartItem  = cartItems.find(i => i.id === product._id)

    // Product page open hone pe recently viewed me add karo
    useEffect(() => {
        dispatch(addRecentlyViewed({
            id:             product._id,
            name:           product.name,
            final_price:    product.final_price,
            original_price: product.original_price,
            discount:       product.discount,
            thumbnail:      thumbBaseUrl + product.thumbnail,
        }))
    }, [product._id])
    const allImages = [
        { src: thumbBaseUrl + product.thumbnail, label: 'Main' },
        ...(product.images || []).map((img, i) => ({
            src: imageBaseUrl + img,
            label: `View ${i + 1}`
        }))
    ]

    // ── Add to Cart ────────────────────────────────────────────────────────────
    // dispatch(addtocart(...)) → Redux store me product add hota hai
    // Redux store update hone pe → Header me cart count update hota hai
    const handleAddToCart = async () => {
        await addToCartWithSync(dispatch, {
            id:             product._id,
            name:           product.name,
            final_price:    product.final_price,
            original_price: product.original_price,
            discount:       product.discount,
            stock:          product.stock,
            thumbnail:      thumbBaseUrl + product.thumbnail,
            qty,
        })
        notify(`${product.name} added to cart`, true)
    }

    // ── Savings calculation ────────────────────────────────────────────────────
    const savings = product.original_price - product.final_price

    return (
        <div className="py-6 space-y-8">

            {/* ── Breadcrumb ──────────────────────────────────────────────── */}
            <nav className="flex items-center gap-1.5 text-xs text-gray-400">
                <Link href="/" className="hover:text-[#01A49E] transition">Home</Link>
                <FiChevronRight size={11} />
                <Link href="/store" className="hover:text-[#01A49E] transition">Store</Link>
                {product.category_Id?.name && (
                    <>
                        <FiChevronRight size={11} />
                        <Link href={`/store/${product.category_Id?.slug || ''}`}
                            className="hover:text-[#01A49E] transition">
                            {product.category_Id.name}
                        </Link>
                    </>
                )}
                <FiChevronRight size={11} />
                <span className="text-gray-700 font-medium line-clamp-1">{product.name}</span>
            </nav>

            {/* ── Main Product Section ─────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_320px] gap-8 items-start">

                {/* ── Left: Image Gallery ─────────────────────────────────── */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 w-full lg:w-auto shrink-0">

                    {/* Thumbnail strip (horizontal on mobile, vertical on sm+) */}
                    <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 w-full sm:w-16 shrink-0">
                        {allImages.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedImg(i)}
                                // 🧠 onClick → setSelectedImg(i) → selectedImg = i
                                // → neeche main image me allImages[selectedImg] dikhega
                                className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0
                                    ${selectedImg === i
                                        ? 'border-[#01A49E] shadow-md scale-105'
                                        : 'border-gray-200 hover:border-[#01A49E]/50 opacity-70 hover:opacity-100'}`}
                            >
                                <img src={img.src} alt={img.label} className="w-full h-full object-contain p-1 bg-gray-50" />
                            </button>
                        ))}
                    </div>

                    {/* Main image box */}
                    {/* key={selectedImg} → image change hone pe smooth re-render */}
                    <div className="w-full max-w-[400px] aspect-square bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center overflow-hidden relative mx-auto sm:mx-0">
                        {product.discount > 0 && (
                            <span className="absolute top-3 left-3 bg-[#01A49E] text-white text-xs font-black px-2.5 py-1 rounded-full z-10">
                                -{product.discount}% OFF
                            </span>
                        )}
                        <img
                            key={selectedImg}
                            src={allImages[selectedImg]?.src}
                            alt={product.name}
                            className="w-full h-full object-contain p-6 transition-opacity duration-300"
                        />
                    </div>
                </div>

                {/* ── Center: Product Info ─────────────────────────────────── */}
                <div className="space-y-4 min-w-0">

                    {/* SKU + Name */}
                    <div>
                        <p className="text-xs text-gray-400 mb-1">SKU: {product._id?.slice(-8).toUpperCase()}</p>
                        <h1 className="text-xl font-black text-gray-900 leading-snug">{product.name}</h1>
                    </div>

                    {/* Rating (dummy) */}
                    <div className="flex items-center gap-2">
                        <div className="flex">
                            {[1,2,3,4,5].map(s => (
                                <IoStarSharp key={s} className={s <= 4 ? 'text-yellow-400' : 'text-gray-200'} size={16} />
                            ))}
                        </div>
                        <span className="text-xs text-gray-400 font-medium">(24 reviews)</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="text-3xl font-black text-gray-900">
                            ₹{product.final_price?.toLocaleString('en-IN')}
                        </span>
                        {savings > 0 && (
                            <>
                                <span className="text-lg text-gray-400 line-through font-medium">
                                    ₹{product.original_price?.toLocaleString('en-IN')}
                                </span>
                                <span className="bg-green-100 text-green-700 text-xs font-black px-2.5 py-1 rounded-full">
                                    Save ₹{savings.toLocaleString('en-IN')}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Short description */}
                    {product.short_description && (
                        <p className="text-sm text-gray-600 leading-relaxed border-l-2 border-[#01A49E] pl-3">
                            {product.short_description}
                        </p>
                    )}

                    {/* Badges */}
                    <div className="flex gap-2 flex-wrap">
                        <span className="flex items-center gap-1.5 bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-teal-100">
                            <FiTruck size={12} /> Free Shipping
                        </span>
                        <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100">
                            <FiShield size={12} /> 1 Year Warranty
                        </span>
                        <span className="flex items-center gap-1.5 bg-orange-50 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-orange-100">
                            <FiRefreshCw size={12} /> Easy Returns
                        </span>
                    </div>

                    {/* Colors */}
                    {product.color_Id?.length > 0 && (
                        <div>
                            <p className="text-xs font-black text-gray-600 uppercase tracking-wide mb-2">
                                Colors Available
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {product.color_Id.map((color, i) => (
                                    <div key={i} className="flex flex-col items-center gap-1">
                                        <div
                                            className="w-7 h-7 rounded-full border-2 border-white shadow-md ring-1 ring-gray-200"
                                            style={{ backgroundColor: color.color_code }}
                                            title={color.name}
                                        />
                                        <span className="text-[9px] text-gray-500">{color.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Meta info */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm border-t border-gray-100 pt-3">
                        <div className="flex gap-2">
                            <span className="text-gray-400 font-medium">SKU:</span>
                            <span className="font-semibold text-gray-700">{product._id?.slice(-8).toUpperCase()}</span>
                        </div>
                        {product.category_Id?.name && (
                            <div className="flex gap-2">
                                <span className="text-gray-400 font-medium">Category:</span>
                                <span className="font-semibold text-gray-700">{product.category_Id.name}</span>
                            </div>
                        )}
                        {product.brand_Id?.name && (
                            <div className="flex gap-2">
                                <span className="text-gray-400 font-medium">Brand:</span>
                                <span className="font-semibold text-[#01A49E]">{product.brand_Id.name}</span>
                            </div>
                        )}
                        <div className="flex gap-2">
                            <span className="text-gray-400 font-medium">Status:</span>
                            <span className={`font-semibold flex items-center gap-1 ${product.stock ? 'text-green-600' : 'text-red-500'}`}>
                                {product.stock
                                    ? <><IoCheckmarkCircle size={14} /> In Stock</>
                                    : <><MdCancel size={14} /> Out of Stock</>
                                }
                            </span>
                        </div>
                    </div>

                    {/* Social share */}
                    <div className="flex items-center gap-3 pt-1">
                        <span className="text-xs text-gray-400 font-medium">Share:</span>
                        {[
                            { icon: <FaTwitter size={14} />,   color: 'hover:text-sky-500' },
                            { icon: <FaFacebook size={14} />,  color: 'hover:text-blue-600' },
                            { icon: <FaInstagram size={14} />, color: 'hover:text-pink-500' },
                            { icon: <FaYoutube size={14} />,   color: 'hover:text-red-500' },
                        ].map((s, i) => (
                            <button key={i} className={`w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 transition ${s.color}`}>
                                {s.icon}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Right: Purchase Box ──────────────────────────────────── */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm lg:sticky lg:top-24 w-full">

                    {/* Total price */}
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Total Price</p>
                        <p className="text-3xl font-black text-gray-900">
                            ₹{(product.final_price * qty)?.toLocaleString('en-IN')}
                        </p>
                        {/* 🧠 total price = final_price × qty
                            qty state change hone pe ye automatically update hota hai */}
                        <p className="text-xs text-green-600 font-semibold mt-0.5">
                            {product.stock
                                ? <span className="flex items-center gap-1"><IoCheckmarkCircle size={13} /> In Stock — Ships from India</span>
                                : <span className="text-red-400">Currently unavailable</span>
                            }
                        </p>
                    </div>

                    {/* Quantity selector */}
                    {/* 🧠 qty state:
                        + click → qty badho (stock se zyada nahi)
                        - click → qty ghato (1 se kam nahi)
                        Total price automatically update hota hai kyunki
                        final_price * qty → qty change = price change */}
                    {!cartItem ? (
                        <div>
                            <p className="text-xs text-gray-500 font-semibold mb-2">Quantity</p>
                            <div className="flex items-center gap-0 bg-white border border-gray-200 rounded-xl overflow-hidden w-fit">
                                <button
                                    onClick={() => setQty(q => Math.max(1, q - 1))}
                                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-red-500 transition"
                                >
                                    <FiMinus size={14} />
                                </button>
                                <span className="w-12 text-center font-black text-gray-800 text-sm">{qty}</span>
                                <button
                                    onClick={() => setQty(q => q + 1)}
                                    className="w-10 h-10 flex items-center justify-center bg-gray-900 text-white hover:bg-[#01A49E] transition"
                                >
                                    <FiPlus size={14} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Cart me already hai toh qty change controls */
                        <div>
                            <p className="text-xs text-gray-500 font-semibold mb-2">In Cart</p>
                            <div className="flex items-center gap-0 bg-white border border-gray-200 rounded-xl overflow-hidden w-fit">
                                <button
                                    onClick={() => changeQtyWithSync(dispatch, { id: product._id, flag: 'dec' }, cartItems)}
                                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition"
                                >
                                    <FiMinus size={14} />
                                </button>
                                <span className="w-12 text-center font-black text-[#01A49E] text-sm">{cartItem.qty}</span>
                                <button
                                    onClick={() => changeQtyWithSync(dispatch, { id: product._id, flag: 'inc' }, cartItems)}
                                    className="w-10 h-10 flex items-center justify-center bg-gray-900 text-white hover:bg-[#01A49E] transition"
                                >
                                    <FiPlus size={14} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Add to Cart button */}
                    {!cartItem ? (
                        <button
                            onClick={handleAddToCart}
                            disabled={!product.stock}
                            className="w-full flex items-center justify-center gap-2 bg-[#01A49E] hover:bg-[#01857f] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black py-3.5 rounded-xl transition shadow-sm text-sm"
                        >
                            <FiShoppingCart size={16} />
                            Add to Cart
                        </button>
                    ) : (
                        <Link href="/cart"
                            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-black py-3.5 rounded-xl transition shadow-sm text-sm">
                            <FiShoppingCart size={16} />
                            Go to Cart ({cartItem.qty} items)
                        </Link>
                    )}

                    {/* Wishlist + Compare */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => { setWished(w => !w); notify(wished ? 'Removed from wishlist' : 'Added to wishlist', true) }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition
                                ${wished
                                    ? 'bg-red-50 border-red-200 text-red-500'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-500'}`}
                        >
                            <FiHeart size={13} fill={wished ? 'currentColor' : 'none'} />
                            {wished ? 'Wishlisted' : 'Wishlist'}
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:border-[#01A49E] hover:text-[#01A49E] transition">
                            <FiShare2 size={13} />
                            Share
                        </button>
                    </div>

                    {/* Trust badges */}
                    <div className="border-t border-gray-200 pt-3 space-y-2">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Guaranteed Safe Checkout</p>
                        <div className="flex gap-2 flex-wrap">
                            {['VISA', 'MC', 'UPI', 'GPay', 'PayPal'].map(b => (
                                <span key={b} className="bg-white border border-gray-200 text-gray-500 text-[9px] font-black px-2 py-1 rounded">
                                    {b}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Quick order */}
                    <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                        <p className="text-[10px] text-gray-400 font-semibold">Quick Order 24/7</p>
                        <p className="flex items-center justify-center gap-1.5 font-black text-gray-800 mt-1">
                            <FiPhone size={14} className="text-[#01A49E]" />
                            (025) 3886 25 16
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Description / Reviews Tabs ──────────────────────────────── */}
            {/* 🧠 Tab logic:
                activeTab state = 'description' ya 'reviews'
                Tab click → setActiveTab change
                Neeche content activeTab === '...' check se conditionally dikhta hai */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Tab headers */}
                <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-none whitespace-nowrap">
                    {[
                        { id: 'description', label: 'Description' },
                        { id: 'reviews',     label: 'Reviews (24)' },
                        { id: 'shipping',    label: 'Shipping & Returns' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 sm:px-6 py-3.5 sm:py-4 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0
                                ${activeTab === tab.id
                                    ? 'border-[#01A49E] text-[#01A49E]'
                                    : 'border-transparent text-gray-400 hover:text-gray-700'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div className="p-6">
                    {activeTab === 'description' && (
                        <div
                            className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: product.long_description || '<p>No description available.</p>' }}
                        />
                    )}

                    {activeTab === 'reviews' && (
                        <div className="space-y-4">
                            {[
                                { name: 'Rahul S.', rating: 5, text: 'Excellent product! Exactly as described. Fast delivery too.', date: '2 days ago' },
                                { name: 'Priya M.', rating: 4, text: 'Good quality. Packaging was great. Would recommend.', date: '1 week ago' },
                                { name: 'Amit K.', rating: 5, text: 'Best purchase this year. Working perfectly.', date: '2 weeks ago' },
                            ].map((r, i) => (
                                <div key={i} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                                    <div className="w-9 h-9 rounded-full bg-[#01A49E] text-white flex items-center justify-center font-black text-sm shrink-0">
                                        {r.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-sm text-gray-800">{r.name}</span>
                                            <div className="flex">
                                                {[1,2,3,4,5].map(s => (
                                                    <IoStarSharp key={s} size={11} className={s <= r.rating ? 'text-yellow-400' : 'text-gray-200'} />
                                                ))}
                                            </div>
                                            <span className="text-[10px] text-gray-400">{r.date}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{r.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'shipping' && (
                        <div className="space-y-3 text-sm text-gray-600">
                            {[
                                { icon: <FiTruck className="text-[#01A49E]" />, title: 'Free Shipping', desc: 'On all orders above ₹999. Delivered in 3–7 business days.' },
                                { icon: <FiRefreshCw className="text-[#01A49E]" />, title: 'Easy Returns', desc: '7-day return policy. Product must be unused and in original packaging.' },
                                { icon: <FiShield className="text-[#01A49E]" />, title: 'Warranty', desc: '1 year manufacturer warranty on all products.' },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="text-lg mt-0.5">{item.icon}</div>
                                    <div>
                                        <p className="font-bold text-gray-800">{item.title}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}
