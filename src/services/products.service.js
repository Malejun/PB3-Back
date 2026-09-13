import prisma from '../lib/prisma.js';

export function getAllProducts() {
  return prisma.product.findMany({
    orderBy: { name: 'asc' },
  });
}

export function createProduct({ name, description, price, category, image }) {
  return prisma.product.create({
    data: {
      name,
      description,
      price: Number(price),
      category,
      image: image || null,
    },
  });
}

export function updateProduct(id, { name, description, price, category, image }) {
  const data = {};
  if (name !== undefined) data.name = name;
  if (description !== undefined) data.description = description;
  if (price !== undefined) data.price = Number(price);
  if (category !== undefined) data.category = category;
  if (image !== undefined) data.image = image;

  return prisma.product.update({
    where: { id },
    data,
  });
}

export function deleteProduct(id) {
  return prisma.product.delete({
    where: { id },
  });
}
