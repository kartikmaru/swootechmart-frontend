'use client'
import { emptycart, qtyChange } from "@/redux/features/CartSlice";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

export default function CartUI() {

  const cart = useSelector((store) => store.cart)

  const dispatch = useDispatch()

  return (
    <div className="flex gap-10 p-10 bg-gray-100 min-h-screen">

      {/* LEFT SIDE */}
      <div className="flex-1 space-y-6">

        {
          cart.items.map((item, index) => (
            <div key={index} className="flex gap-6 bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100">

              {/* Image Section */}
              <div className="w-32 h-32 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt="Product"
                  className="w-full h-full object-contain p-3"
                />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between">

                {/* Top */}
                <div>
                  <h2 className="font-semibold text-lg text-gray-800 line-clamp-1">
                    {item.name}
                  </h2>

                  <p className="text-[#01A49E] font-bold text-xl mt-1">
                    ₹{item.final_price}
                  </p>
                </div>

                {/* Bottom */}
                <div className="flex items-center justify-between mt-4">

                  {/* Qty Controls */}
                  <div className="flex items-center border rounded-lg overflow-hidden">

                    <button
                      onClick={() => dispatch(qtyChange({ id: item.id, flag: "dec" }))}
                      className="w-9 h-9 flex items-center justify-center text-red-500 hover:bg-red-50 transition text-lg"
                    >
                      −
                    </button>

                    <span className="w-10 text-center text-sm font-medium bg-gray-50">
                      {item.qty}
                    </span>

                    <button
                      onClick={() => dispatch(qtyChange({ id: item.id, flag: "inc" }))}
                      className="w-9 h-9 flex items-center justify-center bg-black text-white hover:bg-gray-800 transition text-lg"
                    >
                      +
                    </button>
                  </div>

                  {/* Stock Status */}
                  <div>
                    {
                      item.stock ? (
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
      <div className="w-80 bg-white p-6 rounded-xl shadow border border-green-400 h-fit">
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
          <button className="mt-5 w-full bg-teal-600 text-white py-3 rounded-lg">
            CHECKOUT
          </button>
        </Link>
        <button
          onClick={() => dispatch(emptycart())}
          className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Clear Cart
        </button>
      </div>

    </div>
  );
}