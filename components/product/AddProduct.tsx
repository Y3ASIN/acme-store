"use client";

import ImageSelect from "./ImageSelect";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { toast } from "react-toastify";
import { Images, Product, Review } from "@prisma/client";
import { useRouter } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createProduct, updateProduct } from "@/lib/actions/product";

export const revalidate = 1;

export interface ProductProps extends Product {
  id: number;
  reviews: Review[];
  images: Images[];
}

export default function AddProduct({
  product,
  edit,
  id,
}: {
  edit?: boolean;
  id?: string;
  product?: ProductProps;
}) {
  const router = useRouter();
  const title = edit ? "Edit Product " + id : "Add Product";
  const subText = edit
    ? "Update the details of your product here."
    : "Add a new product to your store.";

  // TODO add more field to the product

  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [description, setDescription] = useState(product?.description || "");
  const [category, setCategory] = useState(product?.category || "");
  const [images, setImages] = useState<string[]>(
    product?.images.map((i) => i.url) || []
  );

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (edit && product) {
      const updatedProduct = await updateProduct(product.id, {
        name,
        price,
        description,
        category,
        images,
      });
      if (updatedProduct) {
        toast.success("Product updated successfully");
        router.push(`/product/view/${updatedProduct.id}`);
      }
    } else {
      const newProduct = await createProduct({
        name,
        category,
        price,
        description,
        images,
      });
      if (newProduct) {
        toast.success("Product created successfully");
        router.push(`/product/view/${newProduct.id}`);
      }
    }
  };

  return (
    <div className="grid min-h-screen w-full max-w-4xl mx-auto px-4 md:px-6 py-20 md:py-24 gap-8">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-gray-500 dark:text-gray-400">{subText}</p>
        </div>
        <div className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
                placeholder="Product Name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(value) => setCategory(value)}
                defaultValue={category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              id="price"
              type="number"
              placeholder="Price"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="description"
              placeholder="Describe your product"
              rows={5}
            />
          </div>
          <ImageSelect onChange={(value) => setImages(value)} />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
