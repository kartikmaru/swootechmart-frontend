import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/user/Header";
import Footer from "@/components/user/Footer";
import ReduxProvider from "@/redux/ReduxProvider";
import { ToastContainer } from "react-toastify";
import { getMe } from "@/API/serverAPI";

export const dynamic = 'force-dynamic';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
    title: "SwooTechMart — Premium Electronics",
    description: "Your trusted destination for premium electronics",
};

export default async function UserLayout({ children }) {
    // Fetch user server-side — reads auth_token cookie set by login page on Vercel domain
    // Returns null if not logged in (user will be shown login button in Header)
    const userRes = await getMe()
    const user    = userRes?.user ?? null

    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
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
                    {/* Header receives user from server — shows name/profile or Login button */}
                    <Header user={user} />
                    <main className="flex-1 w-full">
                        <div className="container-app py-4 sm:py-6">
                            {children}
                        </div>
                    </main>
                    <Footer />
                </ReduxProvider>
            </body>
        </html>
    );
}
