'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function PriceFilterSection() {

  const router = useRouter()
  const search_params = useSearchParams()


  const MIN_LIMIT = 0
  const MAX_LIMIT = 5000

  const min_query = Number(search_params.get("min_price"))
  const max_query = Number(search_params.get("max_price"))

  const [min, setMin] = useState(min_query)
  const [max, setMax] = useState(max_query)

  function minHandler(e) {
    let value = Number(e.target.value)

    if (value < MIN_LIMIT) value = MIN_LIMIT
    if (value > MAX_LIMIT) value = MAX_LIMIT

    setMin(value)
  }

  function maxHandler(e) {
    let value = Number(e.target.value)

    if (value < MIN_LIMIT) value = MIN_LIMIT
    if (value > MAX_LIMIT) value = MAX_LIMIT

    setMax(value)
  }
  function applyFilter() {
    const params = new URLSearchParams(search_params.toString())

    if (min < MIN_LIMIT) {
      setMin(MIN_LIMIT)
    }
    if (max < MAX_LIMIT) {
      setMax(MAX_LIMIT)
    }

    if (min === MIN_LIMIT && max === MAX_LIMIT) {
      params.delete('min_price')
      params.delete('max_price')
    } else {
      params.set('min_price', min)
      params.set('max_price', max)
    }

    router.push(`?${params.toString()}`, { scroll: false })
  }

  function clearFilter() {
    const params = new URLSearchParams(search_params.toString())
    params.delete('min_price')
    params.delete('max_price')
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <aside className="w-full max-w-[280px] bg-[#f0f2f8] p-6 rounded-xl font-sans shadow-sm">

      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Price
      </h2>

      {/* Inputs */}
      <div className="flex gap-3 mb-4">
        <input
          type="number"
          onChange={minHandler}
          placeholder="0"
          className="w-full px-3 py-2 rounded-md border bg-white text-sm outline-none"
        />
        <input
          onChange={maxHandler}
          type="number"
          placeholder="5000"
          className="w-full px-3 py-2 rounded-md border bg-white text-sm outline-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mb-4">
        <button className="flex-1 bg-gray-800 text-white py-2 rounded-md text-sm font-medium"
          onClick={applyFilter}
        >
          Go
        </button>

        <button
        onClick={clearFilter}
        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md text-sm font-medium">
          Clear
        </button>
      </div>

      {/* Range Text */}
      <div className="text-sm text-gray-500">
        ₹0 - ₹5000
      </div>

    </aside>
  );
}