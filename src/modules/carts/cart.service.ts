import { prisma } from "../../database/prisma.js";
import { AppError } from "../../common/errors/AppError.js";

export const addToCart = async (userId: string, data: any) => {
  console.log("USER ID:", userId);
  const product = await prisma.product.findUnique({
    where: {
      id: data.productId,
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (product.stock < data.quantity) {
    throw new AppError("Insufficient stock", 400);
  }

  let cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
      },
    });
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId: data.productId,
      variantId: data.variantId || null,
    },
  });

  if (existingItem) {
    return prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: existingItem.quantity + data.quantity,
      },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: data.productId,
      variantId: data.variantId,
      quantity: data.quantity,
    },
  });
};

export const getCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  if (!cart) {
    return {
      items: [],
      total: 0,
    };
  }

  const total = cart.items.reduce((acc, item) => {
    const price = item.variant?.price || item.product.price;

    return acc + price * item.quantity;
  }, 0);

  return {
    ...cart,
    total,
  };
};

export const updateQuantity = async (itemId: string, quantity: number) => {
  const item = await prisma.cartItem.findUnique({
    where: {
      id: itemId,
    },
    include: {
      product: true,
    },
  });

  if (!item) {
    throw new AppError("Cart item not found", 404);
  }

  if (item.product.stock < quantity) {
    throw new AppError("Insufficient stock", 400);
  }

  return prisma.cartItem.update({
    where: {
      id: itemId,
    },
    data: {
      quantity,
    },
  });
};

export const removeItemFromCart = async (itemId: string) => {
  return prisma.cartItem.delete({
    where: {
      id: itemId,
    },
  });
};

export const clearCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
  });

  if (!cart) return;

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });
};
