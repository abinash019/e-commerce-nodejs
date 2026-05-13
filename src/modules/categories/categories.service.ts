import { prisma } from "../../database/prisma.js";
import { AppError } from "../../common/errors/AppError.js";

export const createCategory = async (data: any) => {
  const existing = await prisma.category.findUnique({
    where: {
      slug: data.slug,
    },
  });

  if (existing) {
    throw new AppError("Category already exists", 400);
  }

  return prisma.category.create({
    data,
  });
};

export const getCategories = async () => {
  return prisma.category.findMany({
    include: {
      products: true,
    },
  });
};
