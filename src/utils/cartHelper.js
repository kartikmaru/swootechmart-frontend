import { client } from './Helper'
import { addtocart, qtyChange, emptycart, removeItem, resetCart, loadUserCart } from '@/redux/features/CartSlice'

// ── IMPORTANT: Store consistency ──────────────────────────────────────────────
// All functions here receive `dispatch` as a parameter from the calling component.
// That dispatch comes from useDispatch() which hooks into ReduxProvider's store.
// We DO NOT import store.js directly — that would create a second store instance.
// This ensures cart state is consistent across the entire app.
// ─────────────────────────────────────────────────────────────────────────────

// ── logoutClearCart — call on every logout ────────────────────────────────────
// 1. Clears Redux cart state + localStorage immediately
// 2. Calls backend to clear DB cart (silently — 401 is expected post-logout)
export async function logoutClearCart(dispatch) {
    dispatch(resetCart())
    try {
        await client.delete('cart/clear')
    } catch (_) { /* 401 expected — silently ignore */ }
}

// ── syncAndLoadCart — call after login/register ───────────────────────────────
// 1. Clears any previous user's localStorage cart
// 2. Fetches this user's cart from backend
// 3. Loads it into Redux + localStorage
export async function syncAndLoadCart(dispatch) {
    // Clear previous user's local cart first
    if (typeof window !== 'undefined') {
        localStorage.removeItem('cart')
    }
    try {
        // Send empty items — we only want to GET, not merge old local data
        const cartRes = await client.post('cart/sync', {
            localCart: JSON.stringify({ items: [] })
        })
        const cartData = cartRes.data?.cart
        const baseUrl  = cartRes.data?.imageBaseUrl || ''

        const items = (cartData?.items || [])
            .filter(item => item?.productId)
            .map(item => {
                const p = item.productId
                return {
                    id:             p._id,
                    name:           p.name,
                    original_price: p.original_price,
                    final_price:    p.final_price,
                    discount:       p.discount,
                    price:          p.price,
                    stock:          p.stock,
                    qty:            item.qty,
                    thumbnail:      baseUrl + p.thumbnail,
                }
            })

        dispatch(loadUserCart(items))
    } catch (_) {
        // Non-critical — user can still shop with empty cart
        dispatch(loadUserCart([]))
    }
}

// ── Remove a single item completely from cart ─────────────────────────────────
// Used when user explicitly clicks "Remove" — removes regardless of qty
export function removeFromCartWithSync(dispatch, productId) {
    dispatch(removeItem({ id: productId }))
    client.delete('cart/remove', {
        data: { productId }
    }).catch(err => {
        if (err?.response?.status !== 401) {
            console.warn('Cart remove sync failed:', err?.response?.data?.message || err.message)
        }
    })
}

// ── Add to cart ───────────────────────────────────────────────────────────────
// 1. Redux dispatch (instant UI update)
// 2. DB save background me — cookie se user detect hoga
export async function addToCartWithSync(dispatch, payload) {
    dispatch(addtocart(payload))
    try {
        await client.post('cart/add_to_cart', {
            productId: payload.id,
            qty: payload.qty ?? 1,
        })
    } catch (err) {
        if (err?.response?.status !== 401) {
            console.warn('Cart add sync failed:', err?.response?.data?.message || err.message)
        }
    }
}

// ── Qty change (inc/dec) ──────────────────────────────────────────────────────
// Redux me qtyChange dispatch karo
// DB me bhi sync karo:
//   inc → PUT /cart/update { productId, qty: newQty }
//   dec → agar qty 1 thi toh DELETE /cart/remove
//         agar qty > 1 thi toh PUT /cart/update { productId, qty: newQty }
export function changeQtyWithSync(dispatch, payload, cartItems) {
    // Pehle Redux update
    dispatch(qtyChange(payload))

    // Background DB sync
    try {
        const item = cartItems?.find(i => i.id === payload.id)
        if (!item) return

        if (payload.flag === 'dec') {
            if (item.qty <= 1) {
                // Item remove ho jaayega Redux me, DB se bhi hata do
                client.delete('cart/remove', {
                    data: { productId: payload.id }
                }).catch(err => {
                    if (err?.response?.status !== 401) {
                        console.warn('Cart remove sync failed:', err?.response?.data?.message || err.message)
                    }
                })
            } else {
                // Qty kam karo
                client.put('cart/update', {
                    productId: payload.id,
                    qty: item.qty - 1
                }).catch(err => {
                    if (err?.response?.status !== 401) {
                        console.warn('Cart update sync failed:', err?.response?.data?.message || err.message)
                    }
                })
            }
        } else {
            // inc — qty badha do
            client.put('cart/update', {
                productId: payload.id,
                qty: item.qty + 1
            }).catch(err => {
                if (err?.response?.status !== 401) {
                    console.warn('Cart update sync failed:', err?.response?.data?.message || err.message)
                }
            })
        }
    } catch (e) {
        // silently ignore
    }
}

// ── Clear cart ────────────────────────────────────────────────────────────────
// Redux emptycart dispatch karo aur backend DB empty kro
export async function clearCartWithSync(dispatch) {
    dispatch(emptycart())
    try {
        await client.delete('cart/clear')
    } catch (err) {
        if (err?.response?.status !== 401) {
            console.warn('Cart clear sync failed:', err?.response?.data?.message || err.message)
        }
    }
}
