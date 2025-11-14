"use client";

import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { AddCategoryDialog } from "@/components/inventory/add-category-dialog";

export function AddCategoryButton() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        size="sm"
        variant="outline"
      >
        <IconPlus className="mr-2 h-4 w-4" />
        Add Category
      </Button>
      <AddCategoryDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}

