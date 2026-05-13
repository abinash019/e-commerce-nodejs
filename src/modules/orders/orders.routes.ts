import { Router } from "express";

import * as controller from "./orders.controller.js";

import { authMiddleware } from "../../middleware/auth.middleware.js";

import { catchAsync } from "../../utils/catchAsync.js";

const router = Router();

router.post("/checkout", authMiddleware, catchAsync(controller.createOrder));

export default router;
