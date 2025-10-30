
import { createProduct } from "@/lib/action/product";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";

export default async function AddProductPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user) {
    redirect("/sign-in");
  }
  const user = session.user;
  const userSidebar = {
    name: user.name ?? user.email ?? "User",
    email: user.email ?? "",
    avatar: user.image ?? "/avatars/shadcn.jpg",
  };

  // For client-side preview state, use useState. For server components, move logic into a separate client form if required.
  // Here, add a file input using <Input type='file' ... />

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar user={userSidebar} variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-accent-foreground">
                  Add Product
                </h1>
                <p className="text-sm text-muted-foreground">
                  Add a new product to your inventory
                </p>
              </div>
            </div>
          </div>
          <div className="max-w-7xl">
            <Card>
              <CardHeader>
                <CardTitle>Add a product</CardTitle>
                <CardDescription>All fields marked * are required.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" action={createProduct} encType="multipart/form-data">
                  <Field>
                    <FieldLabel>Product Name *</FieldLabel>
                    <FieldContent>
                      <Input type="text" id="name" name="name" required placeholder="Enter Product Name" />
                    </FieldContent>
                  </Field>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field>
                      <FieldLabel>Quantity *</FieldLabel>
                      <FieldContent>
                        <Input type="number" id="quantity" name="quantity" required min="0" placeholder="0" />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel>Price *</FieldLabel>
                      <FieldContent>
                        <Input type="number" id="price" name="price" required step="0.01" min="0" placeholder="0.00" />
                      </FieldContent>
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel>SKU (optional)</FieldLabel>
                    <FieldContent>
                      <Input type="text" id="sku" name="sku" placeholder="Enter SKU" />
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel>Low Stock At (optional)</FieldLabel>
                    <FieldContent>
                      <Input type="number" id="lowStockAt" name="lowStockAt" min="0" placeholder="Enter low stock threshold" />
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel>Product Image (optional)</FieldLabel>
                    <FieldContent>
                      <Input type="file" id="imageUrl" name="imageUrl" accept="image/*" />
                      {/* Optionally: UI for previewing the selected image would require a client-side component */}
                    </FieldContent>
                  </Field>
                  <div className="flex gap-5">
                    <Button type="submit" variant="default" size="lg">Add Product</Button>
                    <Link href="/inventory">
                      <Button type="button" variant="secondary" size="lg">Cancel</Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
