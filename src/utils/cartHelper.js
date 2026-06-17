import { client } from './Helper'
import { addtocart, qtyChange, emptycart } from '@/redux/features/CartSlice'

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
