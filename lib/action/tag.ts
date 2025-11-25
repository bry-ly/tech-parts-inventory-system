"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma/prisma";
import { Prisma } from "@prisma/client";
import { logActivity } from "@/lib/logger/logger";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { TagSchema } from "@/lib/validations/tag";

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

function revalidateInventoryScreens() {
  revalidatePath("/inventory");
  revalidatePath("/add-product");
  revalidatePath("/tags");
}

export async function createTag(formData: FormData) {
  const user = await requireUser();

  if (!user) {
    return {
      success: false,
      message: "Please sign in to manage tags.",
    };
  }

  const parsed = TagSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: formatValidationErrors(parsed.error.issues),
    };
  }

  const normalizedName = parsed.data.name;

  const existing = await prisma.tag.findFirst({
    where: {
      userId: user.id,
      name: normalizedName,
    },
  });

  if (existing) {
    return {
      success: false,
      message: "Tag already exists.",
      errors: { name: ["Tag name already in use."] },
    };
  }

  const tag = await prisma.tag.create({
    data: {
      userId: user.id,
      name: normalizedName,
    },
  });

  await logActivity({
    userId: user.id,
    actorId: user.id,
    entityType: "tag",
    entityId: tag.id,
    action: "create",
    changes: tag as unknown as Prisma.JsonObject,
    note: `Created tag: ${tag.name}`,
  });

  revalidateInventoryScreens();

  return {
    success: true,
    message: "Tag created successfully.",
    tag,
  };
}

export async function updateTag(formData: FormData) {
  const user = await requireUser();

  if (!user) {
    return {
      success: false,
      message: "Please sign in to manage tags.",
    };
  }

  const id = String(formData.get("id") || "").trim();
  if (!id) {
    return {
      success: false,
      message: "Tag identifier is required.",
      errors: { id: ["Tag identifier is required."] },
    };
  }

  const parsed = TagSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: formatValidationErrors(parsed.error.issues),
    };
  }

  const tag = await prisma.tag.findFirst({
    where: { id, userId: user.id },
  });

  if (!tag) {
    return {
      success: false,
      message: "Tag not found or access denied.",
    };
  }

  const normalizedName = parsed.data.name;

  const duplicate = await prisma.tag.findFirst({
    where: {
      userId: user.id,
      name: normalizedName,
      NOT: { id },
    },
  });

  if (duplicate) {
    return {
      success: false,
      message: "Another tag already uses that name.",
      errors: { name: ["Another tag already uses that name."] },
    };
  }

  const updated = await prisma.tag.update({
    where: { id },
    data: {
      name: normalizedName,
    },
  });

  await logActivity({
    userId: user.id,
    actorId: user.id,
    entityType: "tag",
    entityId: id,
    action: "update",
    changes: {
      before: tag as unknown as Prisma.JsonObject,
      after: updated as unknown as Prisma.JsonObject,
    },
    note: `Renamed tag from ${tag.name} to ${updated.name}`,
  });

  revalidateInventoryScreens();

  return {
    success: true,
    message: "Tag renamed successfully.",
    tag: updated,
  };
}

export async function deleteTag(formData: FormData) {
  const user = await requireUser();

  if (!user) {
    return {
      success: false,
      message: "Please sign in to manage tags.",
    };
  }

  const id = String(formData.get("id") || "").trim();
  if (!id) {
    return {
      success: false,
      message: "Tag identifier is required.",
      errors: { id: ["Tag identifier is required."] },
    };
  }

  const tag = await prisma.tag.findFirst({
    where: { id, userId: user.id },
  });

  if (!tag) {
    return {
      success: false,
      message: "Tag not found or access denied.",
    };
  }

  await prisma.tag.delete({
    where: { id },
  });

  await logActivity({
    userId: user.id,
    actorId: user.id,
    entityType: "tag",
    entityId: id,
    action: "delete",
    note: `Deleted tag: ${tag.name}`,
  });

  revalidateInventoryScreens();

  return {
    success: true,
    message: "Tag deleted successfully.",
  };
}
