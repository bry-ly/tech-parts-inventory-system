/**
 * Product validation schemas using Zod
 * Enhanced with preprocessors for form data handling
 */

import { z } from "zod";

/**
 * Helper to preprocess string to undefined if empty
 */
const emptyStringToUndefined = z
  .string()
  .optional()
  .transform((val) => {
    if (!val || val.trim() === "") return undefined;
    return val.trim();
  });

/**
 * Helper to preprocess numeric fields (handles string coercion from FormData)
 */
const numericField = z.preprocess((val) => {
  if (val === undefined || val === null || val === "") return undefined;
  const parsed = Number(val);
  return isNaN(parsed) ? undefined : parsed;
}, z.number().optional());

/**
 * Main product schema with preprocessors for FormData handling
 */
export const ProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(200, "Product name must be 200 characters or fewer"),

  sku: emptyStringToUndefined.refine(
    (val) => !val || val.length <= 100,
    "SKU must be 100 characters or fewer"
  ),

  categoryId: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return undefined;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    }),

  manufacturer: z
    .string()
    .trim()
    .min(1, "Manufacturer is required")
    .max(100, "Manufacturer must be 100 characters or fewer"),

  model: emptyStringToUndefined.refine(
    (val) => !val || val.length <= 100,
    "Model must be 100 characters or fewer"
  ),

  condition: z
    .enum(["new", "used", "refurbished", "for-parts"])
    .default("new"),

  price: z.coerce
    .number()
    .nonnegative("Price must be 0 or greater")
    .refine((val) => val >= 0, "Price must be non-negative"),

  quantity: z.coerce
    .number()
    .int()
    .nonnegative("Quantity must be 0 or greater"),

  lowStockAt: z.coerce
    .number()
    .int()
    .nonnegative("Low stock threshold must be 0 or greater")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  supplier: emptyStringToUndefined.refine(
    (val) => !val || val.length <= 100,
    "Supplier must be 100 characters or fewer"
  ),

  imageUrl: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === "") return undefined;
      return val.trim();
    })
    .refine(
      (value) => {
        if (!value) return true;
        // Accept both regular URLs and base64 data URLs
        return (
          z.string().url().safeParse(value).success ||
          value.startsWith("data:image/")
        );
      },
      { message: "Image URL must be a valid URL or base64 data URL" }
    ),

  warrantyMonths: z.coerce
    .number()
    .int()
    .nonnegative("Warranty months must be 0 or greater")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  location: emptyStringToUndefined.refine(
    (val) => !val || val.length <= 200,
    "Location must be 200 characters or fewer"
  ),

  specs: emptyStringToUndefined.refine(
    (val) => !val || val.length <= 2000,
    "Specs must be 2000 characters or fewer"
  ),

  compatibility: emptyStringToUndefined.refine(
    (val) => !val || val.length <= 1000,
    "Compatibility must be 1000 characters or fewer"
  ),

  notes: emptyStringToUndefined.refine(
    (val) => !val || val.length <= 2000,
    "Notes must be 2000 characters or fewer"
  ),

  tagIds: z
    .preprocess((val) => {
      // Handle FormData.getAll() which returns string[]
      if (Array.isArray(val)) {
        return val.filter((v) => v && String(v).trim().length > 0);
      }
      // Handle single string
      if (typeof val === "string" && val.trim().length > 0) {
        return [val];
      }
      return [];
    }, z.array(z.string()))
    .optional(),
});

export type ProductInput = z.infer<typeof ProductSchema>;
