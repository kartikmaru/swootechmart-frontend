'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import cartSlice from './features/CartSlice'
import CartInitializer from '@/components/user/cart/CartInitializer'  // ✅ import

function makeStore() {
    return configureStore({
        reducer: { cart: cartSlice },
        middleware: (gDM) => gDM({ serializableCheck: false }),
    })
}

export default function ReduxProvider({ children }) {
    const storeRef = useRef(null)
    if (!storeRef.current) {
        storeRef.current = makeStore()
    }
    return (
        <Provider store={storeRef.current}>
            <CartInitializer />   {/* ✅ app mount par cart load karega */}
            {children}
        </Provider>
    )
}