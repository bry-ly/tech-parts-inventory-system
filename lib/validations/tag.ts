/**
 * Tag validation schemas using Zod
 */

import { z } from "zod";

export const TagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(50, "Name must be 50 characters or fewer"),
});

export type TagInput = z.infer<typeof TagSchema>;
