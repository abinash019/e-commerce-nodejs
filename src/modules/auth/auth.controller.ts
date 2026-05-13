import { Request, Response } from "express";
import * as authService from "./auth.service.js";

export const register = async (req: Request, res: Response) => {
  console.log("BODY:", req.body);

  const data = await authService.register(req.body);

  res.status(201).json({
    success: true,
    data,
  });
};

export const login = async (req: Request, res: Response) => {
  const data = await authService.login(req.body);

  res.json({
    success: true,
    data,
  });
};
