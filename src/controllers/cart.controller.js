import { addItemToCart, getCartByUser, removeCartItem, checkoutCart, getUserOrders } from '../services/cart.service.js';

export async function getCartController(req, res, next) {
  try {
    const data = await getCartByUser(req.user.id);
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
}

export async function addCartItemController(req, res, next) {
  try {
    const { productId, quantity } = req.body;
    const data = await addItemToCart(req.user.id, productId, quantity);
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
}

export async function removeCartItemController(req, res, next) {
  try {
    const productId = req.params.productId || req.params.id || req.body?.productId || req.body?.id || req.query?.productId || req.query?.id;
    const data = await removeCartItem(req.user.id, productId);
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
}

export async function checkoutCartController(req, res, next) {
  try {
    const { order } = await checkoutCart(req.user.id);
    res.json({
      status: 'success',
      data: order,
      message: 'Checkout realizado con éxito',
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrdersController(req, res, next) {
  try {
    const data = await getUserOrders(req.user.id);
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
}
