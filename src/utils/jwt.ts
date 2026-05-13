import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const signToken = (payload: any) => {
  return jwt.sign(payload, env.JWT_SECRET!, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET!);
};
