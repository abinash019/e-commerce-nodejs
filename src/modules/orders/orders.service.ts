import { prisma } from "../../database/prisma.js";

import { AppError } from "../../common/errors/AppError.js";

export const createOrder = async (userId: string) => {
  return prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findUnique({
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

    if (!cart || cart.items.length === 0) {
      throw new AppError("Cart is empty", 400);
    }

    // validate stock
    for (const item of cart.items) {
      const stock = item.variant?.stock || item.product.stock;

      if (stock < item.quantity) {
        throw new AppError(`${item.product.name} out of stock`, 400);
      }
    }

    // calculate total
    const totalAmount = cart.items.reduce((acc, item) => {
      const price = item.variant?.price || item.product.price;

      return acc + price * item.quantity;
    }, 0);

    // create order
    const order = await tx.order.create({
      data: {
        userId,
        totalAmount,

        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.variant?.price || item.product.price,
          })),
        },
      },

      include: {
        items: true,
      },
    });

    // decrement inventory
    for (const item of cart.items) {
      if (item.variantId) {
        await tx.productVariant.update({
          where: {
            id: item.variantId,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      } else {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
    }

    // clear cart
    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return order;
  });
};
