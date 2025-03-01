import type { Images, Product, Review } from "@prisma/client";

import Stars from "@/components/product/Stars";
import ImageDisplay from "@/components/product/ImageDisplay";

export interface ProductProps extends Product {
  images: Images[];
  reviews: Review[];
}

export default function Product({ product }: { product: ProductProps }) {
  if (!product) return <div>Product not found</div>;

  const averageRating =
    product.reviews.reduce((acc, review) => acc + review.rating, 0) /
    product.reviews.length;

  const imageUrls = product.images.map((image) => image.url);
  return (
    <div className="grid gap-6">
      <ImageDisplay images={imageUrls} />
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {product.description}
        </p>
        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold">${product.price}</span>
          <div className="flex items-center gap-0.5">
            <Stars rating={averageRating} />
          </div>
        </div>
      </div>
    </div>
  );
}
