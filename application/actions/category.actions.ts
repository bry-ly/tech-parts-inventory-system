// Server actions for Category - adapts Next.js FormData to use cases
"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/infrastructure/auth/auth";
import { CategoryUseCase } from "@/application/use-cases/category.use-case";
import { CategoryRepositoryImpl } from "@/infrastructure/database/category.repository.impl";
import type { CategoryCreateInput } from "@/application/dto/category.dto";

const categoryRepository = new CategoryRepositoryImpl();
const categoryUseCase = new CategoryUseCase(categoryRepository);

async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return null;
  }
  return session.user;
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

  const input: CategoryCreateInput = {
    name: formData.get("name") as string,
  };

  const result = await categoryUseCase.createCategory(user.id, input);

  if (result.success) {
    revalidateInventoryScreens();
  }

  return result;
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
  const input: CategoryCreateInput = {
    name: formData.get("name") as string,
  };

  const result = await categoryUseCase.updateCategory(user.id, id, input);

  if (result.success) {
    revalidateInventoryScreens();
  }

  return result;
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
  const result = await categoryUseCase.deleteCategory(user.id, id);

  if (result.success) {
    revalidateInventoryScreens();
  }

  return result;
}

