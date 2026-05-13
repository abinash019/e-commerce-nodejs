import express, { Router } from "express";

import * as controller from "./payments.controller.js";

import { authMiddleware } from "../../middleware/auth.middleware.js";

import { catchAsync } from "../../utils/catchAsync.js";

const router = Router();

router.post(
  "/intent",
  authMiddleware,
  catchAsync(controller.createPaymentIntent),
);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  controller.handleWebhook,
);

export default router;
