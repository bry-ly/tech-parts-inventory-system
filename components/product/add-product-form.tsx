"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { Zap, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { createProduct } from "@/application/actions/product.actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import Image from "next/image";

type FormState = {
  name: string;
  categoryId: string;
  manufacturer: string;
  model: string;
  sku: string;
  quantity: string;
  lowStockAt: string;
  condition: string;
  location: string;
  price: string;
  specs: string;
  compatibility: string;
  supplier: string;
  warrantyMonths: string;
  notes: string;
  imageUrl: string;
};

const CONDITIONS = ["new", "used", "refurbished", "for-parts"] as const;

const INITIAL_FORM_STATE: FormState = {
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
};

const createInitialFormState = (): FormState => ({ ...INITIAL_FORM_STATE });

type CategoryOption = {
  id: string;
  name: string;
};

export function AddProductForm({ categories }: { categories: CategoryOption[] }) {
  const [formData, setFormData] = useState<FormState>(() =>
    createInitialFormState()
  );
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const selectedCategory = categories.find(
    (category) => category.id === formData.categoryId
  );
  const isLowStock =
    Number(formData.quantity) > 0 &&
    Number(formData.lowStockAt) > 0 &&
    Number(formData.quantity) <= Number(formData.lowStockAt);

  const handleFormChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => {
      if (!previous[name]) {
        return previous;
      }

      const next = { ...previous };
      next[name] = [];
      return next;
    });
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please select an image file (JPEG, PNG, GIF, etc.)",
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error("File too large", {
        description: "Please select an image smaller than 5MB",
      });
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setFormData((previous) => ({
        ...previous,
        imageUrl: base64String,
      }));
    };
    reader.onerror = () => {
      toast.error("Failed to read file", {
        description: "Please try selecting the image again",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((previous) => ({
      ...previous,
      imageUrl: "",
    }));
  };

  const resetForm = () => {
    setFormData(createInitialFormState());
    setImagePreview(null);
    setErrors({});
  };

  const handleReset = () => {
    resetForm();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const form = event.currentTarget;
    const formDataPayload = new FormData(form);

    try {
      const result = await createProduct(formDataPayload);

      if (result?.success) {
        toast.success(result.message ?? "Product added successfully!", {
          description: "The product was added to your inventory.",
        });
        resetForm();
        form.reset();
      } else if (result?.errors) {
        setErrors(result.errors);
        toast.error(
          result.message ??
            "Validation failed. Please check the form for errors.",
          {
            description: "Please review the highlighted fields and try again.",
          }
        );
      } else {
        toast.error(result?.message ?? "Failed to add product.", {
          description: "An unexpected error occurred.",
        });
      }
    } catch (error) {
      const description =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

      toast.error("Failed to add product.", { description });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFieldErrors = (field: string) =>
    errors[field]?.map((message, index) => (
      <span key={`${field}-${index}`} className="text-xs text-red-600">
        {message}
      </span>
    ));

  return (
    <>
      <Toaster richColors position="top-right" />
      <form className="space-y-8" onSubmit={handleSubmit} onReset={handleReset}>
        <Card className=" ">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg"> Product details</CardTitle>
            <CardDescription>
              Provide the core identification details for the hardware
              component.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Field>
              <FieldLabel htmlFor="name">Product name *</FieldLabel>
              <FieldContent>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleFormChange}
                />
                {renderFieldErrors("name")}
              </FieldContent>
            </Field>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="categoryId">Category *</FieldLabel>
                <FieldContent>
                  <select
                  id="categoryId"
                  name="categoryId"
                  required={categories.length > 0}
                  value={formData.categoryId}
                    onChange={handleFormChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={categories.length === 0}
                  >
                    <option value="">
                      {categories.length === 0
                        ? "No categories available"
                        : "Select category"}
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {categories.length === 0 ? (
                    <span className="text-xs text-muted-foreground">
                      Create a category from the Categories page before adding products.
                    </span>
                  ) : null}
                  {renderFieldErrors("categoryId")}
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="manufacturer">Manufacturer *</FieldLabel>
                <FieldContent>
                <Input
                  id="manufacturer"
                  name="manufacturer"
                  required
                  placeholder="Who makes this product?"
                  value={formData.manufacturer}
                  onChange={handleFormChange}
                />
                  {renderFieldErrors("manufacturer")}
                </FieldContent>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="model">Model number</FieldLabel>
                <FieldContent>
                  <Input
                    id="model"
                    name="model"
                    placeholder="Model or part number"
                    value={formData.model}
                    onChange={handleFormChange}
                  />
                  {renderFieldErrors("model")}
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="sku">SKU</FieldLabel>
                <FieldContent>
                  <Input
                    id="sku"
                    name="sku"
                    placeholder="Internal SKU (optional)"
                    value={formData.sku}
                    onChange={handleFormChange}
                  />
                  {renderFieldErrors("sku")}
                </FieldContent>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="quantity">Quantity *</FieldLabel>
                <FieldContent>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    required
                    value={formData.quantity}
                    onChange={handleFormChange}
                  />
                  {renderFieldErrors("quantity")}
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="lowStockAt">
                  Low stock threshold
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="lowStockAt"
                    name="lowStockAt"
                    type="number"
                    min="0"
                    value={formData.lowStockAt}
                    onChange={handleFormChange}
                  />
                  {renderFieldErrors("lowStockAt")}
                  {isLowStock && (
                    <span className="text-xs text-amber-600">
                      Current quantity is at or below the low stock threshold.
                    </span>
                  )}
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="price">Price *</FieldLabel>
                <FieldContent>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleFormChange}
                  />
                  {renderFieldErrors("price")}
                </FieldContent>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="condition">Condition</FieldLabel>
                <FieldContent>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleFormChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select condition</option>
                    {CONDITIONS.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition.charAt(0).toUpperCase() + condition.slice(1)}
                      </option>
                    ))}
                  </select>
                  {renderFieldErrors("condition")}
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="location">Storage location</FieldLabel>
                <FieldContent>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g., Warehouse A, Shelf 3"
                    value={formData.location}
                    onChange={handleFormChange}
                  />
                  {renderFieldErrors("location")}
                </FieldContent>
              </Field>
            </div>
          </CardContent>
        </Card>

        {selectedCategory && (
          <Card className="">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">
                  Technical specifications
                </CardTitle>
              </div>
              <CardDescription>
                Capture technical data that helps your team validate
                compatibility.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Field>
                <FieldLabel htmlFor="specs">Detailed specs</FieldLabel>
                <FieldContent>
                  <Textarea
                    id="specs"
                    name="specs"
                    rows={4}
                    placeholder="List key specs or important details"
                    value={formData.specs}
                    onChange={handleFormChange}
                  />
                  {renderFieldErrors("specs")}
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="compatibility">
                  Compatibility notes
                </FieldLabel>
                <FieldContent>
                  <Textarea
                    id="compatibility"
                    name="compatibility"
                    rows={3}
                    placeholder="Describe compatible devices or requirements"
                    value={formData.compatibility}
                    onChange={handleFormChange}
                  />
                  {renderFieldErrors("compatibility")}
                </FieldContent>
              </Field>
            </CardContent>
          </Card>
        )}

        <Card className="">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Supply & warranty</CardTitle>
            <CardDescription>
              Track vendor and service coverage information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="supplier">Supplier/vendor</FieldLabel>
                <FieldContent>
                  <Input
                    id="supplier"
                    name="supplier"
                    placeholder="Preferred supplier (optional)"
                    value={formData.supplier}
                    onChange={handleFormChange}
                  />
                  {renderFieldErrors("supplier")}
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="warrantyMonths">
                  Warranty period (months)
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="warrantyMonths"
                    name="warrantyMonths"
                    type="number"
                    min="0"
                    placeholder="Warranty period in months"
                    value={formData.warrantyMonths}
                    onChange={handleFormChange}
                  />
                  {renderFieldErrors("warrantyMonths")}
                </FieldContent>
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Media & additional notes</CardTitle>
            <CardDescription>
              Attach references and internal remarks for your team.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Field>
              <FieldLabel htmlFor="imageFile">Product image</FieldLabel>
              <FieldContent>
                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative">
                      <div className="relative h-48 w-full overflow-hidden rounded-lg border">
                        <Image
                          src={imagePreview}
                          alt="Product preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveImage}
                        className="mt-2"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="imageFile"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                        <Input
                          id="imageFile"
                          name="imageFile"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  )}
                  {/* Hidden input to store base64 string */}
                  <Input
                    type="hidden"
                    name="imageUrl"
                    value={formData.imageUrl}
                  />
                </div>
                {renderFieldErrors("imageUrl")}
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="notes">Internal notes</FieldLabel>
              <FieldContent>
                <Textarea
                  id="notes"
                  name="notes"
                  rows={5}
                  placeholder="Share internal notes or handling tips"
                  value={formData.notes}
                  onChange={handleFormChange}
                />
                {renderFieldErrors("notes")}
              </FieldContent>
            </Field>
          </CardContent>
        </Card>
        <div className="flex gap-3">
          <Button
            type="submit"
            size="lg"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add product to inventory"}
          </Button>
          <Button
            type="reset"
            variant="secondary"
            size="lg"
            disabled={isSubmitting}
          >
            Clear form
          </Button>
        </div>
      </form>
    </>
  );
}
