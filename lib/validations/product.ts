/**
 * Product validation schemas using Zod
 */

import { z } from "zod";

export const ProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(200, "Product name must be 200 characters or fewer"),

  sku: z
    .string()
    .trim()
    .max(100, "SKU must be 100 characters or fewer")
    .optional(),

  categoryId: z.string().optional(),

  manufacturer: z
    .string()
    .trim()
    .max(100, "Manufacturer must be 100 characters or fewer")
    .optional(),

  model: z
    .string()
    .trim()
    .max(100, "Model must be 100 characters or fewer")
    .optional(),

  condition: z.enum(["new", "used", "refurbished", "for-parts"]).optional(),

  price: z
    .number()
    .nonnegative("Price must be 0 or greater")
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format")),

  quantity: z.number().int().nonnegative("Quantity must be 0 or greater"),

  lowStockAt: z
    .number()
    .int()
    .nonnegative("Low stock threshold must be 0 or greater")
    .optional(),

  supplier: z
    .string()
    .trim()
    .max(100, "Supplier must be 100 characters or fewer")
    .optional(),

  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),

  warrantyMonths: z
    .number()
    .int()
    .nonnegative("Warranty months must be 0 or greater")
    .optional(),

  location: z
    .string()
    .trim()
    .max(200, "Location must be 200 characters or fewer")
    .optional(),

  specs: z
    .string()
    .trim()
    .max(2000, "Specs must be 2000 characters or fewer")
    .optional(),

  compatibility: z
    .string()
    .trim()
    .max(1000, "Compatibility must be 1000 characters or fewer")
    .optional(),

  notes: z
    .string()
    .trim()
    .max(2000, "Notes must be 2000 characters or fewer")
    .optional(),

  tagIds: z.array(z.string()).optional(),
});

export type ProductInput = z.infer<typeof ProductSchema>;
