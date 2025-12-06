"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma/prisma";
import {
  requireAuthedUser,
  successResult,
  failureResult,
  ActionResult,
} from "@/lib/server/action-utils";
import { parseProductFromFormData } from "@/lib/server/product-mapper";
import {
  upsertProductTransaction,
  deleteProductTransaction,
  adjustStockTransaction,
} from "@/lib/server/product-helpers";

/**
 * Create a new product
 */
export async function createProduct(
  formData: FormData
): Promise<ActionResult> {
  try {
    const user = await requireAuthedUser();

    // Parse and validate
    const parsed = parseProductFromFormData(formData);
    if (!parsed.success) {
      return failureResult(
        "Validation failed. Please check the form for errors.",
        parsed.errors
      );
    }

    // Create product in transaction
    const result = await upsertProductTransaction({
      userId: user.id,
      productData: parsed.data,
    });

    if (!result.success) {
      return failureResult(result.error, {
        categoryId: [result.error],
      });
    }

    revalidatePath("/inventory");
    revalidatePath("/dashboard");

    return successResult("Product added successfully!");
  } catch (error) {
    console.error("Create product error:", error);
    if (error instanceof Error && error.message === "Authentication required") {
      return failureResult("User not found. Please sign in.", {
        user: ["User not found"],
      });
    }
    return failureResult("Failed to create product.", {
      server: ["Failed to create product."],
    });
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(
  formData: FormData
): Promise<ActionResult> {
  try {
    const user = await requireAuthedUser();

    // Extract product ID
    const id = String(formData.get("id") || "").trim();
    if (!id) {
      return failureResult("Product identifier missing.", {
        id: ["Product identifier is required."],
      });
    }

    // Parse and validate
    const parsed = parseProductFromFormData(formData);
    if (!parsed.success) {
      return failureResult(
        "Validation failed. Please check the form for errors.",
        parsed.errors
      );
    }

    // Check if product exists and belongs to user
    const existing = await prisma.product.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return failureResult("Product not found or access denied.", {
        id: ["Product not found or access denied."],
      });
    }

    // Update product in transaction
    const result = await upsertProductTransaction({
      productId: id,
      userId: user.id,
      productData: parsed.data,
      existingProduct: existing,
    });

    if (!result.success) {
      return failureResult(result.error, {
        categoryId: [result.error],
      });
    }

    revalidatePath("/inventory");
    revalidatePath("/dashboard");

    return successResult("Product updated successfully.");
  } catch (error) {
    console.error("Update product error:", error);
    if (error instanceof Error && error.message === "Authentication required") {
      return failureResult("User not found. Please sign in.", {
        user: ["User not found"],
      });
    }
    return failureResult("Failed to update product.", {
      server: ["Failed to update product."],
    });
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(
  formData: FormData
): Promise<ActionResult> {
  try {
    const user = await requireAuthedUser();

    const id = String(formData.get("id") || "").trim();
    if (!id) {
      return failureResult("Product identifier missing.");
    }

    const existing = await prisma.product.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return failureResult("Product not found or access denied.");
    }

    await deleteProductTransaction({
      productId: id,
      userId: user.id,
      productName: existing.name,
    });

    revalidatePath("/inventory");
    revalidatePath("/dashboard");

    return successResult("Product deleted successfully.");
  } catch (error) {
    console.error("Delete product error:", error);
    if (error instanceof Error && error.message === "Authentication required") {
      return failureResult("User not found. Please sign in.");
    }
    return failureResult("Failed to delete product.");
  }
}

/**
 * Adjust stock quantity for a product
 */
export async function adjustStock(formData: FormData): Promise<ActionResult> {
  try {
    const user = await requireAuthedUser();

    const id = String(formData.get("id") || "").trim();
    if (!id) {
      return failureResult("Product identifier missing.", {
        id: ["Product identifier is required."],
      });
    }

    const adjustment = formData.get("adjustment");
    if (!adjustment) {
      return failureResult("Stock adjustment value is required.", {
        adjustment: ["Stock adjustment is required."],
      });
    }

    const adjustmentValue = Number(adjustment);
    if (isNaN(adjustmentValue)) {
      return failureResult("Invalid adjustment value.", {
        adjustment: ["Adjustment must be a number."],
      });
    }

    const existing = await prisma.product.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return failureResult("Product not found or access denied.", {
        id: ["Product not found or access denied."],
      });
    }

    const result = await adjustStockTransaction({
      productId: id,
      userId: user.id,
      currentQuantity: existing.quantity,
      adjustment: adjustmentValue,
      productName: existing.name,
    });

    if (!result.success) {
      return failureResult("Cannot adjust stock below zero.", {
        adjustment: [result.error],
      });
    }

    revalidatePath("/inventory");
    revalidatePath("/dashboard");

    return successResult(
      `Stock adjusted successfully. New quantity: ${result.newQuantity}`
    );
  } catch (error) {
    console.error("Error adjusting stock:", error);
    if (error instanceof Error && error.message === "Authentication required") {
      return failureResult("User not found. Please sign in.", {
        user: ["User not found"],
      });
    }
    return failureResult("Failed to adjust stock.", {
      server: ["Failed to adjust stock."],
    });
  }
}

/**
 * Get low stock products for the current user
 */
export async function getLowStockProducts() {
  try {
    const user = await requireAuthedUser();

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

/**
 * Get inventory analytics for the current user
 */
export async function getInventoryAnalytics() {
  try {
    const user = await requireAuthedUser();

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

    const valueByCategory = products.reduce(
      (acc, product) => {
        const catName = product.categoryId
          ? categoryMap.get(product.categoryId) || "Uncategorized"
          : "Uncategorized";
        acc[catName] =
          (acc[catName] || 0) + Number(product.price) * product.quantity;
        return acc;
      },
      {} as Record<string, number>
    );

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

/**
 * Get all products for the current user
 */
export async function getProducts() {
  try {
    const user = await requireAuthedUser();

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
