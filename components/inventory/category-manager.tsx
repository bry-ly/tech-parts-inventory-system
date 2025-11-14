"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { IconEdit, IconTrash } from "@tabler/icons-react";

import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/application/actions/category.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type CategorySummary = {
  id: string;
  name: string;
  productCount: number;
};

type CategoryManagerProps = {
  categories: CategorySummary[];
  totalProducts?: number;
};

export function CategoryManager({
  categories,
  totalProducts = 0,
}: CategoryManagerProps) {
  const router = useRouter();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateCategory = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const normalized = newCategoryName.trim();
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
        setNewCategoryName("");
        setAddDialogOpen(false);
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

  const startEditing = (category: CategorySummary) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleRename = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingId) {
      return;
    }

    const normalized = editingName.trim();
    if (!normalized) {
      toast.error("Category name cannot be empty.");
      return;
    }

    setRenamingId(editingId);
    const formData = new FormData();
    formData.append("id", editingId);
    formData.append("name", normalized);

    try {
      const result = await updateCategory(formData);
      if (result?.success) {
        toast.success(result.message ?? "Category updated.");
        router.refresh();
        cancelEditing();
      } else {
        toast.error(result?.message ?? "Failed to update category.");
      }
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Unexpected error occurred.";
      toast.error("Failed to update category.", { description });
    } finally {
      setRenamingId(null);
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    if (!deleteId) {
      return;
    }

    setIsDeleting(true);
    const formData = new FormData();
    formData.append("id", deleteId);

    try {
      const result = await deleteCategory(formData);
      if (result?.success) {
        toast.success(result.message ?? "Category deleted.");
        router.refresh();
      } else {
        toast.error(result?.message ?? "Failed to delete category.");
      }
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Unexpected error occurred.";
      toast.error("Failed to delete category.", { description });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const categoryToDelete = categories.find(
    (category) => category.id === deleteId
  );

  const categorizedProducts = categories.reduce(
    (sum, category) => sum + category.productCount,
    0
  );
  const uncategorizedProducts = totalProducts - categorizedProducts;

  return (
    <>
      <Card className="h-fit border border-border bg-card text-card-foreground shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Categories</CardTitle>
              <CardDescription>
                Organize inventory into quick filters and ensure new items are
                grouped correctly.
              </CardDescription>
            </div>
            <div className="flex justify-end flex-wrap items-center gap-2 flex-1">
              <Badge variant="secondary">Total: {categories.length}</Badge>
              <Badge variant="outline">
                Categorized: {categorizedProducts}
              </Badge>
              <Badge variant="outline">
                Uncategorized: {Math.max(uncategorizedProducts, 0)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex w-full items-center gap-2 flex-1 justify-end">
            {/* Button to open add category dialog */}
            <Button type="button" onClick={() => setAddDialogOpen(true)}>
              Add Category
            </Button>
            {/* New Refresh button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => router.refresh()}
            >
              Refresh
            </Button>
          </div>

          <Separator />

          <div className="space-y-3">
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No categories yet. Create one to start organizing your products.
              </p>
            ) : (
              categories.map((category) => {
                const isEditing = editingId === category.id;
                const isRenaming = renamingId === category.id;
                return (
                  <div
                    key={category.id}
                    className="flex flex-col gap-3 rounded-lg border border-border/60 p-3 transition hover:border-border"
                  >
                    {isEditing ? (
                      <form
                        className="flex flex-col gap-2"
                        onSubmit={handleRename}
                      >
                        <Input
                          value={editingName}
                          autoFocus
                          onChange={(event) =>
                            setEditingName(event.target.value)
                          }
                          placeholder="Category name"
                          disabled={isRenaming}
                        />
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={cancelEditing}
                            disabled={isRenaming}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" size="sm" disabled={isRenaming}>
                            {isRenaming ? "Saving..." : "Save"}
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground gap-2 flex items-center">
                            {category.name}
                            <Badge variant="outline" className="w-fit text-xs">
                              {category.productCount}{" "}
                              {category.productCount === 1 ? "item" : "items"}
                            </Badge>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => startEditing(category)}
                            aria-label={`Rename ${category.name}`}
                          >
                            <IconEdit className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive focus:text-destructive"
                            onClick={() => confirmDelete(category.id)}
                            aria-label={`Delete ${category.name}`}
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Enter the name for the new category.
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4" onSubmit={handleCreateCategory}>
            <Input
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
              placeholder="e.g., Beverages"
              aria-label="New category name"
              disabled={isCreating}
              autoFocus
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={isCreating || newCategoryName.trim().length === 0}
              >
                {isCreating ? "Adding..." : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ...existing code for AlertDialog (delete confirmation)... */}
      <AlertDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && !isDeleting && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category</AlertDialogTitle>
            <AlertDialogDescription>
              {categoryToDelete ? (
                <>
                  This will remove <strong>{categoryToDelete.name}</strong> from
                  your inventory.{" "}
                  {categoryToDelete.productCount > 0
                    ? `Products in this category will move to "Uncategorized".`
                    : "No products are currently assigned to this category."}
                </>
              ) : (
                "Are you sure you want to delete this category?"
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
