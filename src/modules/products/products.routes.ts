import { Router } from "express";
import * as controller from "./products.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { catchAsync } from "../../utils/catchAsync.js";

const router = Router();

// public
router.get("/", catchAsync(controller.getProducts));
router.get("/:id", catchAsync(controller.getProductById));

// admin protected
router.post("/", authMiddleware, catchAsync(controller.createProduct));
router.delete("/:id", authMiddleware, catchAsync(controller.deleteProduct));

export default router;
