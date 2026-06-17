'use client'
// DealsOfDay.jsx — 'use client' isliye lagaya hai kyunki:
// Thumbnail pe click hone pe main image change hoti hai (useState)
// Countdown timer bhi live update hota hai (useEffect + setInterval)

import React, { useState, useEffect } from 'react'
import { FiTruck, FiGift } from 'react-icons/fi'
import { BsLightningChargeFill } from 'react-icons/bs'
import { FiShoppingCart } from 'react-icons/fi'

// Deal data — images array me 4 alag-alag product images hain
// Jab user koi thumbnail click karta hai, hum selectedImg state update karte hain
// aur main box me wahi image dikhti hai
const deal = {
  badge: 'SAVE $199',
  name: 'Xiaomi Redmi Note 11 Pro 256GB 2023, Black Smartphone',
  sku: 'P03',
  finalPrice: '$569.00',
  originalPrice: '$769.00',
  features: [
    'Intel LGA-1700 Socket: Supports 12th & 13th Gen Intel Core',
    'DDR5 Compatible: 4×16G 288MHz with XMP 3.0 Memory',
    'Commanding Power Design: Twin 50+1+2 Phases Digital VRM',
  ],
  stock: 28,
  total: 79,
  // Har image ka ek url hai — thumbnail + large version
  images: [
    { thumb: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=80&h=100&fit=crop', large: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop' },
    { thumb: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&h=100&fit=crop', large: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop' },
    { thumb: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=80&h=100&fit=crop', large: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop' },
    { thumb: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=80&h=100&fit=crop', large: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop' },
  ],
}

const sideBanners = [
  { label: '50% OFF', bg: 'bg-gray-900', img: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=260&h=130&fit=crop', tag: 'Gaming' },
  { label: 'NEW', bg: 'bg-slate-100', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=260&h=130&fit=crop', tag: 'Tablets' },
  { label: 'HOT', bg: 'bg-gray-800', img: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=260&h=130&fit=crop', tag: 'Smartphones' },
]

export default function DealsOfDay() {
  // selectedImg — abhi main box me kaun si image dikhrahi hai
  // Default: pehli image (index 0)
  const [selectedImg, setSelectedImg] = useState(0)

  // Countdown timer logic:
  // useEffect — component load hone ke baad ek interval shuru hota hai
  // Har second time 1 second kam hota rehta hai
  // Jab 0 pe pahunche toh dobara 8 ghante se shuru ho jaata hai
  const [timeLeft, setTimeLeft] = useState(8 * 60 * 60) // 8 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => (t <= 1 ? 8 * 60 * 60 : t - 1))
    }, 1000)
    return () => clearInterval(timer) // cleanup — component hatne pe interval band karo
  }, [])

  // Seconds ko HH:MM:SS format me convert karo
  const hh = String(Math.floor(timeLeft / 3600)).padStart(2, '0')
  const mm = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0')
  const ss = String(timeLeft % 60).padStart(2, '0')

  const progress = Math.round((deal.stock / deal.total) * 100)

  return (
    <section className="flex flex-col lg:flex-row gap-4">

      {/* ── Main Deal Card ──────────────────────────────────────── */}
      <div className="flex-1 border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">

        {/* Header bar */}
        <div className="flex items-center gap-2 bg-[#01A49E] px-4 py-2.5 flex-wrap">
          <BsLightningChargeFill className="text-yellow-300" size={15} />
          <span className="text-white font-black text-sm tracking-widest uppercase">Deals of the Day</span>
          <div className="ml-auto flex items-center gap-1.5 text-white/90 text-xs font-medium">
            <span className="hidden sm:inline">Ends in:</span>
            {[hh, mm, ss].map((unit, i) => (
              <React.Fragment key={i}>
                <span className="bg-white/25 text-white font-black px-2 py-0.5 rounded-lg text-sm min-w-[28px] text-center tabular-nums">
                  {unit}
                </span>
                {i < 2 && <span className="font-black text-white/60">:</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 p-4">

          {/* Thumbnails — horizontal on mobile, vertical on sm+ */}
          <div className="flex sm:flex-col flex-row gap-2 shrink-0">
            {deal.images.map((img, i) => (
              <div
                key={i}
                onClick={() => setSelectedImg(i)}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200
                  ${selectedImg === i
                    ? 'border-[#01A49E] shadow-md scale-105'
                    : 'border-gray-200 hover:border-[#01A49E]/50 opacity-70 hover:opacity-100'}`}
              >
                <img src={img.thumb} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 sm:w-40 md:w-44 relative flex items-center justify-center bg-gray-50 rounded-xl min-h-[160px]">
            <span className="absolute top-2 left-2 bg-[#01A49E] text-white text-[10px] font-black px-2 py-0.5 rounded-full z-10">
              {deal.badge}
            </span>
            <img
              key={selectedImg}
              src={deal.images[selectedImg].large}
              alt={deal.name}
              className="w-full h-40 sm:h-44 object-contain p-2"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 mb-0.5">{deal.sku}</p>
            <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2">{deal.name}</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-xl font-black text-[#01A49E]">{deal.finalPrice}</span>
              <span className="text-xs text-gray-400 line-through">{deal.originalPrice}</span>
            </div>
            <ul className="space-y-1 mb-3 hidden sm:block">
              {deal.features.map((f, i) => (
                <li key={i} className="text-[11px] text-gray-500 flex items-start gap-1.5">
                  <span className="text-[#01A49E] shrink-0 mt-0.5">•</span>{f}
                </li>
              ))}
            </ul>
            <div className="flex gap-2 mb-3 flex-wrap">
              <span className="flex items-center gap-1 bg-teal-50 text-teal-600 text-[10px] font-semibold px-2 py-1 rounded-full border border-teal-100">
                <FiTruck size={10} /> Free Shipping
              </span>
              <span className="flex items-center gap-1 bg-orange-50 text-orange-500 text-[10px] font-semibold px-2 py-1 rounded-full border border-orange-100">
                <FiGift size={10} /> Free Gift
              </span>
            </div>
            <button className="flex items-center gap-2 bg-[#01A49E] hover:bg-[#01857f] text-white text-xs font-bold px-4 py-2 rounded-xl transition mb-3 shadow-sm">
              <FiShoppingCart size={13} /> Add to Cart
            </button>
            <div>
              <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                <span className="hidden sm:inline">Hurry up! Promotion ends soon</span>
                <span className="font-bold text-gray-700">{deal.stock}/{deal.total}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-[#01A49E] h-1.5 rounded-full" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Side Banners — hidden on mobile ──────────────────────── */}
      <div className="hidden lg:flex w-48 xl:w-52 shrink-0 flex-col gap-3">
        {sideBanners.map((b, i) => (
          <div key={i}
            className={`${b.bg} rounded-2xl overflow-hidden relative cursor-pointer hover:scale-[1.02] transition flex-1`}>
            <img src={b.img} alt={b.tag} className="w-full h-full object-cover opacity-75" />
            <div className="absolute inset-0 flex flex-col justify-between p-3">
              <span className="bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full w-fit">
                {b.label}
              </span>
              <span className="text-white font-bold text-sm drop-shadow">{b.tag}</span>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}
