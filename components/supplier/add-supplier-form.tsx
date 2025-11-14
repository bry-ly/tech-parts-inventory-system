"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupplier } from "@/application/actions/supplier.actions";
import { toast } from "sonner";

export function AddSupplierForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createSupplier(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Supplier created successfully!");
      e.currentTarget.reset();
      onSuccess?.();
    }

    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Supplier</CardTitle>
        <CardDescription>Create a new supplier for your inventory</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Supplier Name *</Label>
              <Input id="name" name="name" required placeholder="Enter supplier name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input id="contactPerson" name="contactPerson" placeholder="Enter contact person" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="supplier@example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+1 234 567 8900" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" name="website" type="url" placeholder="https://example.com" />
            </div>

            <div className="space-y-2 flex items-center justify-between">
              <Label htmlFor="active">Active</Label>
              <Switch id="active" name="active" defaultChecked />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" name="address" placeholder="Enter supplier address" rows={2} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" placeholder="Additional notes" rows={3} />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Supplier"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}



