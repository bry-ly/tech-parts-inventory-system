"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Supplier } from "@/domain/entities/supplier.entity";
import { getAllSuppliers, deleteSupplier } from "@/application/actions/supplier.actions";
import { toast } from "sonner";
import { IconTrash, IconMail, IconPhone, IconWorld } from "@tabler/icons-react";

export function SupplierList() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadSuppliers() {
    setLoading(true);
    const result = await getAllSuppliers();
    if (result.error) {
      toast.error(result.error);
    } else {
      setSuppliers(result.data || []);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this supplier?")) return;

    const result = await deleteSupplier(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Supplier deleted successfully");
      loadSuppliers();
    }
  }

  useEffect(() => {
    loadSuppliers();
  }, []);

  if (loading) {
    return <div>Loading suppliers...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suppliers</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No suppliers found
                </TableCell>
              </TableRow>
            ) : (
              suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.contactPerson || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm">
                      {supplier.email && (
                        <div className="flex items-center gap-1">
                          <IconMail size={14} />
                          <span>{supplier.email}</span>
                        </div>
                      )}
                      {supplier.phone && (
                        <div className="flex items-center gap-1">
                          <IconPhone size={14} />
                          <span>{supplier.phone}</span>
                        </div>
                      )}
                      {supplier.website && (
                        <div className="flex items-center gap-1">
                          <IconWorld size={14} />
                          <a
                            href={supplier.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Website
                          </a>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={supplier.active ? "default" : "secondary"}>
                      {supplier.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(supplier.id)}
                    >
                      <IconTrash size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}



