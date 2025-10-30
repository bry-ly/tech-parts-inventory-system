"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { headers } from "next/headers";

const prisma = new PrismaClient();

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().nonnegative("Price must be non-negative"),
  quantity: z.coerce.number().int().min(0, "Quantity must be non-negative"),
  sku: z.string().optional(),
  lowStockAt: z.coerce.number().int().min(0).optional(),
  imageUrl: z.string().url().optional(), // New field for image URL
});

export async function deleteProduct(formData: FormData) {
  const user = await auth.api.getSession({
    headers: await headers(),
  }).then(res => res?.user || null);
  if (!user) {
    throw new Error("User not found");
  }
  const id = String(formData.get("id") || "");

  await prisma.product.delete({
    where: { id: id, userId: user.id },
  });
}

export async function createProduct(formData: FormData) {
  const user = await auth.api.getSession({
    headers: await headers(),
  }).then(res => res?.user || null);

  if (!user) {
    throw new Error("User not found");
  }

  const imageField = formData.get("imageUrl");
  const imageUrl = typeof imageField === "string" && imageField.trim().length > 0 ? imageField : undefined;

  const parsed = ProductSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
    sku: formData.get("sku") || undefined,
    lowStockAt: formData.get("lowStockAt") || undefined,
    imageUrl,
  });

  if (!parsed.success) {
    throw new Error("Validation failed");
  }

  try {
    await prisma.product.create({
      data: { ...parsed.data, userId: user.id },
    });
    redirect("/inventory");
  } catch (error) {
    throw new Error("Failed to create product.");
  }
}
