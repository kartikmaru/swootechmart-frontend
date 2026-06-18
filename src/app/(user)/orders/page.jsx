import { getMe } from '@/API/serverAPI'
import { redirect } from 'next/navigation'
import OrdersClient from '@/components/user/orders/OrdersClient'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
    // Auth check — unauthenticated user ko login pe redirect
    const userRes = await getMe()
    if (!userRes?.user) {
        redirect('/login')
    }

    return <OrdersClient />
}
