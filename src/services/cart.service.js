import prisma from "../lib/prisma.js"

export async function getCartByUser(userId) {
  return prisma.cartItem.findMany({
    where: { userId },
    orderBy: { productId: "asc" },
  })
}

export async function addItemToCart(userId, productId, quantity) {
  const targetId = String(productId)
  const parsedQuantity = Number(quantity)

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      userId,
      OR: [
        { productId: targetId },
        { id: targetId },
      ],
    },
  })

  if (existingItem) {
    const newQuantity = existingItem.quantity + parsedQuantity

    if (newQuantity <= 0 || parsedQuantity === 0) {
      await prisma.cartItem.delete({
        where: { id: existingItem.id },
      })
    } else {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      })
    }
  } else if (parsedQuantity > 0) {
    await prisma.cartItem.create({
      data: {
        userId,
        productId: targetId,
        quantity: parsedQuantity,
      },
    })
  }

  return getCartByUser(userId)
}

export async function removeCartItem(userId, productIdOrId) {
  if (!productIdOrId) {
    return getCartByUser(userId)
  }

  const targetId = String(productIdOrId)

  await prisma.cartItem.deleteMany({
    where: {
      userId,
      OR: [
        { productId: targetId },
        { id: targetId },
      ],
    },
  })

  return getCartByUser(userId)
}

export async function checkoutCart(userId) {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
  })

  if (!cartItems || cartItems.length === 0) {
    const error = new Error("El carrito está vacío")
    error.status = 400
    throw error
  }

  const productIds = cartItems.map((item) => item.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  })

  const productMap = new Map(products.map((p) => [p.id, p]))

  let total = 0
  const orderItemsData = cartItems.map((item) => {
    const product = productMap.get(item.productId)
    const price = product ? product.price : 0
    total += price * item.quantity
    return {
      productId: item.productId,
      quantity: item.quantity,
      price,
    }
  })

  const order = await prisma.order.create({
    data: {
      userId,
      total,
      status: "COMPLETED",
      items: {
        create: orderItemsData,
      },
    },
    include: {
      items: true,
    },
  })

  await prisma.cartItem.deleteMany({
    where: { userId },
  })

  return {
    order,
    cart: [],
  }
}

export async function getUserOrders(userId) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: true,
    },
    orderBy: { createdAt: "desc" },
  })
}
