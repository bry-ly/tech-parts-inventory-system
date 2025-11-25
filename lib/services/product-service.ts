/**
 * Client-side service layer for product operations
 * Wraps server actions with type safety and error handling
 */

import { toast } from "sonner";
import {
  createProduct as createProductAction,
  updateProduct as updateProductAction,
  deleteProduct as deleteProductAction,
  adjustStock as adjustStockAction,
  getProducts as getProductsAction,
} from "@/lib/action/product";

export class ProductService {
  /**
   * Create a new product
   */
  static async createProduct(formData: FormData) {
    try {
      const result = await createProductAction(formData);

      if (result?.success) {
        toast.success(result.message ?? "Product created successfully");
        return { success: true, data: result };
      } else {
        toast.error(result?.message ?? "Failed to create product");
        return { success: false, errors: result?.errors };
      }
    } catch (error) {
      console.error("ProductService.createProduct error:", error);
      toast.error("An unexpected error occurred");
      return { success: false, error };
    }
  }

  /**
   * Update an existing product
   */
  static async updateProduct(formData: FormData) {
    try {
      const result = await updateProductAction(formData);

      if (result?.success) {
        toast.success(result.message ?? "Product updated successfully");
        return { success: true, data: result };
      } else {
        toast.error(result?.message ?? "Failed to update product");
        return { success: false, errors: result?.errors };
      }
    } catch (error) {
      console.error("ProductService.updateProduct error:", error);
      toast.error("An unexpected error occurred");
      return { success: false, error };
    }
  }

  /**
   * Delete a product
   */
  static async deleteProduct(productId: string) {
    try {
      const formData = new FormData();
      formData.append("id", productId);

      const result = await deleteProductAction(formData);

      if (result?.success) {
        toast.success(result.message ?? "Product deleted successfully");
        return { success: true };
      } else {
        toast.error(result?.message ?? "Failed to delete product");
        return { success: false };
      }
    } catch (error) {
      console.error("ProductService.deleteProduct error:", error);
      toast.error("An unexpected error occurred");
      return { success: false, error };
    }
  }

  /**
   * Adjust stock quantity
   */
  static async adjustStock(
    productId: string,
    adjustment: number,
    note?: string
  ) {
    try {
      const formData = new FormData();
      formData.append("id", productId);
      formData.append("adjustment", String(adjustment));
      if (note) {
        formData.append("note", note);
      }

      const result = await adjustStockAction(formData);

      if (result?.success) {
        toast.success(result.message ?? "Stock adjusted successfully");
        return { success: true, data: result };
      } else {
        toast.error(result?.message ?? "Failed to adjust stock");
        return { success: false };
      }
    } catch (error) {
      console.error("ProductService.adjustStock error:", error);
      toast.error("An unexpected error occurred");
      return { success: false, error };
    }
  }

  /**
   * Get all products
   */
  static async getProducts() {
    try {
      const result = await getProductsAction();
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.message };
      }
    } catch (error) {
      console.error("ProductService.getProducts error:", error);
      return { success: false, error };
    }
  }
}
