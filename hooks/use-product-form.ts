/**
 * Custom hook for managing product form state
 * Centralizes form state management, validation, and submission
 */

import { type ChangeEvent, type FormEvent, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProduct, updateProduct } from "@/lib/action/product";
import type { ProductFormData } from "@/lib/types";

const INITIAL_FORM_STATE: ProductFormData = {
  name: "",
  categoryId: "",
  manufacturer: "",
  model: "",
  sku: "",
  quantity: "0",
  lowStockAt: "",
  condition: "new",
  location: "",
  price: "0",
  specs: "",
  compatibility: "",
  supplier: "",
  warrantyMonths: "",
  notes: "",
  imageUrl: "",
  tagIds: [],
};

interface UseProductFormOptions {
  initialData?: Partial<ProductFormData>;
  productId?: string;
  onSuccess?: () => void;
}

export function useProductForm(options: UseProductFormOptions = {}) {
  const { initialData, productId, onSuccess } = options;
  const router = useRouter();

  const [formData, setFormData] = useState<ProductFormData>({
    ...INITIAL_FORM_STATE,
    ...initialData,
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = event.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear error for this field when user starts typing
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleTagToggle = useCallback((tagId: string) => {
    setFormData((prev) => {
      const currentTags = prev.tagIds || [];
      const newTags = currentTags.includes(tagId)
        ? currentTags.filter((id) => id !== tagId)
        : [...currentTags, tagId];
      return { ...prev, tagIds: newTags };
    });
  }, []);

  const updateFormData = useCallback((updates: Partial<ProductFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ ...INITIAL_FORM_STATE, ...initialData });
    setErrors({});
  }, [initialData]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSubmitting(true);
      setErrors({});

      const formDataToSubmit = new FormData();

      // Add all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "tagIds" && Array.isArray(value)) {
          value.forEach((tagId) => formDataToSubmit.append("tagIds", tagId));
        } else if (value !== "" && value != null) {
          formDataToSubmit.append(key, String(value));
        }
      });

      try {
        let result;

        if (productId) {
          // Update existing product
          formDataToSubmit.append("id", productId);
          result = await updateProduct(formDataToSubmit);
        } else {
          // Create new product
          result = await createProduct(formDataToSubmit);
        }

        if (result?.success) {
          toast.success(result.message ?? "Product saved successfully");
          resetForm();
          router.refresh();
          onSuccess?.();
        } else {
          if (result?.errors) {
            setErrors(result.errors);
          }
          toast.error(result?.message ?? "Failed to save product");
        }
      } catch (error) {
        console.error("Form submission error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, productId, router, resetForm, onSuccess]
  );

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleTagToggle,
    updateFormData,
    handleSubmit,
    resetForm,
  };
}
