// app/thank-you/[id]/page.jsx

import ThankYouPage from "@/components/user/thankyou/ThnakYou"

export default async function Page({ params }) {

    const { id } = await params

    return <ThankYouPage orderId={id} />

}