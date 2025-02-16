import Link from "next/link";
import type { Images, Product, Review } from "@prisma/client";

import Stars from "@/components/product/Stars";

// type ProductWithRelations = Product & {
//   reviews: Review[];
//   images: Images[];
// };

export default function ProductResult({ product }: { product: any }) {

  return (
    <div className="bg-white rounded-lg shadow-sm dark:bg-gray-950 overflow-hidden">
      <Link className="block" href={`/product/view/${product.id}`}>
        <img
          src={product.image || "https://dummyimage.com/600x520/000/fff"}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <div className="flex items-center gap-1">
            <Stars rating={product.rating} />
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              {product.rating}
            </span>
          </div>
          <div className="text-lg font-bold">${product.price}</div>
        </div>
      </Link>
    </div>
  );
}
