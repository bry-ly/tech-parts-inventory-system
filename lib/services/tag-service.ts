/**
 * Client-side service layer for tag operations
 * Wraps server actions with type safety and error handling
 */

import { toast } from "sonner";
import {
  createTag as createTagAction,
  updateTag as updateTagAction,
  deleteTag as deleteTagAction,
} from "@/lib/action/tag";

export class TagService {
  /**
   * Create a new tag
   */
  static async createTag(name: string) {
    try {
      const formData = new FormData();
      formData.append("name", name);

      const result = await createTagAction(formData);

      if (result?.success) {
        toast.success(result.message ?? "Tag created successfully");
        return { success: true, data: result.tag };
      } else {
        toast.error(result?.message ?? "Failed to create tag");
        return { success: false, errors: result?.errors };
      }
    } catch (error) {
      console.error("TagService.createTag error:", error);
      toast.error("An unexpected error occurred");
      return { success: false, error };
    }
  }

  /**
   * Update an existing tag
   */
  static async updateTag(tagId: string, name: string) {
    try {
      const formData = new FormData();
      formData.append("id", tagId);
      formData.append("name", name);

      const result = await updateTagAction(formData);

      if (result?.success) {
        toast.success(result.message ?? "Tag updated successfully");
        return { success: true, data: result.tag };
      } else {
        toast.error(result?.message ?? "Failed to update tag");
        return { success: false, errors: result?.errors };
      }
    } catch (error) {
      console.error("TagService.updateTag error:", error);
      toast.error("An unexpected error occurred");
      return { success: false, error };
    }
  }

  /**
   * Delete a tag
   */
  static async deleteTag(tagId: string) {
    try {
      const formData = new FormData();
      formData.append("id", tagId);

      const result = await deleteTagAction(formData);

      if (result?.success) {
        toast.success(result.message ?? "Tag deleted successfully");
        return { success: true };
      } else {
        toast.error(result?.message ?? "Failed to delete tag");
        return { success: false };
      }
    } catch (error) {
      console.error("TagService.deleteTag error:", error);
      toast.error("An unexpected error occurred");
      return { success: false, error };
    }
  }
}
