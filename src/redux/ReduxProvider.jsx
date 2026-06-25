'use client'

import { useRef } from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import cartSlice from './features/CartSlice'

// ── makeStore ─────────────────────────────────────────────────────────────────
// Each call creates a FRESH store instance.
// Using a factory function (not a singleton) is required for:
//   - SSR safety: server never shares state between requests
//   - Next.js App Router: each render tree gets its own store
function makeStore() {
    return configureStore({
        reducer: {
            cart: cartSlice,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }),
    })
}

// ── ReduxProvider ─────────────────────────────────────────────────────────────
// Uses useRef so the store is only created ONCE per client mount,
// not recreated on every render. This is the Next.js App Router official pattern.
// See: https://redux.js.org/usage/nextjs
export default function ReduxProvider({ children }) {
    // useRef ensures the store is stable across re-renders
    // and is NEVER created on the server (this file is 'use client')
    const storeRef = useRef(null)

    if (!storeRef.current) {
        storeRef.current = makeStore()
    }

    return (
        <Provider store={storeRef.current}>
            {children}
        </Provider>
    )
}
