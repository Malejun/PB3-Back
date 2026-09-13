import express from 'express';
import { 
  getProductsController, 
  createProductController, 
  updateProductController, 
  deleteProductController,
  uploadImageController
} from '../controllers/products.controller.js';
import { authMiddleware, requireAdmin } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', getProductsController);
router.post('/upload', authMiddleware, requireAdmin, upload.single('image'), uploadImageController);
router.post('/', authMiddleware, requireAdmin, upload.single('image'), createProductController);
router.put('/:id', authMiddleware, requireAdmin, upload.single('image'), updateProductController);
router.delete('/:id', authMiddleware, requireAdmin, deleteProductController);

export default router;
