"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/infrastructure/database/prisma.repository";
import { PrismaSupplierRepository } from "@/infrastructure/database/supplier.repository.impl";
import { SupplierUseCase } from "../use-cases/supplier.use-case";
import {
  CreateSupplierSchema,
  UpdateSupplierSchema,
  LinkProductSupplierSchema,
  UpdateProductSupplierSchema,
} from "../dto/supplier.dto";

const supplierRepository = new PrismaSupplierRepository(prisma);
const supplierUseCase = new SupplierUseCase(supplierRepository);

export async function createSupplier(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const data = {
      name: formData.get("name") as string,
      contactPerson: formData.get("contactPerson") as string | null,
      email: formData.get("email") as string | null,
      phone: formData.get("phone") as string | null,
      address: formData.get("address") as string | null,
      website: formData.get("website") as string | null,
      notes: formData.get("notes") as string | null,
      active: formData.get("active") === "true",
    };

    const validated = CreateSupplierSchema.parse(data);
    const supplier = await supplierUseCase.createSupplier(session.user.id, validated);

    return { success: true, data: supplier };
  } catch (error: any) {
    return { error: error.message || "Failed to create supplier" };
  }
}

export async function updateSupplier(id: string, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const data: any = {};
    if (formData.has("name")) data.name = formData.get("name") as string;
    if (formData.has("contactPerson")) data.contactPerson = formData.get("contactPerson") as string;
    if (formData.has("email")) data.email = formData.get("email") as string;
    if (formData.has("phone")) data.phone = formData.get("phone") as string;
    if (formData.has("address")) data.address = formData.get("address") as string;
    if (formData.has("website")) data.website = formData.get("website") as string;
    if (formData.has("notes")) data.notes = formData.get("notes") as string;
    if (formData.has("active")) data.active = formData.get("active") === "true";

    const validated = UpdateSupplierSchema.parse(data);
    const supplier = await supplierUseCase.updateSupplier(id, validated);

    return { success: true, data: supplier };
  } catch (error: any) {
    return { error: error.message || "Failed to update supplier" };
  }
}

export async function deleteSupplier(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    await supplierUseCase.deleteSupplier(id);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete supplier" };
  }
}

export async function getAllSuppliers() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const suppliers = await supplierUseCase.getAllSuppliers(session.user.id);
    return { success: true, data: suppliers };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch suppliers" };
  }
}

export async function getActiveSuppliers() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const suppliers = await supplierUseCase.getActiveSuppliers(session.user.id);
    return { success: true, data: suppliers };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch active suppliers" };
  }
}

export async function linkProductToSupplier(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const data = {
      productId: formData.get("productId") as string,
      supplierId: formData.get("supplierId") as string,
      supplierSku: formData.get("supplierSku") as string | null,
      costPrice: parseFloat(formData.get("costPrice") as string),
      leadTimeDays: formData.has("leadTimeDays")
        ? parseInt(formData.get("leadTimeDays") as string)
        : null,
      minOrderQty: formData.has("minOrderQty")
        ? parseInt(formData.get("minOrderQty") as string)
        : null,
      isPrimary: formData.get("isPrimary") === "true",
    };

    const validated = LinkProductSupplierSchema.parse(data);
    const link = await supplierUseCase.linkProductToSupplier(validated);

    return { success: true, data: link };
  } catch (error: any) {
    return { error: error.message || "Failed to link product to supplier" };
  }
}

export async function getProductSuppliers(productId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const suppliers = await supplierUseCase.getProductSuppliers(productId);
    return { success: true, data: suppliers };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch product suppliers" };
  }
}

