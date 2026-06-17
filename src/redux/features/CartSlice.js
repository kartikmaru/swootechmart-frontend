import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    items: [],
    original_total: 0,
    final_total: 0,
    recentlyViewed: []   // recently viewed products track karo
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addtocart: (state, { payload }) => {
            const existingItem = state.items.find((item) => item.id == payload.id)
            if (existingItem) {
                existingItem.qty = (existingItem.qty || 0) + 1
            }
            else {
                state.items.push(payload)
            }
            state.original_total += Number(payload.original_price)
            state.final_total += Number(payload.final_price)
            localStorage.setItem("cart", JSON.stringify(state))
        },
        emptycart: (state) => {
            state.original_total = 0
            state.final_total = 0
            state.items = []
            localStorage.removeItem("cart")
        },
        lstoCart: (state) => {
            const cartItem = JSON.parse(localStorage.getItem("cart"))
            if (cartItem) {
                state.items = cartItem.items
                state.original_total = Number(cartItem.original_total)
                state.final_total = Number(cartItem.final_total)
            }
            // recently viewed bhi localStorage se load karo
            const rv = JSON.parse(localStorage.getItem("recentlyViewed") || "[]")
            state.recentlyViewed = rv
        },
        qtyChange: (state, { payload }) => {
            const cartItem = state.items.find((item) => item.id == payload.id)
            if (!cartItem) return;
            if (payload.flag == "inc") {
                cartItem.qty++
                state.original_total += Number(cartItem.original_price)
                state.final_total += Number(cartItem.final_price)
            } else {
                state.original_total -= Number(cartItem.original_price)
                state.final_total -= Number(cartItem.final_price)
                if (cartItem.qty > 1) {
                    cartItem.qty--
                } else {
                    state.items = state.items.filter((item) => item.id != payload.id)
                }
            }
            if (state.original_total < 0) state.original_total = 0
            if (state.final_total < 0) state.final_total = 0
            localStorage.setItem("cart", JSON.stringify(state))
        },

        // Recently Viewed — product detail page pe call hoga
        // Max 8 products track karta hai, duplicates remove karta hai
        addRecentlyViewed: (state, { payload }) => {
            const exists = state.recentlyViewed.findIndex(p => p.id === payload.id)
            if (exists !== -1) {
                state.recentlyViewed.splice(exists, 1)  // purana hata do
            }
            state.recentlyViewed.unshift(payload)        // naya sab se aage
            if (state.recentlyViewed.length > 8) {
                state.recentlyViewed = state.recentlyViewed.slice(0, 8)
            }
            localStorage.setItem("recentlyViewed", JSON.stringify(state.recentlyViewed))
        }
    },
})

export const { addtocart, emptycart, lstoCart, qtyChange, addRecentlyViewed } = cartSlice.actions
export default cartSlice.reducer