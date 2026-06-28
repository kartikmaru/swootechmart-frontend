'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { client, notify } from '@/utils/Helper';
import { useRouter } from 'next/navigation';
import { useRazorpay } from "react-razorpay";
import { emptycart } from '@/redux/features/CartSlice';

export default function Checkout({ user }) {
    const { Razorpay } = useRazorpay();
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [seladdress,    setSeladdress]    = useState(0);
    const [addresses,     setAddresses]     = useState(user?.addresses || []);
    const [loading,       setLoading]       = useState(false);
    const router   = useRouter();
    const dispatch = useDispatch();

    const cart    = useSelector((store) => store.cart);
    const isEmpty = !cart?.items || cart.items.length === 0;

    useEffect(() => {
        if (isEmpty) router.replace('/cart');
    }, [isEmpty, router]);

    useEffect(() => {
        if (!user) router.replace('/login?redirect=/checkout');
    }, [user, router]);

    // Silently sync Redux cart to DB when checkout page loads.
    // This ensures backend has the latest cart even if user added items
    // from a different device or before logging in.
    useEffect(() => {
        if (!user || isEmpty) return;
        const syncCart = async () => {
            try {
                const localCartItems = cart.items.map(i => ({ id: i.id, qty: i.qty }));
                await client.post('cart/sync', {
                    localCart: JSON.stringify({ items: localCartItems }),
                });
                console.log('[Checkout] Cart synced to DB successfully');
            } catch (err) {
                // Sync failure is non-fatal — backend will return 400 "cart empty" if this fails
                console.warn('[Checkout] Cart pre-sync failed (non-fatal):', err?.response?.data?.message || err.message);
            }
        };
        syncCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]); // Only run on user change — not on every cart update

    const handleOrder = async () => {
        if (!user) {
            notify('Please login to place an order', false);
            router.push('/login?redirect=/checkout');
            return;
        }
        if (isEmpty) {
            notify('Your cart is empty', false);
            router.push('/cart');
            return;
        }
        if (addresses.length === 0) {
            notify('Please add a delivery address first', false);
            return;
        }

        setLoading(true);

        // NOTE: Backend fetches cart from DB directly (secure — never trust frontend totals).
        // We only send address and paymentMethod. Backend validates everything else.
        const orderData = {
            address:       addresses[seladdress],
            paymentMethod,
        };

        console.log('[Checkout] Sending order:', {
            url:           `${process.env.NEXT_PUBLIC_API_BASE_URL}order/place`,
            method:        'POST',
            paymentMethod,
            addressFields: Object.keys(addresses[seladdress] || {}),
        });

        try {
            const response = await client.post('order/place', orderData);
            console.log('[Checkout] Response:', response.data);

            if (!response.data.success) {
                notify(response.data.message || response.data.msg || 'Order failed. Please try again.', false);
                return;
            }

            if (paymentMethod === 'cod') {
                dispatch(emptycart());
                try { await client.delete('cart/clear'); } catch (_) { }
                notify('Order placed successfully!', true);
                router.push(`/thank-you/${response.data.order_id}`);

            } else {
                // Store address reference to pass to /verify after payment
                const orderAddress = addresses[seladdress]

                const options = {
                    key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_API,
                    amount:      response.data.amount,        // paise from backend
                    currency:    response.data.currency || 'INR',
                    name:        'SwooTechMart',
                    description: 'Order Payment',
                    order_id:    response.data.payment_order_id,
                    handler: async (razorpayResponse) => {
                        // Payment succeeded — NOW verify and create DB order
                        try {
                            const verifyRes = await client.post('order/verify', {
                                razorpay_order_id:   razorpayResponse.razorpay_order_id,
                                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                                razorpay_signature:  razorpayResponse.razorpay_signature,
                                address:             orderAddress,   // needed to create the DB order
                                paymentMethod:       'online',
                            });
                            if (verifyRes.data.success) {
                                dispatch(emptycart());
                                try { await client.delete('cart/clear'); } catch (_) { }
                                notify('Payment successful! Order confirmed.', true);
                                router.push(`/thank-you/${verifyRes.data.orderId}`);
                            } else {
                                notify(verifyRes.data.message || 'Payment verification failed.', false);
                                setLoading(false);
                            }
                        } catch (err) {
                            console.error('[Checkout] Verify error:', err);
                            const msg = err?.response?.data?.message || 'Payment verification error. Contact support.';
                            notify(msg, false);
                            setLoading(false);
                        }
                    },
                    prefill: {
                        name:    user.name ?? '',
                        email:   user.email ?? '',
                        contact: orderAddress?.mobile ?? '',
                    },
                    theme: { color: '#01A49E' },
                    modal: {
                        // User closed Razorpay without paying — no DB order was created, nothing to undo
                        ondismiss: () => {
                            notify('Payment cancelled. No order was placed.', false);
                            setLoading(false);
                        }
                    }
                };
                const razorpayInstance = new Razorpay(options);
                razorpayInstance.open();
                // Keep loading=true until handler or ondismiss fires
                return;
            }

        } catch (error) {
            // Detailed error logging so we can see exact failure cause
            console.error('[Checkout] Order error:', {
                message:  error.message,
                code:     error.code,
                status:   error?.response?.status,
                data:     error?.response?.data,
                config:   {
                    url:      error?.config?.url,
                    baseURL:  error?.config?.baseURL,
                    method:   error?.config?.method,
                    headers:  {
                        Authorization: error?.config?.headers?.Authorization ? 'Bearer [set]' : 'not set',
                        'Content-Type': error?.config?.headers?.['Content-Type'],
                    }
                }
            });

            let msg = 'Something went wrong. Please try again.';

            if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
                msg = 'Cannot connect to server. Please check your internet connection or try again in a moment.';
            } else if (error.code === 'ECONNABORTED') {
                msg = 'Request timed out. The server may be starting up — please wait 30 seconds and try again.';
            } else if (error?.response?.status === 401) {
                msg = 'Your session has expired. Please login again.';
                router.push('/login?redirect=/checkout');
            } else if (error?.response?.status === 400) {
                const serverMsg = error?.response?.data?.message || error?.response?.data?.msg || '';
                if (serverMsg.toLowerCase().includes('cart')) {
                    // Cart not synced to DB — this can happen if user added items offline
                    msg = 'Your cart could not be loaded. Please go back to cart and try again.';
                } else {
                    msg = serverMsg || 'Invalid order data. Please check your address.';
                }
            } else if (error?.response?.status >= 500) {
                msg = 'Server error. Please try again in a moment.';
            } else {
                msg = error?.response?.data?.message || error?.response?.data?.msg || msg;
            }

            notify(msg, false);
        } finally {
            setLoading(false);
        }
    };

    if (isEmpty || !user) return null;

    // Format rupee amount — unicode to avoid encoding issues
    const formatRupees = (amount) => `\u20B9${Number(amount || 0).toLocaleString('en-IN')}`;

    return (
        <div className="container-app py-6 sm:py-8">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-6">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* LEFT SECTION */}
                <div className="lg:col-span-2 space-y-5">

                    {/* ADDRESS */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-base sm:text-lg font-black text-gray-800">Select Address</h2>
                            <Link href="/profile"
                                className="bg-[#01A49E] hover:bg-[#01857f] text-white text-xs sm:text-sm px-3 py-1.5 rounded-lg transition font-semibold">
                                + Add New
                            </Link>
                        </div>

                        {addresses.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <p className="mb-3 text-sm">No addresses saved yet.</p>
                                <Link href="/profile" className="text-[#01A49E] font-semibold hover:underline text-sm">
                                    Go to Profile to add address &rarr;
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {addresses.map((addr, index) => (
                                    <div key={index} onClick={() => setSeladdress(index)}
                                        className={`border rounded-xl p-4 cursor-pointer transition flex gap-3 items-start text-sm
                                            ${seladdress === index ? 'border-[#01A49E] bg-teal-50' : 'border-gray-200 hover:border-[#01A49E]'}`}>
                                        <input type="radio" checked={seladdress === index}
                                            onChange={() => setSeladdress(index)}
                                            className="mt-1 accent-teal-500 shrink-0" />
                                        <div>
                                            <h3 className="font-bold text-gray-800">{addr.fullName}</h3>
                                            <p className="text-gray-500 mt-0.5">{addr.addressLine}, {addr.city}, {addr.state}</p>
                                            <p className="text-gray-400 text-xs mt-0.5">{addr.pincode} &middot; {addr.mobile}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* PAYMENT METHOD */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-base sm:text-lg font-black text-gray-800 mb-4">Payment Method</h2>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#01A49E] transition text-sm">
                                <input type="radio" name="payment" checked={paymentMethod === 'cod'}
                                    onChange={() => setPaymentMethod('cod')} className="accent-teal-500" />
                                <span className="text-gray-700 font-medium">Cash on Delivery</span>
                            </label>
                            <label className="flex items-center gap-3 border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#01A49E] transition text-sm">
                                <input type="radio" name="payment" checked={paymentMethod === 'online'}
                                    onChange={() => setPaymentMethod('online')} className="accent-teal-500" />
                                <span className="text-gray-700 font-medium">Online Payment (UPI / Card / Net Banking)</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* RIGHT — Order Summary */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 lg:sticky lg:top-24">
                    <h2 className="text-base sm:text-lg font-black text-gray-800 mb-4">Order Summary</h2>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Original Total</span>
                            <span>{formatRupees(cart.original_total)}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                            <span>You Save</span>
                            <span>{formatRupees((cart.original_total - cart.final_total) || 0)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                            <span>Shipping</span>
                            <span className="text-green-600">Free</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-4" />

                    <div className="flex justify-between font-black text-gray-900">
                        <span>Total</span>
                        <span className="text-[#01A49E]">{formatRupees(cart.final_total)}</span>
                    </div>

                    {/* Debug info — only visible in dev, helps diagnose network issues */}
                    {process.env.NODE_ENV === 'development' && (
                        <p className="text-[9px] text-gray-300 mt-2 break-all">
                            API: {process.env.NEXT_PUBLIC_API_BASE_URL}
                        </p>
                    )}

                    <button onClick={handleOrder}
                        disabled={loading || addresses.length === 0}
                        className="w-full mt-5 bg-[#01A49E] hover:bg-[#01857f] disabled:bg-teal-300 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm">
                        {loading
                            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                            : 'Place Order'}
                    </button>

                    {addresses.length === 0 && (
                        <p className="text-xs text-red-400 text-center mt-2">Add a delivery address to continue</p>
                    )}
                </div>
            </div>
        </div>
    );
}
