// Category use cases - application layer business logic
import type { CategoryRepository } from "@/domain/interfaces/category.repository";
import {
  CategoryCreateSchema,
  type CategoryCreateInput,
  type CategoryCreateResult,
  type CategoryUpdateResult,
  type CategoryDeleteResult,
} from "@/application/dto/category.dto";

export class CategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async createCategory(
    userId: string,
    input: CategoryCreateInput
  ): Promise<CategoryCreateResult> {
    const parsed = CategoryCreateSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: this.formatValidationErrors(parsed.error.issues),
      };
    }

    const normalizedName = parsed.data.name;

    const existing = await this.categoryRepository.findByName(
      userId,
      normalizedName
    );

    if (existing) {
      return {
        success: false,
        message: "Category already exists.",
        errors: { name: ["Category name already in use."] },
      };
    }

    const category = await this.categoryRepository.create({
      userId,
      name: normalizedName,
    });

    return {
      success: true,
      message: "Category created successfully.",
      category: {
        id: category.id,
        name: category.name,
      },
    };
  }

  async updateCategory(
    userId: string,
    categoryId: string,
    input: CategoryCreateInput
  ): Promise<CategoryUpdateResult> {
    if (!categoryId) {
      return {
        success: false,
        message: "Category identifier is required.",
        errors: { id: ["Category identifier is required."] },
      };
    }

    const category = await this.categoryRepository.findById(
      categoryId,
      userId
    );

    if (!category) {
      return {
        success: false,
        message: "Category not found or access denied.",
      };
    }

    const parsed = CategoryCreateSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: this.formatValidationErrors(parsed.error.issues),
      };
    }

    const normalizedName = parsed.data.name;

    const duplicate = await this.categoryRepository.findByName(
      userId,
      normalizedName
    );

    if (duplicate && duplicate.id !== categoryId) {
      return {
        success: false,
        message: "Another category already uses that name.",
        errors: { name: ["Another category already uses that name."] },
      };
    }

    const updated = await this.categoryRepository.update(categoryId, userId, {
      name: normalizedName,
    });

    return {
      success: true,
      message: "Category renamed successfully.",
      category: {
        id: updated.id,
        name: updated.name,
      },
    };
  }

  async deleteCategory(
    userId: string,
    categoryId: string
  ): Promise<CategoryDeleteResult> {
    if (!categoryId) {
      return {
        success: false,
        message: "Category identifier is required.",
        errors: { id: ["Category identifier is required."] },
      };
    }

    const category = await this.categoryRepository.findById(
      categoryId,
      userId
    );

    if (!category) {
      return {
        success: false,
        message: "Category not found or access denied.",
      };
    }

    await this.categoryRepository.delete(categoryId, userId);

    return {
      success: true,
      message: "Category deleted successfully.",
    };
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

