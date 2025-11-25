"use server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma/prisma";
import { Prisma } from "@prisma/client";
import { logActivity } from "@/lib/logger/logger";

const ProductSchema = z.object({
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
  imageUrl: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value || value.trim() === "") return true;
        // Accept both regular URLs and base64 data URLs
        return (
          z.string().url().safeParse(value).success ||
          value.startsWith("data:image/")
        );
      },
      { message: "Image URL must be a valid URL or base64 data URL" }
    ),
});

function extractProductPayload(formData: FormData) {
  const imageField = formData.get("imageUrl");
  // Treat empty strings as undefined
  const imageUrl =
    typeof imageField === "string" && imageField.trim().length > 0
      ? imageField.trim()
      : undefined;

  return {
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
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

  await logActivity({
    userId: user.id,
    actorId: user.id,
    entityType: "product",
    entityId: id,
    action: "delete",
    note: `Deleted product: ${existing.name}`,
  });

  revalidatePath("/inventory");
  revalidatePath("/dashboard");

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
    const { categoryId, ...productData } = parsed.data;
    let resolvedCategoryId: string | null = null;

    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: categoryId, userId: user.id },
      });

      if (!category) {
        return {
          success: false,
          message: "Category not found or access denied.",
          errors: { categoryId: ["Category not found or access denied."] },
        };
      }
      resolvedCategoryId = category.id;
    }

    const product = await prisma.product.create({
      data: {
        ...productData,
        categoryId: resolvedCategoryId,
        userId: user.id,
      },
    });

    await logActivity({
      userId: user.id,
      actorId: user.id,
      entityType: "product",
      entityId: product.id,
      action: "create",
      changes: product as unknown as Prisma.JsonObject,
      note: `Created product: ${product.name}`,
    });

    revalidatePath("/inventory");
    revalidatePath("/dashboard");
    return {
      success: true,
      message: "Product added successfully!",
      errors: {},
    };
  } catch (error) {
    console.error("Create product error:", error);
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

  const tagIds = formData.getAll("tagIds") as string[];
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
    const { categoryId, ...productData } = parsed.data;
    const updatePayload: Prisma.ProductUpdateInput = {
      ...productData,
    };

    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: categoryId, userId: user.id },
      });

      if (!category) {
        return {
          success: false,
          message: "Category not found or access denied.",
          errors: { categoryId: ["Category not found or access denied."] },
        };
      }
      updatePayload.category = {
        connect: { id: categoryId },
      };
    } else {
      updatePayload.category = {
        disconnect: true,
      };
    }

    // Handle tags
    if (tagIds) {
      // First verify all tags exist and belong to user
      const validTags = await prisma.tag.findMany({
        where: {
          id: { in: tagIds },
          userId: user.id,
        },
      });

      // We replace all tags with the new selection
      // This means we delete existing relations and create new ones
      // Prisma's set/connect/disconnect on many-to-many can be tricky with explicit join tables
      // Since we have an explicit ProductTag model, we need to manage it carefully
      // But wait, the schema has implicit relation `tags ProductTag[]`?
      // Let's check schema again.
      // Schema:
      // model Product { ... tags ProductTag[] ... }
      // model Tag { ... products ProductTag[] ... }
      // model ProductTag { ... product Product ... tag Tag ... }

      // So we need to delete existing ProductTags for this product and create new ones.

      // Actually, it's better to use a transaction or just update the relations.
      // Since we are using an explicit join table, we can't use `set` directly on `tags` if it was implicit m-n.
      // But here `tags` is `ProductTag[]`.

      // Let's do it in a separate step or transaction if possible, but for simplicity let's do it here.
      // We can use `deleteMany` and `createMany` (if supported) or `create`.

      // Ideally we want to do this within the update if possible, but with explicit join table it's:
      updatePayload.tags = {
        deleteMany: {}, // Remove all existing links
        create: validTags.map((tag) => ({
          tag: { connect: { id: tag.id } },
        })),
      };
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updatePayload,
    });

    await logActivity({
      userId: user.id,
      actorId: user.id,
      entityType: "product",
      entityId: id,
      action: "update",
      changes: {
        before: existing as unknown as Prisma.JsonObject,
        after: updatedProduct as unknown as Prisma.JsonObject,
      },
      note: `Updated product: ${updatedProduct.name}`,
    });

    revalidatePath("/inventory");
    revalidatePath("/dashboard");
    return {
      success: true,
      message: "Product updated successfully.",
      errors: {},
    };
  } catch (error) {
    console.error("Update product error:", error);
    return {
      success: false,
      message: "Failed to update product.",
      errors: { server: ["Failed to update product."] },
    };
  }
}

