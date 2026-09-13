import express from 'express';
import { getWishlistController, toggleWishlistController } from '../controllers/wishlist.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getWishlistController);
router.post('/toggle', authMiddleware, toggleWishlistController);

export default router;
