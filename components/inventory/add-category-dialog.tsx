"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createCategory } from "@/lib/action/category";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCategoryDialog({ open, onOpenChange }: AddCategoryDialogProps) {
  const router = useRouter();
  const [categoryName, setCategoryName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalized = categoryName.trim();
    if (!normalized) {
      toast.error("Please enter a category name.");
      return;
    }

    setIsCreating(true);
    const formData = new FormData();
    formData.append("name", normalized);

    try {
      const result = await createCategory(formData);
      if (result?.success) {
        toast.success(result.message ?? "Category created.");
        setCategoryName("");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result?.message ?? "Failed to create category.");
      }
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Unexpected error occurred.";
      toast.error("Failed to create category.", { description });
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isCreating) {
      setCategoryName("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Create a new category to organize your inventory items.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g., Graphics Cards"
              aria-label="Category name"
              disabled={isCreating}
              autoFocus
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || categoryName.trim().length === 0}>
              {isCreating ? "Adding..." : "Add Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

