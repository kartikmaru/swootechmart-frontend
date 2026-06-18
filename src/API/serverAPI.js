import { client } from "@/utils/Helper";
import { cookies } from "next/headers";

async function getMe() {
    try {
        const cookieStore = await cookies()
        let token = cookieStore.get("jwt")?.value ?? null

        // Cookie nahi mili (cross-origin deployed env)
        if (!token) {
            return { user: null };
        }

        const response = await client.get("User/get", {
            headers: {
                Authorization: token
            }
        })

        if (!response.data.success) {
            throw new Error(response.data.msg || "API FAIL")
        }

        return response.data

    } catch (error) {
        return { user: null }
    }
}

export { getMe }
