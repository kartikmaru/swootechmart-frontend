'use client'
import React from 'react'
import { Provider } from 'react-redux'
import store from './store'
import { cartSlice } from './features/CartSlice'

export default function ReduxProvider({ children }) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}
