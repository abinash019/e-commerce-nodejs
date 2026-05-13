import { AppError } from "../../common/errors/AppError.js";
import { prisma } from "../../database/prisma.js";

export const createProduct = async (data: any) => {
  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      stock: data.stock,
      categoryId: data.categoryId,
      images: data.images ?? [],
    },
  });

  return product;
};

export const getProducts = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const products = await prisma.product.findMany({
    skip,
    take: limit,
    include: {
      category: true,
    },
  });

  const total = await prisma.product.count();

  return {
    data: products,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) throw new AppError("Product not found", 404);

  return product;
};

export const deleteProduct = async (id: string) => {
  return prisma.product.delete({
    where: { id },
  });
};
