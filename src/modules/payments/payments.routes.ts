import express from "express";
import * as controller from "./payments.controller.js";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { catchAsync } from "../../utils/catchAsync.js";

const router = express.Router();

// Payment intent (normal JSON)
router.post(
  "/intent",
  authMiddleware,
  catchAsync(controller.createPaymentIntent),
);

// Webhook (RAW BODY ONLY HERE)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  controller.handleWebhook,
);

export default router;
