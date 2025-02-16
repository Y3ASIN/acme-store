"use server";

import { prisma } from "../prisma";

import { unstable_cache as cache, revalidateTag } from "next/cache";

type ProductInput = {
  name: string;
  price: number;
  description: string;
  category: string;
  images?: string[];
};

export async function getProducts({page=1}) {
    const resultsPerPage = 5;
    const skip = (page-1) * resultsPerPage;

  try {
    const allProducts = await prisma.product.findMany({
      include: {
        images: true,
        reviews: true,
      },
      skip,
      take: resultsPerPage, 
    });
    const products = allProducts.map((product) => ({
      ...product,
      rating:
        Math.floor(
          product.reviews.reduce((acc, review) => acc + review.rating, 0) /
            product.reviews.length
        ) || 0,
      image: product.images[0]?.url,
    }));
    return products;
  } catch (error) {
    return []
  }
}

export async function createProduct(product: ProductInput) {
  try {
    const newProduct = await prisma.product.create({
      data: {
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        images: {
          create: product.images?.map((url: string) => ({ url })),
        },
      },
    });
    return newProduct;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Error creating product");
  }
}

async function _getProductById(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        reviews: true,
      },
    });
    return product;
  } catch (error) {
    return null;
  }
}

export const getProductById = cache(_getProductById, ["getProductById"], {
  tags: ["Product"],
  revalidate: 10,
});

export async function updateProduct(id: number, product: ProductInput) {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        images: {
          deleteMany: {},
          create: product.images?.map((url: string) => ({ url })),
        },
      },
    });
    revalidateTag("Product");
    return updatedProduct;
  } catch (error) {
    return null;
  }
}

export async function deleteProduct(id: number) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidateTag("Product");
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
}
