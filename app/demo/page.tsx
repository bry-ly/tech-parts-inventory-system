import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  IconPackage,
  IconTruckDelivery,
  IconAlertTriangle,
  IconArrowUp,
  IconArrowDown,
  IconTrendingUp,
  IconBox,
  IconClock,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";

export default function DemoPage() {
  // Sample data
  const stats = [
    {
      title: "Total Products",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: IconPackage,
      description: "from last month",
    },
    {
      title: "Low Stock Items",
      value: "8",
      change: "-3",
      trend: "down",
      icon: IconAlertTriangle,
      description: "items need attention",
    },
    {
      title: "Total Suppliers",
      value: "23",
      change: "+2",
      trend: "up",
      icon: IconTruckDelivery,
      description: "active suppliers",
    },
    {
      title: "Inventory Value",
      value: "$45,231",
      change: "+8.2%",
      trend: "up",
      icon: IconTrendingUp,
      description: "from last month",
    },
  ];

  const recentProducts = [
    {
      name: "Intel Core i9-13900K",
      category: "Processors",
      quantity: 45,
      status: "In Stock",
    },
    {
      name: "NVIDIA RTX 4090",
      category: "Graphics Cards",
      quantity: 12,
      status: "In Stock",
    },
    {
      name: "Samsung 990 PRO 2TB",
      category: "Storage",
      quantity: 5,
      status: "Low Stock",
    },
    {
      name: "Corsair Vengeance DDR5",
      category: "Memory",
      quantity: 67,
      status: "In Stock",
    },
    {
      name: "ASUS ROG Maximus Z790",
      category: "Motherboards",
      quantity: 2,
      status: "Low Stock",
    },
  ];

  const recentActivities = [
    {
      action: "Product Added",
      item: "AMD Ryzen 9 7950X",
      time: "2 hours ago",
      user: "John Doe",
    },
    {
      action: "Stock Updated",
      item: "Intel Core i7-13700K",
      time: "4 hours ago",
      user: "Jane Smith",
    },
    {
      action: "Supplier Added",
      item: "Tech Distributors Inc.",
      time: "5 hours ago",
      user: "Admin",
    },
    {
      action: "Alert Created",
      item: "Low stock: Samsung 980 PRO",
      time: "6 hours ago",
      user: "System",
    },
    {
      action: "Product Removed",
      item: "Old GPU Model",
      time: "1 day ago",
      user: "John Doe",
    },
  ];

  // Demo user data for sidebar
  const demoUser = {
    name: "Demo User",
    email: "demo@techparts.com",
    avatar: "",
  };

  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar user={demoUser} />
        <SidebarInset>
          <SiteHeader title="Demo Dashboard">
            <div className="flex gap-2 ml-auto">
              <Link href="/">
                <Button variant="outline">Home</Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="default">Get Started</Button>
              </Link>
            </div>
          </SiteHeader>
           <main className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-muted/20">
            <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-8">
              {/* Demo Banner */}
              <div className="mb-8 rounded-lg border-2 border-primary/20 bg-primary/5 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="mb-2 text-2xl font-bold">Demo Dashboard</h1>
                    <p className="text-muted-foreground">
                      Experience the power of Tech Parts inventory management
                      with sample data. Sign up to create your own dashboard
                      with real inventory!
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/sign-up">
                      <Button size="lg" className="w-full sm:w-auto">
                        Start Free Trial
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span
                          className={`flex items-center ${
                            stat.trend === "up"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {stat.trend === "up" ? (
                            <IconArrowUp className="mr-1 h-3 w-3" />
                          ) : (
                            <IconArrowDown className="mr-1 h-3 w-3" />
                          )}
                          {stat.change}
                        </span>
                        {stat.description}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Products */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Products</CardTitle>
                    <CardDescription>
                      Latest products in your inventory
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentProducts.map((product, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.category}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">
                              Qty: {product.quantity}
                            </span>
                            <Badge
                              variant={
                                product.status === "In Stock"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {product.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest actions in your inventory system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0"
                        >
                          <div className="mt-0.5">
                            <IconClock className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-muted-foreground">
                              {activity.item}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {activity.time} • by {activity.user}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Features Showcase */}
              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Features</CardTitle>
                    <CardDescription>
                      Everything you need to manage your inventory
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="flex items-start gap-3">
                        <IconPackage className="mt-1 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Product Management</p>
                          <p className="text-sm text-muted-foreground">
                            Add, edit, and organize your inventory
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <IconTruckDelivery className="mt-1 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Supplier Tracking</p>
                          <p className="text-sm text-muted-foreground">
                            Manage vendor relationships
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <IconAlertTriangle className="mt-1 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Smart Alerts</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified of low stock levels
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <IconTrendingUp className="mt-1 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Analytics</p>
                          <p className="text-sm text-muted-foreground">
                            Track trends and insights
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <IconBox className="mt-1 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Stock Movements</p>
                          <p className="text-sm text-muted-foreground">
                            Track all inventory changes
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <IconClock className="mt-1 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Real-time Updates</p>
                          <p className="text-sm text-muted-foreground">
                            Instant synchronization
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* CTA Section */}
              <div className="mt-8 rounded-lg border bg-card p-8 text-center">
                <h2 className="mb-4 text-2xl font-bold">
                  Ready to Get Started?
                </h2>
                <p className="mb-6 text-muted-foreground">
                  Sign up now to create your own inventory management system
                  with real data
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Link href="/sign-up">
                    <Button size="lg" className="w-full sm:w-auto">
                      Create Free Account
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Footer */}
              <footer className="border-t py-8 mt-8">
                <div className="container px-4 text-center text-sm text-muted-foreground sm:px-8">
                  <p>
                    © 2025 Tech Parts. All rights reserved. This is a demo
                    dashboard with sample data.
                  </p>
                </div>
              </footer>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
