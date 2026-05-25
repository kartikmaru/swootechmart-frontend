import { getMe } from '@/API/serverAPI'
import Profile from '@/components/user/profile/Profile'
import React from 'react'

export const dynamic = 'force-dynamic';

export default async function page() {
    const user = await getMe()
    return (
        <Profile user={user.user} />
    )
}
