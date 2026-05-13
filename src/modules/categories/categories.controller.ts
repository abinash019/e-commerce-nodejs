import { Request, Response } from "express";
import * as categoryService from "./categories.service.js";

export const createCategory = async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body);

  res.status(201).json({
    success: true,
    data: category,
  });
};

export const getCategories = async (req: Request, res: Response) => {
  const categories = await categoryService.getCategories();

  res.json({
    success: true,
    data: categories,
  });
};
