"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/infrastructure/database/prisma.repository";
import { PrismaStockAlertRepository } from "@/infrastructure/database/stock-alert.repository.impl";
import { StockAlertUseCase } from "../use-cases/stock-alert.use-case";
import { StockAlertType } from "@/domain/entities/stock-alert.entity";

const stockAlertRepository = new PrismaStockAlertRepository(prisma);
const stockAlertUseCase = new StockAlertUseCase(stockAlertRepository);

export async function getUserAlerts(includeAcknowledged: boolean = false) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const alerts = await stockAlertUseCase.getUserAlerts(session.user.id, includeAcknowledged);
    return { success: true, data: alerts };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch alerts" };
  }
}

export async function getAlertsByType(type: StockAlertType) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const alerts = await stockAlertUseCase.getAlertsByType(session.user.id, type);
    return { success: true, data: alerts };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch alerts by type" };
  }
}

export async function getProductAlerts(productId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const alerts = await stockAlertUseCase.getProductAlerts(productId);
    return { success: true, data: alerts };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch product alerts" };
  }
}

export async function acknowledgeAlert(alertId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const alert = await stockAlertUseCase.acknowledgeAlert(alertId, session.user.id);
    return { success: true, data: alert };
  } catch (error: any) {
    return { error: error.message || "Failed to acknowledge alert" };
  }
}

export async function resolveAlert(alertId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const alert = await stockAlertUseCase.resolveAlert(alertId);
    return { success: true, data: alert };
  } catch (error: any) {
    return { error: error.message || "Failed to resolve alert" };
  }
}

export async function getUnacknowledgedCount() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const count = await stockAlertUseCase.getUnacknowledgedCount(session.user.id);
    return { success: true, data: count };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch unacknowledged count" };
  }
}

export async function bulkAcknowledgeAlerts(alertIds: string[]) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    await stockAlertUseCase.bulkAcknowledge(alertIds, session.user.id);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to acknowledge alerts" };
  }
}

