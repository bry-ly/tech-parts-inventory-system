"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/infrastructure/database/prisma.repository";
import { PrismaInventoryValueRepository } from "@/infrastructure/database/inventory-value.repository.impl";
import { ProductRepositoryImpl } from "@/infrastructure/database/product.repository.impl";
import { PrismaStockMovementRepository } from "@/infrastructure/database/stock-movement.repository.impl";
import { InventoryAnalyticsUseCase } from "../use-cases/inventory-analytics.use-case";

const inventoryValueRepository = new PrismaInventoryValueRepository(prisma);
const productRepository = new ProductRepositoryImpl();
const stockMovementRepository = new PrismaStockMovementRepository(prisma);
const inventoryAnalyticsUseCase = new InventoryAnalyticsUseCase(
  inventoryValueRepository,
  productRepository,
  stockMovementRepository
);

export async function createInventorySnapshot() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const snapshot = await inventoryAnalyticsUseCase.createSnapshot(session.user.id);
    return { success: true, data: snapshot };
  } catch (error: any) {
    return { error: error.message || "Failed to create snapshot" };
  }
}

export async function getCurrentMetrics() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const metrics = await inventoryAnalyticsUseCase.getCurrentMetrics(session.user.id);
    return { success: true, data: metrics };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch current metrics" };
  }
}

export async function getStockMovementSummary(days: number = 30) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const summary = await inventoryAnalyticsUseCase.getStockMovementSummary(session.user.id, days);
    return { success: true, data: summary };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch stock movement summary" };
  }
}

export async function getTopProducts(limit: number = 10) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const products = await inventoryAnalyticsUseCase.getTopProducts(session.user.id, limit);
    return { success: true, data: products };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch top products" };
  }
}

export async function getLowStockProducts() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const products = await inventoryAnalyticsUseCase.getLowStockProducts(session.user.id);
    return { success: true, data: products };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch low stock products" };
  }
}

export async function getOutOfStockProducts() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const products = await inventoryAnalyticsUseCase.getOutOfStockProducts(session.user.id);
    return { success: true, data: products };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch out of stock products" };
  }
}

export async function getSnapshotHistory(limit: number = 30) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const history = await inventoryAnalyticsUseCase.getSnapshotHistory(session.user.id, limit);
    return { success: true, data: history };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch snapshot history" };
  }
}

