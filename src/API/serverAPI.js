import { client } from "@/utils/Helper";
import { cookies } from "next/headers";

async function getMe() {
    try {

        const cookieStore = await cookies()
        let token = cookieStore.get("jwt")?.value ?? null

        if (!token) {
            return { user: null };
        }
        const response = await client.get("user/get", {
            headers: {
                Authorization: token
            }
        })

        if (!response.data.success) {
            throw new Error(response.data.msg || "API FAIL")
        }

        return response.data

    } catch (error) {
        // throw new Error("API FAIL")
        console.log(error,
            "dfgdf "
        )
    }

}

export { getMe }
