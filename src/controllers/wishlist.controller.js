import {
  getWishlistByUser,
  toggleWishlistItem,
} from "../services/wishlist.service.js"

export async function getWishlistController(req, res, next) {
  try {
    const data = await getWishlistByUser(req.user.id)
    res.json({ ok: true, data })
  } catch (error) {
    next(error)
  }
}

export async function toggleWishlistController(req, res, next) {
  try {
    const data = await toggleWishlistItem(req.user.id, req.body.productId)
    res.json({ ok: true, data })
  } catch (error) {
    next(error)
  }
}
