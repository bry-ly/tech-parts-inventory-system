/**
 * Shared utilities for server actions
 */

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { z } from "zod";

/**
 * Standard action result shape for consistency across all actions
 */
export type ActionResult<T = unknown> = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: T;
};

/**
 * Require an authenticated user or throw an error
 * Returns the authenticated user
 */
export async function requireAuthedUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("Authentication required");
  }
  return session.user;
}

/**
 * Format Zod validation errors into a consistent error object
 */
export function formatZodErrors(
  issues: z.ZodIssue[]
): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  issues.forEach((issue) => {
    const path = issue.path.join(".") || "form";
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  });
  return errors;
}

/**
 * Create a success action result
 */
export function successResult<T = unknown>(
  message: string,
  data?: T
): ActionResult<T> {
  return {
    success: true,
    message,
    data,
    errors: {},
  };
}

/**
 * Create a failure action result
 */
export function failureResult(
  message: string,
  errors?: Record<string, string[]>
): ActionResult {
  return {
    success: false,
    message,
    errors: errors || {},
  };
}
