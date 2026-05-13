import { prisma } from "../../database/prisma.js";

import { stripe } from "../../config/stripe.js";

import { AppError } from "../../common/errors/AppError.js";

export const createPaymentIntent = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalAmount * 100),

    currency: "usd",

    metadata: {
      orderId: order.id,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
  };
};
export const handleSuccessfulPayment = async (orderId: string) => {
  await prisma.order.update({
    where: {
      id: orderId,
    },

    data: {
      paymentStatus: "PAID",
      status: "PROCESSING",
    },
  });
};
