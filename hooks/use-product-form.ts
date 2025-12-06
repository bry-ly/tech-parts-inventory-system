/**
 * @deprecated This hook has been replaced by the modern ProductForm component
 * using react-hook-form + zodResolver. Use ProductForm instead.
 * 
 * @example
 * // Old usage:
 * const { formData, errors, isSubmitting, handleChange, handleSubmit } = useProductForm();
 * 
 * // New usage:
 * <ProductForm
 *   categories={categories}
 *   tags={tags}
 *   mode="add"
 *   onSubmit={handleSubmit}
 * />
 */

// This file is kept for backward compatibility but should not be used in new code
export function useProductForm() {
  throw new Error(
    "useProductForm is deprecated. Use the ProductForm component instead."
  );
}