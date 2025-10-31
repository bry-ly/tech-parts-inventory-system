"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { Info, Zap } from "lucide-react";
import { toast } from "sonner";

import { createProduct } from "@/lib/action/product";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Uploader } from "@/components/uploader/uploader";

type FormState = {
  name: string;
  category: string;
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

const CATEGORIES = [
  "processors",
  "motherboards",
  "memory",
  "storage",
  "graphics",
  "networking",
  "peripherals",
  "cooling",
] as const;

const CONDITIONS = ["new", "used", "refurbished", "for-parts"] as const;

const INITIAL_FORM_STATE: FormState = {
  name: "",
  category: "",
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

export function AddProductForm() {
  const [formData, setFormData] = useState<FormState>(() =>
    createInitialFormState(),
  );
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCategory = formData.category;
  const isLowStock =
    Number(formData.quantity) > 0 &&
    Number(formData.lowStockAt) > 0 &&
    Number(formData.quantity) <= Number(formData.lowStockAt);

  const handleFormChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
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

  const resetForm = () => {
    setFormData(createInitialFormState());
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
          },
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
      <form
        className="space-y-8"
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        <Card className="w-6xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Component details</CardTitle>
            <CardDescription>
              Provide the core identification details for the hardware
              component.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Field>
              <FieldLabel htmlFor="name">Component name *</FieldLabel>
              <FieldContent>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="e.g., RTX 4090 Founders Edition"
                  value={formData.name}
                  onChange={handleFormChange}
                />
                {renderFieldErrors("name")}
              </FieldContent>
            </Field>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="category">Category *</FieldLabel>
                <FieldContent>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleFormChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                  {renderFieldErrors("category")}
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="manufacturer">Manufacturer *</FieldLabel>
                <FieldContent>
                  <Input
                    id="manufacturer"
                    name="manufacturer"
                    required
                    placeholder="e.g., NVIDIA"
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
                    placeholder="e.g., AD102"
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
                    placeholder="e.g., SKU-4090-001"
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
          <Card className="max-w-6xl w-6xl">
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
                    placeholder={`e.g., For ${selectedCategory}: Memory capacity, power consumption, interface type, etc.`}
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
                    placeholder="e.g., Compatible with DDR5, LGA1700 socket, etc."
                    value={formData.compatibility}
                    onChange={handleFormChange}
                  />
                  {renderFieldErrors("compatibility")}
                </FieldContent>
              </Field>
            </CardContent>
          </Card>
        )}

        <Card className="max-w-6xl w-6xl">
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
                    placeholder="e.g., TechCorp Supplies Inc."
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
                    placeholder="e.g., 24"
                    value={formData.warrantyMonths}
                    onChange={handleFormChange}
                  />
                  {renderFieldErrors("warrantyMonths")}
                </FieldContent>
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card className="w-6xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Media & additional notes</CardTitle>
            <CardDescription>
              Attach references and internal remarks for your team.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field>
                <FieldLabel>Product image</FieldLabel>
                <FieldContent>
                  <Uploader />
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
                    placeholder="Add internal notes for your team..."
                    value={formData.notes}
                    onChange={handleFormChange}
                  />
                  {renderFieldErrors("notes")}
                </FieldContent>
              </Field>
            </div>
          </CardContent>
        </Card>

        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950 center justify-center flex w-6xl">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>Pro tips:</strong> Use consistent category names, capture
            compatibility details, and enable low stock alerts to stay ahead of
            shortages.
          </AlertDescription>
        </Alert>

        <div className="flex gap-3 w-50 ml-100">
          <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add product to inventory"}
          </Button>
          <Button type="reset" variant="secondary" size="lg" disabled={isSubmitting}>
            Clear form
          </Button>
        </div>
      </form>
    </>
  );
}
