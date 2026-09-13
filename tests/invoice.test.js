import test from 'node:test';
import assert from 'node:assert/strict';

import { generateOrderInvoicePdf } from '../src/services/invoice.service.js';

test('generateOrderInvoicePdf returns a valid PDF with invoice details', async () => {
  const order = {
    id: 'ord_123456',
    total: 3200,
    createdAt: '2026-08-31T12:00:00.000Z',
    status: 'COMPLETED',
  };

  const user = {
    email: 'juan.perez@example.com',
  };

  const items = [
    { productId: 'prod_1', quantity: 2, price: 1000 },
    { productId: 'prod_2', quantity: 1, price: 1200 },
  ];

  const productMap = new Map([
    ['prod_1', { id: 'prod_1', name: 'Camiseta' }],
    ['prod_2', { id: 'prod_2', name: 'Pantalón' }],
  ]);

  const pdf = await generateOrderInvoicePdf({
    order,
    user,
    items,
    productMap,
    companyName: 'Mi Tienda',
  });

  assert.ok(Buffer.isBuffer(pdf), 'should return a Buffer');
  assert.ok(pdf.length > 0, 'should contain PDF content');
  assert.match(pdf.toString('latin1'), /%PDF/, 'should be a PDF document');
  assert.match(pdf.toString('latin1'), /FACTURA/i, 'should include invoice title');
  assert.match(pdf.toString('latin1'), /juan\.perez@example\.com/i, 'should include customer email');
  assert.match(pdf.toString('latin1'), /3200/i, 'should include the total amount');
});
