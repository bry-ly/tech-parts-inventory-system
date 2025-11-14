// Data Transfer Objects for Category operations
import { z } from "zod";

export const CategoryCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
});

export type CategoryCreateInput = z.infer<typeof CategoryCreateSchema>;

export interface CategoryCreateResult {
  success: boolean;
  message: string;
  category?: { id: string; name: string };
  errors?: Record<string, string[]>;
}

export interface CategoryUpdateResult {
  success: boolean;
  message: string;
  category?: { id: string; name: string };
  errors?: Record<string, string[]>;
}

export interface CategoryDeleteResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

