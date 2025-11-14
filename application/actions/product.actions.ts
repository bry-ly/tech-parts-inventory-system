// Server actions for Product - adapts Next.js FormData to use cases
"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/infrastructure/auth/auth";
import { ProductUseCase } from "@/application/use-cases/product.use-case";
import { ProductRepositoryImpl } from "@/infrastructure/database/product.repository.impl";
import { CategoryRepositoryImpl } from "@/infrastructure/database/category.repository.impl";
import type { ProductCreateInput } from "@/application/dto/product.dto";

const productRepository = new ProductRepositoryImpl();
const categoryRepository = new CategoryRepositoryImpl();
const productUseCase = new ProductUseCase(productRepository, categoryRepository);

async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return null;
  }
  return session.user;
}

function extractProductPayload(formData: FormData): Partial<ProductCreateInput> {
  const imageField = formData.get("imageUrl");
  const imageUrl =
    typeof imageField === "string" && imageField.trim().length > 0
      ? imageField
      : undefined;

  return {
    name: formData.get("name") as string,
    categoryId: (formData.get("categoryId") as string) || undefined,
    manufacturer: formData.get("manufacturer") as string,
    model: (formData.get("model") as string) || undefined,
    sku: (formData.get("sku") as string) || undefined,
    quantity: formData.get("quantity") as string,
    lowStockAt: (formData.get("lowStockAt") as string) || undefined,
    condition: (formData.get("condition") as string) || "new",
    location: (formData.get("location") as string) || undefined,
    price: formData.get("price") as string,
    specs: (formData.get("specs") as string) || undefined,
    compatibility: (formData.get("compatibility") as string) || undefined,
    supplier: (formData.get("supplier") as string) || undefined,
    warrantyMonths: (formData.get("warrantyMonths") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
    imageUrl,
  };
}

function revalidateInventoryScreens() {
  revalidatePath("/inventory");
  revalidatePath("/dashboard");
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

  const payload = extractProductPayload(formData);
  const result = await productUseCase.createProduct(user.id, payload as ProductCreateInput);

  if (result.success) {
    revalidateInventoryScreens();
  }

  return result;
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

  const payload = extractProductPayload(formData);
  const result = await productUseCase.updateProduct(
    user.id,
    id,
    payload as ProductCreateInput
  );

  if (result.success) {
    revalidateInventoryScreens();
  }

  return result;
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
  const result = await productUseCase.deleteProduct(user.id, id);

  if (result.success) {
    revalidateInventoryScreens();
  }

  return result;
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
  const adjustment = formData.get("adjustment");

  if (!adjustment) {
    return {
      success: false,
      message: "Stock adjustment value is required.",
      errors: { adjustment: ["Stock adjustment is required."] },
    };
  }

  const adjustmentValue = Number(adjustment);
  const result = await productUseCase.adjustStock(user.id, id, adjustmentValue);

  if (result.success) {
    revalidateInventoryScreens();
  }

  return result;
}

