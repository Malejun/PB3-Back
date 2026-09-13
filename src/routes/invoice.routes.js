import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getOrderInvoiceController } from '../controllers/invoice.controller.js';

const router = express.Router();

router.get('/:orderId/pdf', authMiddleware, getOrderInvoiceController);

export default router;
