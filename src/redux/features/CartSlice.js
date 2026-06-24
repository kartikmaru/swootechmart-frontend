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
            const addQty = Number(payload.qty) || 1   // how many are being added
            if (existingItem) {
                existingItem.qty += addQty
            } else {
                state.items.push({ ...payload, qty: addQty })
            }
            // Multiply price by addQty — fixes bug where qty > 1 only added 1x price
            state.original_total += Number(payload.original_price) * addQty
            state.final_total    += Number(payload.final_price)    * addQty
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
                state.items = cartItem.items || []
                // Recalculate totals from items — protects against stale cached totals
                state.original_total = state.items.reduce((sum, i) => sum + Number(i.original_price) * (i.qty || 1), 0)
                state.final_total    = state.items.reduce((sum, i) => sum + Number(i.final_price)    * (i.qty || 1), 0)
            }
            const rv = JSON.parse(localStorage.getItem("recentlyViewed") || "[]")
            state.recentlyViewed = rv
        },
        qtyChange: (state, { payload }) => {
            const cartItem = state.items.find((item) => item.id == payload.id)
            if (!cartItem) return;
            if (payload.flag == "inc") {
                cartItem.qty++
            } else {
                if (cartItem.qty > 1) {
                    cartItem.qty--
                } else {
                    state.items = state.items.filter((item) => item.id != payload.id)
                }
            }
            // Recalculate totals from scratch — prevents accumulation bugs
            state.original_total = state.items.reduce((sum, i) => sum + Number(i.original_price) * i.qty, 0)
            state.final_total    = state.items.reduce((sum, i) => sum + Number(i.final_price)    * i.qty, 0)
            if (state.original_total < 0) state.original_total = 0
            if (state.final_total    < 0) state.final_total    = 0
            localStorage.setItem("cart", JSON.stringify(state))
        },

        addRecentlyViewed: (state, { payload }) => {
            const exists = state.recentlyViewed.findIndex(p => p.id === payload.id)
            if (exists !== -1) {
                state.recentlyViewed.splice(exists, 1)
            }
            state.recentlyViewed.unshift(payload)
            if (state.recentlyViewed.length > 8) {
                state.recentlyViewed = state.recentlyViewed.slice(0, 8)
            }
            localStorage.setItem("recentlyViewed", JSON.stringify(state.recentlyViewed))
        },

        // Completely remove one item from cart regardless of qty
        removeItem: (state, { payload }) => {
            state.items = state.items.filter(item => item.id !== payload.id)
            state.original_total = state.items.reduce((sum, i) => sum + Number(i.original_price) * i.qty, 0)
            state.final_total    = state.items.reduce((sum, i) => sum + Number(i.final_price)    * i.qty, 0)
            if (state.original_total < 0) state.original_total = 0
            if (state.final_total    < 0) state.final_total    = 0
            localStorage.setItem("cart", JSON.stringify(state))
        }
    },
})

export const { addtocart, emptycart, lstoCart, qtyChange, addRecentlyViewed, removeItem } = cartSlice.actions
export default cartSlice.reducer