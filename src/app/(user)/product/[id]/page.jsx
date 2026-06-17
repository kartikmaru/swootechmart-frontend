// app/(user)/product/[id]/page.jsx  — Server Component
//
// 🧠 LOGIC EXPLANATION:
// 1. Next.js Dynamic Route  → URL me [id] ek variable hai
//    /product/abc123  →  params.id = "abc123"
//
// 2. Server Component  → ye page server pe render hota hai
//    findProductById(id) directly call hota hai, koi useEffect nahi
//
// 3. Data props me jaata hai  → ProductDetailClient ko pass kiya
//    Client component me interactive features handle hoti hain

import { findProductById } from '@/API/helpAPI'
import { notFound } from 'next/navigation'
import ProductDetailClient from '@/components/user/product/ProductDetailClient'

export const dynamic = 'force-dynamic'

export default async function ProductDetailPage({ params }) {

    // params.id = URL se nikala hua product ID
    // e.g. /product/6a15ab66ba1bf8f5b18e6f79 → id = "6a15ab66ba1bf8f5b18e6f79"
    const { id } = await params

    let product = null
    let meta    = null

    try {
        const res = await findProductById(id)
        product   = res.data
        meta      = res.meta
    } catch {
        notFound() // 404 page dikhao agar product nahi mila
    }

    if (!product) notFound()

    // imageBaseUrl server se milta hai — "http://localhost:5000/product/other/"
    // Thumbnail ka base alag hota hai, so adjust karo
    const imageBaseUrl      = meta?.imageBaseUrl || ''             // other/ images
    const thumbBaseUrl      = imageBaseUrl.replace('/other/', '/') // thumbnail

    return (
        <ProductDetailClient
            product={product}
            imageBaseUrl={imageBaseUrl}
            thumbBaseUrl={thumbBaseUrl}
        />
    )
}
