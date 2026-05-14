import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: "USER" | "ADMIN";
  };
}

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET!) as any;

    req.user = {
      id: decoded.userId,
      role: decoded.role || "USER",
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
