import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/Header";
import AdminGuard from "@/components/admin/AdminGuard";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
    title: "SwooTechMart Admin Panel",
    description: "Admin dashboard for SwooTechMart",
};

export default function AdminLayout({ children }) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="h-full flex bg-gray-50 overflow-x-hidden">
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

                {/* AdminGuard checks role on client side — redirects to /login if not admin */}
                <AdminGuard>
                    {/* Sidebar — hidden on mobile */}
                    <div className="hidden md:block shrink-0">
                        <Sidebar />
                    </div>
                    <div className="flex-1 flex flex-col min-h-screen overflow-hidden min-w-0">
                        <AdminHeader />
                        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                            {children}
                        </main>
                    </div>
                </AdminGuard>
            </body>
        </html>
    )
}
