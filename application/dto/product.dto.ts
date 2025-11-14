// Data Transfer Objects for Product operations
import { z } from "zod";

export const ProductCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return undefined;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    }),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  model: z.string().optional(),
  sku: z.string().optional(),
  quantity: z.coerce.number().int().min(0, "Quantity must be non-negative"),
  lowStockAt: z.coerce.number().int().min(0).optional(),
  condition: z.string().default("new"),
  location: z.string().optional(),
  price: z.coerce.number().nonnegative("Price must be non-negative"),
  specs: z.string().optional(),
  compatibility: z.string().optional(),
  supplier: z.string().optional(),
  warrantyMonths: z.coerce.number().int().min(0).optional(),
  notes: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export type ProductCreateInput = z.infer<typeof ProductCreateSchema>;

export interface ProductCreateResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export interface ProductUpdateResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export interface ProductDeleteResult {
  success: boolean;
  message: string;
}

export interface StockAdjustmentResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

