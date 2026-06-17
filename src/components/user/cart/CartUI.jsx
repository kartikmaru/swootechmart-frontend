'use client'
import { changeQtyWithSync, clearCartWithSync } from "@/utils/cartHelper";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

export default function CartUI() {

  const cart = useSelector((store) => store.cart)

  const dispatch = useDispatch()

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 p-4 sm:p-6 lg:p-10 bg-gray-100 min-h-screen">

      {/* LEFT SIDE */}
      <div className="flex-1 space-y-6">

        {
          cart?.items?.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100">

              {/* Image Section */}
              <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={item?.thumbnail}
                  alt="Product"
                  className="w-full h-full object-contain p-3"
                />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between">

                {/* Top */}
                <div>
                  <h2 className="font-semibold text-base sm:text-lg text-gray-800 line-clamp-1">
                    {item?.name}
                  </h2>

                  <p className="text-[#01A49E] font-bold text-lg sm:text-xl mt-1">
                    ₹{item?.final_price}
                  </p>
                </div>

                {/* Bottom */}
                <div className="flex items-center justify-between mt-4">

                  {/* Qty Controls */}
                  <div className="flex items-center border rounded-lg overflow-hidden">

                    <button
                      onClick={() => changeQtyWithSync(dispatch, { id: item?.id, flag: "dec" }, cart.items)}
                      className="w-9 h-9 flex items-center justify-center text-red-500 hover:bg-red-50 transition text-lg"
                    >
                      −
                    </button>

                    <span className="w-10 text-center text-sm font-medium bg-gray-50">
                      {item?.qty}
                    </span>

                    <button
                      onClick={() => changeQtyWithSync(dispatch, { id: item?.id, flag: "inc" }, cart.items)}
                      className="w-9 h-9 flex items-center justify-center bg-black text-white hover:bg-gray-800 transition text-lg"
                    >
                      +
                    </button>
                  </div>

                  {/* Stock Status */}
                  <div>
                    {
                      item?.stock ? (
                        <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium">
                          ✔ In Stock
                        </span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-500 px-3 py-1 rounded-full font-medium">
                          Out of Stock
                        </span>
                      )
                    }
                  </div>

                </div>

              </div>

            </div>
          ))
        }

      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-80 bg-white p-6 rounded-xl shadow border border-green-400 h-fit shrink-0">
        <h2 className="text-lg font-bold mb-4">Order Summary</h2>

        <div className="flex justify-between mb-2">
          <span>Sub Total:</span>
          <span>${cart.original_total}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Saving:</span>
          <span>${cart.original_total - cart.final_total}</span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between font-bold">
          <span>ORDER TOTAL:</span>
          <span>${cart.final_total}</span>
        </div>

        <Link href="/checkout">
          <button className="mt-5 w-full bg-teal-600 text-white py-3 rounded-lg font-semibold cursor-pointer hover:bg-teal-700 transition">
            CHECKOUT
          </button>
        </Link>
        <button
          onClick={() => clearCartWithSync(dispatch)}
          className="mt-3 w-full bg-red-500 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-red-600 transition"
        >
          Clear Cart
        </button>
      </div>

    </div>
  );
}