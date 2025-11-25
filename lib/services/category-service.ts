/**
 * Client-side service layer for category operations
 * Wraps server actions with type safety and error handling
 */

import { toast } from "sonner";
import {
  createCategory as createCategoryAction,
  updateCategory as updateCategoryAction,
  deleteCategory as deleteCategoryAction,
} from "@/lib/action/category";

export class CategoryService {
  /**
   * Create a new category
   */
  static async createCategory(name: string) {
    try {
      const formData = new FormData();
      formData.append("name", name);

      const result = await createCategoryAction(formData);

      if (result?.success) {
        toast.success(result.message ?? "Category created successfully");
        return { success: true, data: result.category };
      } else {
        toast.error(result?.message ?? "Failed to create category");
        return { success: false, errors: result?.errors };
      }
    } catch (error) {
      console.error("CategoryService.createCategory error:", error);
      toast.error("An unexpected error occurred");
      return { success: false, error };
    }
  }

  /**
   * Update an existing category
   */
  static async updateCategory(categoryId: string, name: string) {
    try {
      const formData = new FormData();
      formData.append("id", categoryId);
      formData.append("name", name);

      const result = await updateCategoryAction(formData);

      if (result?.success) {
        toast.success(result.message ?? "Category updated successfully");
        return { success: true, data: result.category };
      } else {
        toast.error(result?.message ?? "Failed to update category");
        return { success: false, errors: result?.errors };
      }
    } catch (error) {
      console.error("CategoryService.updateCategory error:", error);
      toast.error("An unexpected error occurred");
      return { success: false, error };
    }
  }

  /**
   * Delete a category
   */
  static async deleteCategory(categoryId: string) {
    try {
      const formData = new FormData();
      formData.append("id", categoryId);

      const result = await deleteCategoryAction(formData);

      if (result?.success) {
        toast.success(result.message ?? "Category deleted successfully");
        return { success: true };
      } else {
        toast.error(result?.message ?? "Failed to delete category");
        return { success: false };
      }
    } catch (error) {
      console.error("CategoryService.deleteCategory error:", error);
      toast.error("An unexpected error occurred");
      return { success: false, error };
    }
  }
}
