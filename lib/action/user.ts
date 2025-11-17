"use server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma/prisma";

const UpdateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  image: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value || value.trim() === "") return true;
        // Accept both regular URLs and base64 data URLs
        return (
          z.string().url().safeParse(value).success ||
          value.startsWith("data:image/")
        );
      },
      { message: "Image must be a valid URL or base64 data URL" }
    ),
});

export async function updateUserProfile(formData: FormData) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const userId = session.user.id;

    // Extract form data
    const name = formData.get("name");
    const email = formData.get("email");
    const imageField = formData.get("image");

    // Handle image - treat empty strings as undefined
    const image =
      typeof imageField === "string" && imageField.trim().length > 0
        ? imageField.trim()
        : undefined;

    // Validate input
    const validationResult = UpdateUserSchema.safeParse({
      name,
      email,
      image,
    });

    if (!validationResult.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { name: validatedName, email: validatedEmail, image: validatedImage } =
      validationResult.data;

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedEmail },
    });

    if (existingUser && existingUser.id !== userId) {
      return {
        success: false,
        message: "Email is already taken by another user",
      };
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: validatedName,
        email: validatedEmail,
        image: validatedImage ?? null,
      },
    });

    // Revalidate paths
    revalidatePath("/settings");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Profile updated successfully",
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
      },
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update profile. Please try again.",
    };
  }
}

