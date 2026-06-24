'use client'
import { changeQtyWithSync, clearCartWithSync } from "@/utils/cartHelper";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function CartUI() {
  const cart     = useSelector((store) => store.cart)
  const dispatch = useDispatch()
  const router   = useRouter()

  const isEmpty = !cart?.items || cart.items.length === 0

  const handleCheckout = () => {
    if (isEmpty) return
    router.push('/checkout')
  }

  // ── Empty state ────────────────────────────────────────────────────────
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[55vh] gap-5 text-center px-4 py-12">
        <div className="text-6xl sm:text-7xl">🛒</div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-700">Your cart is empty</h2>
        <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
          Looks like you haven&apos;t added anything yet. Browse our store and find something you like!
        </p>
        <Link href="/store"
          className="bg-[#01A49E] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#01857f] transition">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container-app py-6 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-6">
        Shopping Cart <span className="text-sm font-medium text-gray-400 ml-1">({cart.items.length} item{cart.items.length !== 1 ? 's' : ''})</span>
      </h1>

      <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 items-start">

        {/* ── Left — Cart Items ───────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-4 w-full">
          {cart.items.map((item, index) => (
            <div key={index}
              className="flex flex-col sm:flex-row gap-4 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">

              {/* Image */}
              <div className="w-full sm:w-28 lg:w-32 h-28 sm:h-28 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden shrink-0 mx-auto sm:mx-0">
                <img src={item?.thumbnail} alt="Product"
                  className="w-full h-full object-contain p-2" />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-semibold text-sm sm:text-base text-gray-800 line-clamp-2">
                    {item?.name}
                  </h2>
                  <p className="text-[#01A49E] font-bold text-lg mt-1">
                    ₹{item?.final_price?.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Per unit · Total: ₹{(item?.final_price * item?.qty)?.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
                  {/* Qty Controls */}
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => changeQtyWithSync(dispatch, { id: item?.id, flag: "dec" }, cart.items)}
                      className="w-9 h-9 flex items-center justify-center text-red-500 hover:bg-red-50 transition font-bold">
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-gray-800 bg-gray-50">
                      {item?.qty}
                    </span>
                    <button
                      onClick={() => changeQtyWithSync(dispatch, { id: item?.id, flag: "inc" }, cart.items)}
                      className="w-9 h-9 flex items-center justify-center bg-gray-900 text-white hover:bg-[#01A49E] transition font-bold">
                      +
                    </button>
                  </div>

                  {/* Stock Status */}
                  {item?.stock ? (
                    <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium">
                      ✔ In Stock
                    </span>
                  ) : (
                    <span className="text-xs bg-red-100 text-red-500 px-3 py-1 rounded-full font-medium">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Right — Order Summary ───────────────────────────────────── */}
        <div className="w-full xl:w-80 2xl:w-96 shrink-0">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm xl:sticky xl:top-24">
            <h2 className="text-lg font-black text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Sub Total</span>
                <span className="font-semibold">₹{cart.original_total?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>You Save</span>
                <span className="font-semibold">₹{(cart.original_total - cart.final_total)?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-400 text-xs">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>
            </div>

            <div className="border-t border-gray-100 my-4" />

            <div className="flex justify-between font-black text-gray-900 text-base mb-5">
              <span>ORDER TOTAL</span>
              <span className="text-[#01A49E]">₹{cart.final_total?.toLocaleString('en-IN')}</span>
            </div>

            <button onClick={handleCheckout}
              className="w-full bg-[#01A49E] hover:bg-[#01857f] text-white py-3.5 rounded-xl font-bold transition text-sm">
              Proceed to Checkout
            </button>

            <button onClick={() => clearCartWithSync(dispatch)}
              className="mt-3 w-full border border-red-200 text-red-500 hover:bg-red-50 py-2.5 rounded-xl font-semibold transition text-sm">
              Clear Cart
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
