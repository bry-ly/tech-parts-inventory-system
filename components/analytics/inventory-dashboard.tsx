"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentMetrics, getStockMovementSummary } from "@/application/actions/inventory-analytics.actions";
import { IconPackage, IconAlertTriangle, IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";

export function InventoryDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [movementSummary, setMovementSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [metricsResult, movementResult] = await Promise.all([
        getCurrentMetrics(),
        getStockMovementSummary(30),
      ]);

      if (metricsResult.data) setMetrics(metricsResult.data);
      if (movementResult.data) setMovementSummary(movementResult.data);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <IconPackage className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.totalQuantity || 0} units in stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics?.totalValue?.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg: ${metrics?.averageValue?.toFixed(2) || "0.00"} per product
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <IconAlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.lowStockCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Products below threshold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <IconTrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.outOfStockCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Products need restocking
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>30-Day Movement Summary</CardTitle>
          <CardDescription>Stock movements in the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Stock In</p>
              <p className="text-2xl font-bold text-green-600">
                +{movementSummary?.totalIn || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stock Out</p>
              <p className="text-2xl font-bold text-red-600">
                -{movementSummary?.totalOut || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Returns</p>
              <p className="text-2xl font-bold text-blue-600">
                +{movementSummary?.totalReturns || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Net Change</p>
              <p
                className={`text-2xl font-bold ${
                  (movementSummary?.netChange || 0) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {(movementSummary?.netChange || 0) >= 0 ? "+" : ""}
                {movementSummary?.netChange || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



