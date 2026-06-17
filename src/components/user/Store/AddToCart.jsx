'use client'

import { useDispatch, useSelector } from 'react-redux'
import { qtyChange } from '@/redux/features/CartSlice'
import { notify } from '@/utils/Helper'
import { addToCartWithSync, changeQtyWithSync } from '@/utils/cartHelper'
import { FiShoppingCart, FiPlus, FiMinus } from 'react-icons/fi'

export default function AddToCart({ product, image }) {

    const dispatch  = useDispatch()
    const cartItems = useSelector(s => s.cart.items)
    const cartItem  = cartItems.find(i => i.id === product._id)

    const handleAdd = async () => {
        await addToCartWithSync(dispatch, {
            id:             product._id,
            name:           product.name,
            final_price:    product.final_price,
            original_price: product.original_price,
            discount:       product.discount,
            stock:          product.stock,
            thumbnail:      image,
            qty:            1,
        })
        notify('Added to cart', true)
    }

    if (cartItem) {
        return (
            <div className="flex items-center justify-between w-full bg-gray-50 border border-gray-200 rounded-xl overflow-hidden h-9">
                <button
                    onClick={() => changeQtyWithSync(dispatch, { id: product._id, flag: 'dec' }, cartItems)}
                    className="w-9 h-full flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition"
                >
                    <FiMinus size={13} />
                </button>
                <span className="flex-1 text-center text-sm font-black text-gray-800">
                    {cartItem.qty}
                </span>
                <button
                    onClick={() => changeQtyWithSync(dispatch, { id: product._id, flag: 'inc' }, cartItems)}
                    className="w-9 h-full flex items-center justify-center bg-[#01A49E] text-white hover:bg-[#01857f] transition"
                >
                    <FiPlus size={13} />
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={handleAdd}
            className="w-full flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-[#01A49E] text-white text-xs font-bold py-2.5 rounded-xl transition-colors duration-200"
        >
            <FiShoppingCart size={13} />
            Add to Cart
        </button>
    )
}
