import { getMe } from '@/API/serverAPI'
import Profile from '@/components/user/profile/Profile'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
    const userRes = await getMe()
    const user    = userRes?.user ?? null

    // If not logged in (getMe returned null), redirect to login
    // The proxy.js also does this but server-side redirect is more reliable
    if (!user) {
        redirect('/login?redirect=/profile')
    }

    return <Profile user={user} />
}
