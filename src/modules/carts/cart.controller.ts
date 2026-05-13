import { Response } from "express";

import * as cartService from "./cart.service.js";

import { AuthRequest } from "../../middleware/auth.middleware.js";

export const addToCart = async (req: AuthRequest, res: Response) => {
  console.log("BODY:", req.body);
  const item = await cartService.addToCart(req.user!.id, req.body);

  res.status(201).json({
    success: true,
    data: item,
  });
};

export const getCart = async (req: AuthRequest, res: Response) => {
  const cart = await cartService.getCart(req.user!.id);

  res.json({
    success: true,
    data: cart,
  });
};

export const updateQuantity = async (req: AuthRequest, res: Response) => {
  const { itemsId } = req.params;
  const itemId = String(itemsId);

  const { quantity } = req.body;

  const item = await cartService.updateQuantity(itemId, quantity);

  res.json({
    success: true,
    data: item,
  });
};

export const removeItemFromCart = async (req: AuthRequest, res: Response) => {
  const { itemsId } = req.params;
  const itemId = String(itemsId);

  await cartService.removeItemFromCart(itemId);

  res.json({
    success: true,
    data: null,
  });
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  await cartService.clearCart(req.user!.id);

  res.json({
    success: true,
    data: null,
  });
};
