import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css"
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import ReduxProvider from "@/redux/ReduxProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "SwooTechMart",
    description: "Your trusted destination for premium electronics",
};

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full bg-gray-50">
                {/* ReduxProvider MUST wrap children so useDispatch/useSelector work in login & register */}
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
            </body>
        </html>
    );
}
