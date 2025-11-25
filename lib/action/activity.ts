"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return null;
  }
  return session.user;
}

export async function deleteActivityLogs(ids: string[]) {
  const user = await requireUser();
  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  if (!ids || ids.length === 0) {
    return {
      success: false,
      message: "No logs selected for deletion",
    };
  }

  try {
    await prisma.activityLog.deleteMany({
      where: {
        id: {
          in: ids,
        },
        userId: user.id, // Ensure user can only delete their own logs
      },
    });

    revalidatePath("/activity-log");

    return {
      success: true,
      message: `Successfully deleted ${ids.length} activity log(s)`,
    };
  } catch (error) {
    console.error("Error deleting activity logs:", error);
    return {
      success: false,
      message: "Failed to delete activity logs",
    };
  }
}
