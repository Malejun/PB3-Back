import prisma from '../lib/prisma.js';
import { generateOrderInvoicePdf } from '../services/invoice.service.js';

export async function getOrderInvoiceController(req, res, next) {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      const error = new Error('Pedido no encontrado');
      error.status = 404;
      throw error;
    }

    if (order.userId !== req.user.id) {
      const error = new Error('No tienes permisos para acceder a esta factura');
      error.status = 403;
      throw error;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { email: true },
    });

    const productIds = order.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((product) => [product.id, product]));

    const pdfBuffer = await generateOrderInvoicePdf({
      order,
      user,
      items: order.items,
      productMap,
      companyName: process.env.COMPANY_NAME || 'Mi Tienda',
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="factura-${order.id}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
}
