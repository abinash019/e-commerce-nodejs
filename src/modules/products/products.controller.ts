import { Request, Response } from "express";
import * as productService from "./products.service.js";

export const createProduct = async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.body);

  res.status(201).json({
    success: true,
    data: product,
  });
};

export const getProducts = async (req: Request, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);

  const products = await productService.getProducts(page, limit);

  res.json({
    success: true,
    data: products,
  });
};

export const getProductById = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const product = await productService.getProductById(id);

  res.json({
    success: true,
    data: product,
  });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  await productService.deleteProduct(id);

  res.json({
    success: true,
    message: "Deleted successfully",
  });
};
