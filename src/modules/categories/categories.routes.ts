import { Router } from "express";

import * as controller from "./categories.controller.js";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { adminMiddleware } from "../../middleware/admin.middleware.js";

import { validate } from "../../middleware/validate.middleware.js";
import { createCategorySchema } from "./categories.validation.js";

import { catchAsync } from "../../utils/catchAsync.js";

const router = Router();

router.get("/", catchAsync(controller.getCategories));

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validate(createCategorySchema),
  catchAsync(controller.createCategory),
);

export default router;
