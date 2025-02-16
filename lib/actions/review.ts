"use server";

import { prisma } from "../prisma";

import { revalidateTag } from "next/cache";

type ReviewInput = {
  name: string;
  rating: number;
  content: string;
  productId: number;
};

export async function createReview(review: ReviewInput) {
  try {
    const newReview = prisma.review.create({
      data: {
        name: review.name,
        rating: review.rating,
        content: review.content,
        product: {
          connect: {
            id: review.productId,
          },
        },
      },
    });
    revalidateTag("Product");
    return newReview;
  } catch (err) {
    console.error("Error creating review:", err);
    throw new Error("Error creating review");
  }
}
