"use server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma/prisma";

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
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

function extractProductPayload(formData: FormData) {
  const imageField = formData.get("imageUrl");
  const imageUrl =
    typeof imageField === "string" && imageField.trim().length > 0
      ? imageField
      : undefined;

  return {
    name: formData.get("name"),
    category: formData.get("category"),
    manufacturer: formData.get("manufacturer"),
    model: formData.get("model") || undefined,
    sku: formData.get("sku") || undefined,
    quantity: formData.get("quantity"),
    lowStockAt: formData.get("lowStockAt") || undefined,
    condition: formData.get("condition") || "new",
    location: formData.get("location") || undefined,
    price: formData.get("price"),
    specs: formData.get("specs") || undefined,
    compatibility: formData.get("compatibility") || undefined,
    supplier: formData.get("supplier") || undefined,
    warrantyMonths: formData.get("warrantyMonths") || undefined,
    notes: formData.get("notes") || undefined,
    imageUrl,
  };
}

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

export async function deleteProduct(formData: FormData) {
  const user = await requireUser();
  if (!user) {
    return {
      success: false,
      message: "User not found. Please sign in.",
    };
  }

  const id = String(formData.get("id") || "").trim();
  if (!id) {
    return {
      success: false,
      message: "Product identifier missing.",
    };
  }

  const existing = await prisma.product.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    return {
      success: false,
      message: "Product not found or access denied.",
    };
  }

  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/inventory");

  return {
    success: true,
    message: "Product deleted successfully.",
  };
}

export async function createProduct(formData: FormData) {
  const user = await requireUser();

  if (!user) {
    return {
      success: false,
      message: "User not found. Please sign in.",
      errors: { user: ["User not found"] },
    };
  }

  const parsed = ProductSchema.safeParse(extractProductPayload(formData));

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed. Please check the form for errors.",
      errors: formatValidationErrors(parsed.error.issues),
    };
  }

  try {
    await prisma.product.create({
      data: { ...parsed.data, userId: user.id },
    });
    revalidatePath("/inventory");
    return {
      success: true,
      message: "Product added successfully!",
      errors: {},
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create product.",
      errors: { server: ["Failed to create product."] },
    };
  }
}

export async function updateProduct(formData: FormData) {
  const user = await requireUser();

  if (!user) {
    return {
      success: false,
      message: "User not found. Please sign in.",
      errors: { user: ["User not found"] },
    };
  }

  const id = String(formData.get("id") || "").trim();
  if (!id) {
    return {
      success: false,
      message: "Product identifier missing.",
      errors: { id: ["Product identifier is required."] },
    };
  }

  const parsed = ProductSchema.safeParse(extractProductPayload(formData));

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed. Please check the form for errors.",
      errors: formatValidationErrors(parsed.error.issues),
    };
  }

  const existing = await prisma.product.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    return {
      success: false,
      message: "Product not found or access denied.",
      errors: { id: ["Product not found or access denied."] },
    };
  }

  try {
    await prisma.product.update({
      where: { id },
      data: parsed.data,
    });
    revalidatePath("/inventory");
    return {
      success: true,
      message: "Product updated successfully.",
      errors: {},
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update product.",
      errors: { server: ["Failed to update product."] },
    };
  }
}
