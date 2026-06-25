import { configureStore } from '@reduxjs/toolkit'
import cartSlice from './features/CartSlice'

// Singleton store — used only by cartHelper.js for direct imports outside of React
// The main React Provider uses ReduxProvider.jsx with useRef for SSR safety
const store = configureStore({
    reducer: {
        cart: cartSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
})

export default store
