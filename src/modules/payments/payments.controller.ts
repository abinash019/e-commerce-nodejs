import { Request, Response } from "express";

import * as paymentService from "./payments.service.js";

import Stripe from "stripe";

import { stripe } from "../../config/stripe.js";

import { env } from "../../config/env.js";

export const createPaymentIntent = async (req: Request, res: Response) => {
  const { orderId } = req.body;

  const payment = await paymentService.createPaymentIntent(orderId);

  res.json({
    success: true,
    data: payment,
  });
};

export const handleWebhook = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid signature",
    });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    const orderId = paymentIntent.metadata.orderId;

    await paymentService.handleSuccessfulPayment(orderId);
  }

  res.json({
    received: true,
  });
};
