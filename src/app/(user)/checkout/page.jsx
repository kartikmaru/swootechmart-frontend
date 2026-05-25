import { getMe } from '@/API/serverAPI'
import Checkout from '@/components/user/checkout/checkout'
import React from 'react'

export default async function page() {

    const userData = await getMe()

    return (
        <Checkout user={userData.user} />
    )
}
