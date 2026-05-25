'use client';

export default function ThankYouPage({ orderId }) {
    
    console.log(orderId)

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-10 rounded-2xl shadow text-center">

                <h1 className="text-3xl font-bold text-green-600 mb-4">
                    Order Placed Successfully
                </h1>

                <p className="text-gray-600 mb-2">
                    Your Order ID is:
                </p>

                <h2 className="text-2xl font-semibold text-teal-600">
                    #{orderId}
                </h2>

            </div>

        </div>
    );
}