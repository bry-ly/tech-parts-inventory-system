use client

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTransition } from "react";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductSchema } from "@/lib/validations/product";
import type { ProductInput } from "@/lib/validations/product";
import type { CategoryOption } from "@/lib/types";
import { ProductFormDetails } from "./product-form-details";
import { ProductFormInventory } from "./product-form-inventory";
import { ProductFormSupply } from "./product-form-supply";
import { ProductFormMedia } from "./product-form-media";

interface Tag {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface ProductFormProps {
  categories: CategoryOption[];
  tags: Tag[];
  defaultValues?: Partial<ProductInput>;
  onSubmit: (data: ProductInput) => Promise<{ success?: boolean; message?: string; errors?: Record<string, string[]> }>;
  mode?: "add" | "edit";
  submitButtonText?: string;
}

export function ProductForm({
  categories,
  tags,
  defaultValues,
  onSubmit,
  mode = "add",
  submitButtonText,
}: ProductFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProductInput>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      manufacturer: "",
      model: "",
      sku: "",
      quantity: 0,
      lowStockAt: undefined,
      condition: "new",
      location: "",
      price: 0,
      specs: "",
      compatibility: "",
      supplier: "",
      warrantyMonths: undefined,
      notes: "",
      imageUrl: "",
      tagIds: [],
      ...defaultValues,
    },
  });

  const selectedCategory = categories.find(
    (category) => category.id === form.watch("categoryId")
  );

  const handleSubmit = (data: ProductInput) => {
    startTransition(async () => {
      const result = await onSubmit(data);
      
      if (result?.success) {
        toast.success(result.message ?? `Product ${mode === "add" ? "added" : "updated"} successfully`);
      } else {
        if (result?.errors) {
          // Handle field-specific errors
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages.length > 0) {
              form.setError(field as keyof ProductInput, {
                message: messages[0],
              });
            }
          });
        }
        toast.error(result?.message ?? `Failed to ${mode === "add" ? "add" : "update"} product`);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Product details</CardTitle>
            <CardDescription>
              Provide Product Description & Specifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductFormDetails categories={categories} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Inventory information</CardTitle>
            <CardDescription>
              Set stock levels, pricing, and inventory thresholds.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductFormInventory />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Supply & warranty</CardTitle>
            <CardDescription>
              Track vendor and service coverage information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductFormSupply />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Media & additional notes</CardTitle>
            <CardDescription>
              Attach references and internal remarks for your team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductFormMedia tags={tags} />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            type="submit"
            size="lg"
            className="flex-1"
            disabled={isPending}
          >
            {isPending
              ? mode === "add" ? "Adding..." : "Updating..."
              : submitButtonText || `${mode === "add" ? "Add product to inventory" : "Update product"}`
            }
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            disabled={isPending}
            onClick={() => form.reset()}
          >
            Clear form
          </Button>
        </div>
      </form>
    </Form>
  );
}