import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../database/prisma.js";
import { AppError } from "../../common/errors/AppError.js";
import { env } from "../../config/env.js";

export const register = async (data: any) => {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) throw new AppError("User already exists", 400);

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
    },
  });

  return user;
};

export const login = async (data: any) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) throw new AppError("User not found", 404);

  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) throw new AppError("Invalid credentials", 401);

  const token = jwt.sign({ userId: user.id }, env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return { user, token };
};
