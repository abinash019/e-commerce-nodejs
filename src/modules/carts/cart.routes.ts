import { Router } from "express";

import * as controller from "./cart.controller.js";

import { authMiddleware } from "../../middleware/auth.middleware.js";

import { validate } from "../../middleware/validate.middleware.js";

import { addToCartSchema } from "./cart.validation.js";

import { catchAsync } from "../../utils/catchAsync.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  validate(addToCartSchema),
  catchAsync(controller.addToCart),
);

router.get("/", authMiddleware, catchAsync(controller.getCart));

router.delete(
  "/:itemId",
  authMiddleware,
  catchAsync(controller.removeItemFromCart),
);
router.delete("/", authMiddleware, catchAsync(controller.clearCart));
router.patch("/:itemId", authMiddleware, catchAsync(controller.updateQuantity));

export default router;
