"use client";

import { type Icon } from "@tabler/icons-react";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/action/product";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const router = useRouter();
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [quickCreateValue, setQuickCreateValue] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [price, setPrice] = useState("");
  const [isSubmitting, startTransition] = useTransition();

  return (
      <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2 overflow-hidden">
        {/* Quick Create Button */}
        <SidebarMenuItem className="flex min-w-0 items-center gap-2">
          <SidebarMenuButton
            tooltip="Quick Create"
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 w-full duration-200 ease-linear"
            onClick={() => setQuickCreateOpen(true)}
          >
            <IconCirclePlusFilled />
            <span className="truncate">Quick Create</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span className="truncate">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        {/* Quick Create Dialog */}
        <Dialog open={quickCreateOpen} onOpenChange={setQuickCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Quick Create Product</DialogTitle>
              <DialogDescription>
                Quickly add a new product to your inventory
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!quickCreateValue.trim()) {
                  toast.error("Product name is required");
                  return;
                }
                if (!manufacturer.trim()) {
                  toast.error("Manufacturer is required");
                  return;
                }

                startTransition(async () => {
                  const formData = new FormData();
                  formData.append("name", quickCreateValue.trim());
                  formData.append("manufacturer", manufacturer.trim());
                  formData.append("price", price || "0");
                  formData.append("quantity", "0");

                  try {
                    const result = await createProduct(formData);
                    if (result?.success) {
                      toast.success(result.message ?? "Product created successfully!");
                      setQuickCreateOpen(false);
                      setQuickCreateValue("");
                      setManufacturer("");
                      setPrice("");
                      router.refresh();
                    } else if (result?.errors) {
                      const errorMessages = Object.values(result.errors)
                        .flat()
                        .join(", ");
                      toast.error(result.message ?? "Validation failed", {
                        description: errorMessages,
                      });
                    } else {
                      toast.error(result?.message ?? "Failed to create product.");
                    }
                  } catch (error) {
                    toast.error("Failed to create product.", {
                      description:
                        error instanceof Error
                          ? error.message
                          : "An unexpected error occurred.",
                    });
                  }
                });
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="quick-name">Product Name *</Label>
                <Input
                  id="quick-name"
                  value={quickCreateValue}
                  onChange={(e) => setQuickCreateValue(e.target.value)}
                  placeholder="Enter product name..."
                  autoFocus
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quick-manufacturer">Manufacturer *</Label>
                <Input
                  id="quick-manufacturer"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  placeholder="Enter manufacturer..."
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quick-price">Price (Optional)</Label>
                <Input
                  id="quick-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  disabled={isSubmitting}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setQuickCreateOpen(false);
                    setQuickCreateValue("");
                    setManufacturer("");
                    setPrice("");
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
