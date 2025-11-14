"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
});

async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return null;
  }
  return session.user;
}

function formatValidationErrors(issues: z.ZodIssue[]) {
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

function revalidateInventoryScreens() {
  revalidatePath("/inventory");
  revalidatePath("/add-product");
  revalidatePath("/dashboard");
}

export async function createCategory(formData: FormData) {
  const user = await requireUser();

  if (!user) {
    return {
      success: false,
      message: "Please sign in to manage categories.",
    };
  }

  const parsed = CategorySchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: formatValidationErrors(parsed.error.issues),
    };
  }

  const normalizedName = parsed.data.name;

  const existing = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: normalizedName,
    },
  });

  if (existing) {
    return {
      success: false,
      message: "Category already exists.",
      errors: { name: ["Category name already in use."] },
    };
  }

  const category = await prisma.category.create({
    data: {
      userId: user.id,
      name: normalizedName,
    },
  });

  revalidateInventoryScreens();

  return {
    success: true,
    message: "Category created successfully.",
    category,
  };
}

export async function updateCategory(formData: FormData) {
  const user = await requireUser();

  if (!user) {
    return {
      success: false,
      message: "Please sign in to manage categories.",
    };
  }

  const id = String(formData.get("id") || "").trim();
  if (!id) {
    return {
      success: false,
      message: "Category identifier is required.",
      errors: { id: ["Category identifier is required."] },
    };
  }

  const parsed = CategorySchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: formatValidationErrors(parsed.error.issues),
    };
  }

  const category = await prisma.category.findFirst({
    where: { id, userId: user.id },
  });

  if (!category) {
    return {
      success: false,
      message: "Category not found or access denied.",
    };
  }

  const normalizedName = parsed.data.name;

  const duplicate = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: normalizedName,
      NOT: { id },
    },
  });

  if (duplicate) {
    return {
      success: false,
      message: "Another category already uses that name.",
      errors: { name: ["Another category already uses that name."] },
    };
  }

  const updated = await prisma.category.update({
    where: { id },
    data: {
      name: normalizedName,
    },
  });

  revalidateInventoryScreens();

  return {
    success: true,
    message: "Category renamed successfully.",
    category: updated,
  };
}

export async function deleteCategory(formData: FormData) {
  const user = await requireUser();

  if (!user) {
    return {
      success: false,
      message: "Please sign in to manage categories.",
    };
  }

  const id = String(formData.get("id") || "").trim();
  if (!id) {
    return {
      success: false,
      message: "Category identifier is required.",
      errors: { id: ["Category identifier is required."] },
    };
  }

  const category = await prisma.category.findFirst({
    where: { id, userId: user.id },
  });

  if (!category) {
    return {
      success: false,
      message: "Category not found or access denied.",
    };
  }

  await prisma.category.delete({
    where: { id },
  });

  revalidateInventoryScreens();

  return {
    success: true,
    message: "Category deleted successfully.",
  };
}


