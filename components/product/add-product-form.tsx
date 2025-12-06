"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProduct } from "@/lib/action/product";
import { Toaster } from "@/components/ui/sonner";
import { ProductForm } from "./product-form";
import type { CategoryOption, ProductInput } from "@/lib/types";

interface Tag {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface AddProductFormProps {
  categories: CategoryOption[];
  tags: Tag[];
}

export function AddProductForm({ categories, tags }: AddProductFormProps) {
  const router = useRouter();

  const handleSubmit = async (data: ProductInput) => {
    const formData = new FormData();

    // Add all form fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (key === "tagIds" && Array.isArray(value)) {
        value.forEach((tagId) => formData.append("tagIds", tagId));
      } else if (value !== undefined && value !== null && value !== "") {
        formData.append(key, String(value));
      }
    });

    const result = await createProduct(formData);
    
    if (result?.success) {
      router.refresh();
    }
    
    return result;
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <ProductForm
        categories={categories}
        tags={tags}
        mode="add"
        onSubmit={handleSubmit}
        submitButtonText="Add product to inventory"
      />
    </>
  );
}
