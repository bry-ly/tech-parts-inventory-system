"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconCurrencyPeso,
  IconShoppingCart,
  IconChartBar,
} from "@tabler/icons-react";

interface SalesSummaryProps {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

export function SalesSummary({
  totalRevenue,
  totalOrders,
  averageOrderValue,
}: SalesSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <IconCurrencyPeso className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₱{totalRevenue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Total revenue from completed sales
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <IconShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrders}</div>
          <p className="text-xs text-muted-foreground">
            Total number of completed orders
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Avg. Order Value
          </CardTitle>
          <IconChartBar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₱{averageOrderValue.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            Average revenue per order
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
