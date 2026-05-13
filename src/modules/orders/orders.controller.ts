import { Response } from "express";

import * as orderService from "./orders.service.js";

import { AuthRequest } from "../../middleware/auth.middleware.js";

export const createOrder = async (req: AuthRequest, res: Response) => {
  const order = await orderService.createOrder(req.user!.id);

  res.status(201).json({
    success: true,
    data: order,
  });
};
