'use client'
// AuthClientWrapper — Client Component
// Provides Redux store and Toast notifications for all auth pages.
// Kept separate from the layout so the layout can remain a Server Component
// (required to export `metadata` and use font loaders).

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ReduxProvider from '@/redux/ReduxProvider'

export default function AuthClientWrapper({ children }) {
    return (
        <ReduxProvider>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                icon={true}
            />
            <div className="min-h-screen flex flex-col">
                {children}
            </div>
        </ReduxProvider>
    )
}
