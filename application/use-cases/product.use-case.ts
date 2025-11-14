// Product use cases - application layer business logic
import type { ProductRepository } from "@/domain/interfaces/product.repository";
import type { CategoryRepository } from "@/domain/interfaces/category.repository";
import {
  ProductCreateSchema,
  type ProductCreateInput,
  type ProductCreateResult,
  type ProductUpdateResult,
  type ProductDeleteResult,
  type StockAdjustmentResult,
} from "@/application/dto/product.dto";

export class ProductUseCase {
  constructor(
    private productRepository: ProductRepository,
    private categoryRepository: CategoryRepository
  ) {}

  async createProduct(
    userId: string,
    input: ProductCreateInput
  ): Promise<ProductCreateResult> {
    const parsed = ProductCreateSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed. Please check the form for errors.",
        errors: this.formatValidationErrors(parsed.error.issues),
      };
    }

    try {
      const { categoryId, ...productData } = parsed.data;
      let resolvedCategoryId: string | null = null;

      if (categoryId) {
        const category = await this.categoryRepository.findById(
          categoryId,
          userId
        );

        if (!category) {
          return {
            success: false,
            message: "Category not found or access denied.",
            errors: { categoryId: ["Category not found or access denied."] },
          };
        }
        resolvedCategoryId = category.id;
      }

      await this.productRepository.create({
        ...productData,
        categoryId: resolvedCategoryId,
        userId,
        model: productData.model ?? null,
        sku: productData.sku ?? null,
        lowStockAt: productData.lowStockAt ?? null,
        location: productData.location ?? null,
        specs: productData.specs ?? null,
        compatibility: productData.compatibility ?? null,
        supplier: productData.supplier ?? null,
        warrantyMonths: productData.warrantyMonths ?? null,
        notes: productData.notes ?? null,
        imageUrl: productData.imageUrl ?? null,
      });

      return {
        success: true,
        message: "Product added successfully!",
        errors: {},
      };
    } catch {
      return {
        success: false,
        message: "Failed to create product.",
        errors: { server: ["Failed to create product."] },
      };
    }
  }

  async updateProduct(
    userId: string,
    productId: string,
    input: ProductCreateInput
  ): Promise<ProductUpdateResult> {
    const existing = await this.productRepository.findById(productId, userId);

    if (!existing) {
      return {
        success: false,
        message: "Product not found or access denied.",
        errors: { id: ["Product not found or access denied."] },
      };
    }

    const parsed = ProductCreateSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed. Please check the form for errors.",
        errors: this.formatValidationErrors(parsed.error.issues),
      };
    }

    try {
      const { categoryId, ...productData } = parsed.data;
      let resolvedCategoryId: string | null = null;

      if (categoryId) {
        const category = await this.categoryRepository.findById(
          categoryId,
          userId
        );

        if (!category) {
          return {
            success: false,
            message: "Category not found or access denied.",
            errors: { categoryId: ["Category not found or access denied."] },
          };
        }
        resolvedCategoryId = category.id;
      }

      await this.productRepository.update(productId, {
        ...productData,
        categoryId: resolvedCategoryId,
        model: productData.model ?? null,
        sku: productData.sku ?? null,
        lowStockAt: productData.lowStockAt ?? null,
        location: productData.location ?? null,
        specs: productData.specs ?? null,
        compatibility: productData.compatibility ?? null,
        supplier: productData.supplier ?? null,
        warrantyMonths: productData.warrantyMonths ?? null,
        notes: productData.notes ?? null,
        imageUrl: productData.imageUrl ?? null,
      });

      return {
        success: true,
        message: "Product updated successfully.",
        errors: {},
      };
    } catch {
      return {
        success: false,
        message: "Failed to update product.",
        errors: { server: ["Failed to update product."] },
      };
    }
  }

  async deleteProduct(
    userId: string,
    productId: string
  ): Promise<ProductDeleteResult> {
    if (!productId) {
      return {
        success: false,
        message: "Product identifier missing.",
      };
    }

    const existing = await this.productRepository.findById(productId, userId);

    if (!existing) {
      return {
        success: false,
        message: "Product not found or access denied.",
      };
    }

    await this.productRepository.delete(productId, userId);

    return {
      success: true,
      message: "Product deleted successfully.",
    };
  }

  async adjustStock(
    userId: string,
    productId: string,
    adjustment: number
  ): Promise<StockAdjustmentResult> {
    if (!productId) {
      return {
        success: false,
        message: "Product identifier missing.",
        errors: { id: ["Product identifier is required."] },
      };
    }

    if (isNaN(adjustment)) {
      return {
        success: false,
        message: "Invalid adjustment value.",
        errors: { adjustment: ["Adjustment must be a number."] },
      };
    }

    const existing = await this.productRepository.findById(productId, userId);

    if (!existing) {
      return {
        success: false,
        message: "Product not found or access denied.",
        errors: { id: ["Product not found or access denied."] },
      };
    }

    const newQuantity = existing.quantity + adjustment;
    if (newQuantity < 0) {
      return {
        success: false,
        message: "Cannot adjust stock below zero.",
        errors: {
          adjustment: [
            `Cannot adjust below 0. Current stock: ${existing.quantity}`,
          ],
        },
      };
    }

    try {
      await this.productRepository.updateQuantity(
        productId,
        newQuantity
      );

      return {
        success: true,
        message: `Stock adjusted successfully. New quantity: ${newQuantity}`,
        errors: {},
      };
    } catch {
      return {
        success: false,
        message: "Failed to adjust stock.",
        errors: { server: ["Failed to adjust stock."] },
      };
    }
  }

  private formatValidationErrors(issues: any[]) {
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
}

