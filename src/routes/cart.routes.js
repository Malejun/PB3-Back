import express from 'express';
import { 
  addCartItemController, 
  getCartController, 
  removeCartItemController,
  checkoutCartController,
  getOrdersController
} from '../controllers/cart.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getCartController);
router.get('/orders', authMiddleware, getOrdersController);
router.post('/items', authMiddleware, addCartItemController);
router.post('/checkout', authMiddleware, checkoutCartController);
router.post('/clear', authMiddleware, checkoutCartController);
router.delete('/items/:productId', authMiddleware, removeCartItemController);
router.delete('/items', authMiddleware, removeCartItemController);
router.delete('/:productId', authMiddleware, removeCartItemController);

export default router;
