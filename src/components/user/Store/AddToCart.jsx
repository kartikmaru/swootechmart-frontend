'use client'

import { addtocart, qtyChange } from '@/redux/features/CartSlice'
import { client, notify } from '@/utils/Helper'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function AddToCart({ product, image }) {

    const cart = useSelector((store) => store.cart.items)

    const cartItem = cart.find(
        (item) => item.id == product._id
    )

    const dispatcher = useDispatch()

    // =========================
    // ADD TO CART FUNCTION
    // =========================

    const add_to_cart = async () => {

        try {

            const token = localStorage.getItem("token")

            // =========================
            // LOGIN USER
            // =========================

            if (token) {

                await client.post(
                    "cart/add_to_cart",
                    {
                        productId: product._id,
                        qty: 1
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
            }

            // =========================
            // REDUX + LOCAL STORAGE
            // =========================

            dispatcher(
                addtocart({
                    name: product.name,
                    final_price: product.final_price,
                    original_price: product.original_price,
                    id: product._id,
                    discount: product.discount,
                    stock: product.stock,
                    thumbnail: image,
                    qty: 1
                })
            )

            notify("Product Added To Cart", true)

        } catch (error) {

            console.log(error.response?.data)

            notify("Something went wrong", false)
        }
    }

    return (

        <div className="w-full">

            {
                cartItem ?

                    <div className="flex items-center justify-between w-full border border-gray-200 rounded-lg overflow-hidden">

                        {/* Minus */}
                        <button
                            onClick={() =>
                                dispatcher(
                                    qtyChange({
                                        id: product._id,
                                        flag: "dec"
                                    })
                                )
                            }
                            className="w-10 h-9 flex items-center justify-center text-red-500 hover:bg-red-50 transition text-lg font-semibold"
                        >
                            −
                        </button>

                        {/* Quantity */}
                        <h2 className="flex-1 text-center text-sm font-semibold text-gray-800 bg-gray-50 h-9 flex items-center justify-center">
                            {cartItem.qty}
                        </h2>

                        {/* Plus */}
                        <button
                            onClick={() =>
                                dispatcher(
                                    qtyChange({
                                        id: product._id,
                                        flag: "inc"
                                    })
                                )
                            }
                            className="w-10 h-9 flex items-center justify-center text-white bg-black hover:bg-gray-800 transition text-lg font-semibold"
                        >
                            +
                        </button>

                    </div>

                    :

                    <button
                        onClick={add_to_cart}
                        className="w-full bg-black text-white text-xs font-medium py-2 rounded-lg hover:bg-gray-900 transition"
                    >
                        Add to Cart
                    </button>
            }

        </div>
    )
}