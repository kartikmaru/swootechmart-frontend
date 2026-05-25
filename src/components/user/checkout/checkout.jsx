'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { client } from '@/utils/Helper';
import { useRouter } from 'next/navigation';
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";

export default function Checkout({ user }) {
    const { Razorpay } = useRazorpay();
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [seladdress, setSeladdress] = useState(0)
    const [addresses, setAddresses] = useState(user?.addresses || []);
    const router = useRouter()




    const cart = useSelector((store) => store.cart)

    const handleOrder = async () => {

        const orderData = {
            address: addresses[seladdress],
            paymentMethod
        }

        try {
            const response = await client.post("order/place", orderData)
            if (paymentMethod == "cod") {
                if (response.data.success) {
                    router.push(`/thank-you/${response.data.order_id}`)
                }
            } else {
                console.log(response.data)
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_API,
                    currency: "INR",
                    name: "WsCubeTeck .pvt .ltd",
                    description: "Test Transaction",
                    order_id: response.data.payment_order_id, // Generate order_id on server
                    handler: async (response) => {
                        const verifyRespose = await client.post("order/verify", response);
                        console.log(verifyRespose)
                    },
                    prefill: {
                        name: user.name ?? "John Doe",
                        email: user.email,
                        contact: "8233999833",
                    },
                    theme: {
                        color: "#F37254",
                    },
                }

                const razorpayInstance = new Razorpay(options);
                razorpayInstance.open();

            }

        } catch (error) {
            console.log(error)
        } finally {

        }




    }

    return (

        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* LEFT SECTION */}
                <div className="md:col-span-2 space-y-6">

                    {/* ADDRESS SECTION */}
                    <div className="bg-white p-5 rounded-2xl shadow">

                        <div className="flex justify-between items-center mb-5">

                            <h2 className="text-2xl font-semibold text-gray-800">
                                Select Address
                            </h2>

                            <Link href={"/profile"}>
                                <button
                                    className="bg-teal-500 hover:bg-teal-600 text-white text-sm px-4 py-2 rounded-lg transition"
                                >
                                    + Add New
                                </button>
                            </Link>

                        </div>

                        <div className="space-y-4">

                            {addresses.map((addr, index) => (

                                <div
                                    key={index}
                                    onClick={() => setSeladdress(index)}
                                    className={`border rounded-xl p-4 cursor-pointer transition flex gap-3 items-start ${seladdress === index
                                        ? 'border-teal-500 bg-teal-50'
                                        : 'border-gray-200 hover:border-teal-500'
                                        }`}
                                >

                                    <input
                                        type="radio"
                                        checked={seladdress === index}
                                        onChange={() => setSeladdress(index)}
                                        className="mt-1 accent-teal-500"
                                    />

                                    <div>
                                        <h3 className="font-semibold text-gray-800">
                                            {addr.fullName}
                                        </h3>

                                        <p className="text-gray-600 mt-1">
                                            {addr.addressLine}, {addr.city}, {addr.state}
                                        </p>

                                        <p className="text-gray-600">
                                            {addr.pincode} | {addr.mobile}
                                        </p>
                                    </div>

                                </div>
                            ))}

                        </div>

                    </div>

                    {/* PAYMENT METHOD */}
                    <div className="bg-white p-5 rounded-2xl shadow">

                        <h2 className="text-2xl font-semibold text-gray-800 mb-5">
                            Payment Method
                        </h2>

                        <div className="space-y-4">

                            <label className="flex items-center gap-3 border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-teal-500 transition">

                                <input
                                    type="radio"
                                    checked={paymentMethod === 'cod'}
                                    onChange={() => setPaymentMethod('cod')}
                                />

                                <span className="text-gray-700 font-medium">
                                    Cash on Delivery
                                </span>

                            </label>

                            <label className="flex items-center gap-3 border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-teal-500 transition">

                                <input
                                    type="radio"
                                    checked={paymentMethod === 'online'}
                                    onChange={() => setPaymentMethod('online')}
                                />

                                <span className="text-gray-700 font-medium">
                                    Online Payment (UPI / Card / Net Banking)
                                </span>

                            </label>

                        </div>

                    </div>

                </div>

                {/* RIGHT SECTION */}
                <div className="bg-white p-5 rounded-2xl shadow h-fit">

                    <h2 className="text-2xl font-semibold text-gray-800 mb-5">
                        Order Summary
                    </h2>

                    <div className="space-y-3">

                        <div className="flex justify-between text-gray-600">
                            <span>Original Total</span>
                            <span>₹{cart.original_total}</span>
                        </div>

                        <div className="flex justify-between text-green-600">
                            <span>You Save</span>
                            <span>
                                ₹{cart.original_total - cart.final_total}
                            </span>
                        </div>

                    </div>

                    <div className="border-t my-5"></div>

                    <div className="flex justify-between text-xl font-semibold text-gray-800">

                        <span>Total</span>

                        <span>₹{cart.final_total}</span>

                    </div>

                    <button
                        onClick={handleOrder}
                        className="w-full mt-6 bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-semibold transition"
                    >
                        Order Now
                    </button>

                </div>

            </div>

        </div>
    );
}