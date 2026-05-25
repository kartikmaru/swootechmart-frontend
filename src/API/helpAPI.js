import { client } from "@/utils/Helper";
import axios from "axios";

function fetchapi() {
    return (
        axios.get("https://dummyjson.com/products").then(
            (response) => {
                return (response.data.products)

            }
        ).catch(
            (error) => {
                console.log(error);

            }
        )
    )
}



async function getCategories(query = {}) {
    try {

        const filter = new URLSearchParams;
        if (query._id) filter.append("_id", query.id)
        if (query.limit) filter.append("limit", query.limit)
        if (query.is_home) filter.append("is_home", query.is_home)
        if (query.status) filter.append("status", query.status)
        if (query.is_popular) filter.append("is_popular", query.is_popular)
        if (query.is_top) filter.append("is_top", query.is_top)

        const response = await client.get(`category?${filter.toString()}`)
        if (response.data.success) {
            return response.data
        }
        else {
            throw new Error("API FAIL")
        }
    } catch (error) {
        console.log(error)
        // throw new Error("API FAIL")

    }

}


async function getBrands(query = {}) {
    try {

        const filter = new URLSearchParams;
        if (query._id) filter.append("_id", query.id)
        if (query.limit) filter.append("limit", query.limit)
        if (query.is_home) filter.append("is_home", query.is_home)
        if (query.status) filter.append("status", query.status)
        if (query.is_popular) filter.append("is_popular", query.is_popular)
        if (query.is_top) filter.append("is_top", query.is_top)

        const response = await client.get(`brand?${filter.toString()}`)
        if (response.data.success) {
            return response.data
        }
        else {
            throw new Error("API FAIL")
        }
    } catch (error) {
        throw new Error("API FAIL")
    }

}


async function getColors(query = {}) {
    try {

        const filter = new URLSearchParams;
        if (query._id) filter.append("_id", query.id)
        if (query.limit) filter.append("limit", query.limit)
        if (query.status) filter.append("status", query.status)

        const response = await client.get(`color?${filter.toString()}`)
        if (response.data.success) {
            return response.data
        }
        else {
            throw new Error("API FAIL")
        }
    } catch (error) {
        throw new Error("API FAIL")
    }

}


async function getProducts(query = {}) {
    try {

        const filter = new URLSearchParams
        if (query._id) filter.append("_id", query._id)
        if (query.status) filter.append("status", query.status)
        if (query.limit) filter.append("limit", query.limit)
        if (query.category_slug) {
            filter.append("category_slug", query.category_slug)
        }
        if (query.brand_slug) {
            filter.append("brand_slug", query.brand_slug)
        }

        if (query.color_slug) {
            filter.append("color_slug", query.color_slug)
        }

        if (query.min_price) filter.append("min_price", query.min_price);

        if (query.max_price) filter.append("max_price", query.max_price);

        if (query.sort) filter.append("sort", query.sort);

        const response = await client.get(`product?${filter.toString()}`)

        if (response.data.success) {
            return response.data
        }
        else {
            throw new Error("API FAIL")
        }
    } catch (error) {
        console.log(error)
        throw new Error("API FAIL")
    }

}

async function findProductById(id) {
    try {
        const response = await client.get(`product/${id}`)
        if (response.data.success) {
            return response.data
        }
        else {
            throw new Error("API FAIL")
        }
    } catch (error) {
        throw new Error("API FAIL")
    }
}

// async function getMe() {
//     try {

//         const cookieStore = await cookies()
//         let token = cookieStore.get("jwt")?.value ?? null

//         if (!token) {
//             return { user: null };
//         }
//         const response = await client.get("user/get", {
//             headers: {
//                 Authorization: token
//             }
//         })

//         if (!response.data.success) {
//             throw new Error(response.data.msg || "API FAIL")
//         }

//         return response.data

//     } catch (error) {
//         // throw new Error("API FAIL")
//         console.log(error,
//             "dfgdf "
//         )
//     }

// }


export { getCategories, fetchapi, getBrands, getColors, getProducts, findProductById }

