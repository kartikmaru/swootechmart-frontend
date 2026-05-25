'use client';

import { useState } from 'react';
import { client } from '@/utils/Helper';

export default function Profile({ user }) {

    const [addresses, setAddresses] = useState(user?.addresses || []);

    const [form, setForm] = useState({
        fullName: '',
        mobile: '',
        pincode: '',
        addressLine: '',
        city: '',
        state: ''
    });

    // Handle Change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handledelete = async (index) => {

        try {

            await client.put(
                'user/deleteaddress',
                { index }
            )

            setAddresses((prev) =>
                prev.filter((_, i) => i !== index)
            )

        } catch (error) {
            console.log(error)
        }

    }

    // Add Address
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const res = await client.post(
                'user/addaddresses',
                form
            );

            setAddresses(res.data.data)

            setForm({
                fullName: '',
                mobile: '',
                pincode: '',
                addressLine: '',
                city: '',
                state: ''
            });

        } catch (err) {

            console.error(err);

        }
    };

    return (

        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-teal-50 py-12 px-4">

            <div className="max-w-7xl mx-auto">

                {/* TOP HEADING */}
                <div className="mb-10 text-center">

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                        My Profile
                    </h1>

                    <p className="text-gray-500 mt-3 text-sm md:text-base">
                        Manage your addresses and delivery information
                    </p>

                </div>

                {/* MAIN GRID */}
                <div className="grid lg:grid-cols-5 gap-8 items-start">

                    {/* LEFT SECTION */}
                    <div className="lg:col-span-2">

                        <div className="bg-white/80 backdrop-blur-lg border border-white rounded-3xl shadow-2xl p-8 sticky top-5">

                            <div className="flex items-center gap-3 mb-7">

                                <div className="w-12 h-12 rounded-2xl bg-teal-500 flex items-center justify-center text-white text-xl shadow-lg">
                                    +
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Add Address
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Save your delivery location
                                    </p>
                                </div>

                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >

                                {/* FULL NAME */}
                                <div>

                                    <label className="text-sm font-medium text-gray-600 block mb-2">
                                        Full Name
                                    </label>

                                    <input
                                        name="fullName"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Enter your full name"
                                        className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                                        required
                                    />

                                </div>

                                {/* MOBILE */}
                                <div>

                                    <label className="text-sm font-medium text-gray-600 block mb-2">
                                        Mobile Number
                                    </label>

                                    <input
                                        name="mobile"
                                        value={form.mobile}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Enter mobile number"
                                        className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                                        required
                                    />

                                </div>

                                {/* PINCODE */}
                                <div>

                                    <label className="text-sm font-medium text-gray-600 block mb-2">
                                        Pincode
                                    </label>

                                    <input
                                        name="pincode"
                                        value={form.pincode}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Enter pincode"
                                        className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                                        required
                                    />

                                </div>

                                {/* ADDRESS */}
                                <div>

                                    <label className="text-sm font-medium text-gray-600 block mb-2">
                                        Address
                                    </label>

                                    <textarea
                                        name="addressLine"
                                        value={form.addressLine}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Enter complete address"
                                        className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition resize-none"
                                        required
                                    ></textarea>

                                </div>

                                {/* CITY STATE */}
                                <div className="grid grid-cols-2 gap-4">

                                    <div>

                                        <label className="text-sm font-medium text-gray-600 block mb-2">
                                            City
                                        </label>

                                        <input
                                            name="city"
                                            value={form.city}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="City"
                                            className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                                            required
                                        />

                                    </div>

                                    <div>

                                        <label className="text-sm font-medium text-gray-600 block mb-2">
                                            State
                                        </label>

                                        <input
                                            name="state"
                                            value={form.state}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="State"
                                            className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                                            required
                                        />

                                    </div>

                                </div>

                                {/* BUTTON */}
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold py-3.5 rounded-2xl transition duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-0.5"
                                >
                                    Save Address
                                </button>

                            </form>

                        </div>

                    </div>

                    {/* RIGHT SECTION */}
                    <div className="lg:col-span-3">

                        <div className="bg-white/80 backdrop-blur-lg border border-white rounded-3xl shadow-2xl p-8">

                            {/* TOP */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                                <div>

                                    <h2 className="text-3xl font-bold text-gray-800">
                                        Saved Addresses
                                    </h2>

                                    <p className="text-gray-500 mt-1">
                                        Your delivery destinations
                                    </p>

                                </div>

                                <div className="bg-teal-100 text-teal-700 px-5 py-2 rounded-full text-sm font-semibold w-fit">
                                    {addresses?.length || 0} Addresses
                                </div>

                            </div>

                            {/* ADDRESS LIST */}
                            <div className="space-y-4">

                                {addresses.map((addr, index) => (

                                    <div
                                        key={addr._id}
                                        className="group relative overflow-hidden border border-gray-200 rounded-2xl bg-white px-5 py-4 hover:border-teal-400 hover:shadow-lg transition duration-300"
                                    >

                                        {/* HOVER EFFECT */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition"></div>

                                        <div className="relative flex items-start justify-between gap-4">

                                            {/* LEFT */}
                                            <div className="flex gap-3">

                                                {/* ICON */}
                                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white flex items-center justify-center font-semibold text-base shadow">
                                                    {addr.fullName?.charAt(0)}
                                                </div>

                                                {/* INFO */}
                                                <div>

                                                    <h3 className="text-base font-semibold text-gray-800">
                                                        {addr.fullName}
                                                    </h3>

                                                    <p className="text-sm text-gray-600 mt-1 leading-6">
                                                        {addr.addressLine},
                                                        {" "}
                                                        {addr.city},
                                                        {" "}
                                                        {addr.state}
                                                    </p>

                                                    <div className="flex flex-wrap gap-2 mt-3">

                                                        <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs">
                                                            {addr.pincode}
                                                        </span>

                                                        <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs">
                                                            {addr.mobile}
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>

                                            {/* DELETE */}
                                            <button
                                                onClick={() => handledelete(index)}
                                                className="text-red-500 hover:text-red-600 text-xs font-medium hover:underline"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}