export async function adjustStock(formData: FormData) {
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

  const adjustment = formData.get("adjustment");
  if (!adjustment) {
    return {
      success: false,
      message: "Stock adjustment value is required.",
      errors: { adjustment: ["Stock adjustment is required."] },
    };
  }

  const adjustmentValue = Number(adjustment);
  if (isNaN(adjustmentValue)) {
    return {
      success: false,
      message: "Invalid adjustment value.",
      errors: { adjustment: ["Adjustment must be a number."] },
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

  const newQuantity = existing.quantity + adjustmentValue;
  if (newQuantity < 0) {
    return {
      success: false,
      message: "Cannot adjust stock below zero.",
      errors: {
        adjustment: [
          `Cannot adjust below 0. Current stock: ${existing.quantity}`,
        ],
      },
    };
  }

  try {
    await prisma.product.update({
      where: { id },
      data: { quantity: newQuantity },
    });

    await logActivity({
      userId: user.id,
      actorId: user.id,
      entityType: "product",
      entityId: id,
      action: "stock_adjustment",
      changes: {
        previousQuantity: existing.quantity,
        newQuantity: newQuantity,
        adjustment: adjustmentValue,
      } as Prisma.JsonObject,
      note: `Adjusted stock for ${existing.name} by ${adjustmentValue}`,
    });

    revalidatePath("/inventory");
    revalidatePath("/dashboard");
    return {
      success: true,
      message: `Stock adjusted successfully. New quantity: ${newQuantity}`,
      errors: {},
    };
  } catch (error) {
    console.error("Error adjusting stock:", error);
    return {
      success: false,
      message: "Failed to adjust stock.",
      errors: { server: ["Failed to adjust stock."] },
    };
  }
}

export async function getLowStockProducts() {
  const user = await requireUser();
  if (!user) {
    return {
      success: false,
      message: "User not found",
      data: [],
    };
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        userId: user.id,
        lowStockAt: {
          not: null,
        },
      },
      orderBy: {
        quantity: "asc",
      },
    });

    const lowStockProducts = products.filter((p) => {
      return p.lowStockAt !== null && p.quantity <= p.lowStockAt;
    });

    return {
      success: true,
      data: lowStockProducts,
    };
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    return {
      success: false,
      message: "Failed to fetch low stock products",
      data: [],
    };
  }
}

export async function getInventoryAnalytics() {
  const user = await requireUser();
  if (!user) {
    return {
      success: false,
      message: "User not found",
      data: null,
    };
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        userId: user.id,
      },
    });

    const totalProducts = products.length;
    const totalValue = products.reduce(
      (sum, product) => sum + Number(product.price) * product.quantity,
      0
    );

    const lowStockCount = products.filter((p) => {
      return p.lowStockAt !== null && p.quantity <= p.lowStockAt;
    }).length;

    const outOfStockCount = products.filter((p) => p.quantity === 0).length;

    // Group by category
    const categoryIds = [
      ...new Set(products.map((p) => p.categoryId).filter(Boolean)),
    ];
    const categories = await prisma.category.findMany({
      where: {
        id: { in: categoryIds as string[] },
      },
    });

    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

    const valueByCategory = products.reduce((acc, product) => {
      const catName = product.categoryId
        ? categoryMap.get(product.categoryId) || "Uncategorized"
        : "Uncategorized";
      acc[catName] =
        (acc[catName] || 0) + Number(product.price) * product.quantity;
      return acc;
    }, {} as Record<string, number>);

    return {
      success: true,
      data: {
        totalProducts,
        totalValue,
        lowStockCount,
        outOfStockCount,
        valueByCategory,
      },
    };
  } catch (error) {
    console.error("Error fetching inventory analytics:", error);
    return {
      success: false,
      message: "Failed to fetch inventory analytics",
      data: null,
    };
  }
}

export async function getProducts() {
  const user = await requireUser();
  if (!user) {
    return {
      success: false,
      message: "User not found",
      data: [],
    };
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        name: "asc",
      },
    });

    const formattedProducts = products.map((p) => ({
      ...p,
      price: p.price.toNumber(),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    return {
      success: true,
      data: formattedProducts,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      message: "Failed to fetch products",
      data: [],
    };
  }
}
