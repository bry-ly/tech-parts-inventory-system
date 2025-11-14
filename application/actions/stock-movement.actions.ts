"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/infrastructure/database/prisma.repository";
import { PrismaStockMovementRepository } from "@/infrastructure/database/stock-movement.repository.impl";
import { ProductRepositoryImpl } from "@/infrastructure/database/product.repository.impl";
import { PrismaStockAlertRepository } from "@/infrastructure/database/stock-alert.repository.impl";
import { StockMovementUseCase } from "../use-cases/stock-movement.use-case";
import { CreateStockMovementSchema, StockAdjustmentSchema } from "../dto/stock-movement.dto";
import { StockMovementType } from "@/domain/entities/stock-movement.entity";

const stockMovementRepository = new PrismaStockMovementRepository(prisma);
const productRepository = new ProductRepositoryImpl();
const stockAlertRepository = new PrismaStockAlertRepository(prisma);
const stockMovementUseCase = new StockMovementUseCase(
  stockMovementRepository,
  productRepository,
  stockAlertRepository
);

export async function createStockMovement(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const data = {
      productId: formData.get("productId") as string,
      supplierId: formData.get("supplierId") as string | null,
      batchId: formData.get("batchId") as string | null,
      type: formData.get("type") as StockMovementType,
      quantity: parseInt(formData.get("quantity") as string),
      unitCost: formData.has("unitCost") ? parseFloat(formData.get("unitCost") as string) : null,
      reference: formData.get("reference") as string | null,
      reason: formData.get("reason") as string | null,
      notes: formData.get("notes") as string | null,
    };

    const validated = CreateStockMovementSchema.parse(data);
    const movement = await stockMovementUseCase.createStockMovement(
      session.user.id,
      session.user.id,
      validated
    );

    return { success: true, data: movement };
  } catch (error: any) {
    return { error: error.message || "Failed to create stock movement" };
  }
}

export async function adjustStock(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const data = {
      productId: formData.get("productId") as string,
      newQuantity: parseInt(formData.get("newQuantity") as string),
      reason: formData.get("reason") as string,
      notes: formData.get("notes") as string | null,
    };

    const validated = StockAdjustmentSchema.parse(data);
    const movement = await stockMovementUseCase.adjustStock(
      session.user.id,
      session.user.id,
      validated
    );

    return { success: true, data: movement };
  } catch (error: any) {
    return { error: error.message || "Failed to adjust stock" };
  }
}

export async function getStockMovements(limit?: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const movements = await stockMovementUseCase.getStockMovements(session.user.id, limit);
    return { success: true, data: movements };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch stock movements" };
  }
}

export async function getProductStockHistory(productId: string, limit?: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const history = await stockMovementUseCase.getProductStockHistory(productId, limit);
    return { success: true, data: history };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch product stock history" };
  }
}

export async function getMovementsByType(type: StockMovementType, limit?: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const movements = await stockMovementUseCase.getMovementsByType(session.user.id, type, limit);
    return { success: true, data: movements };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch movements by type" };
  }
}

export async function getMovementTotals(startDate?: Date, endDate?: Date) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const totals = await stockMovementUseCase.getMovementTotals(session.user.id, startDate, endDate);
    return { success: true, data: totals };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch movement totals" };
  }
}

