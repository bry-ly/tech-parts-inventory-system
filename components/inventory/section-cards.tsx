import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards({
  totalRevenue,
  totalProducts,
  lowStockCount,
  recentProducts,
}: {
  totalRevenue?: number;
  totalProducts?: number;
  lowStockCount?: number;
  recentProducts?: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-2 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardDescription>Total Revenue</CardDescription>
            <Badge variant="outline" className="gap-1">
              <IconTrendingUp className="size-3" />
              +12.5%
            </Badge>
          </div>
          <CardTitle className="text-3xl font-bold tabular-nums">
            $
            {totalRevenue?.toLocaleString(undefined, {
              style: "decimal",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) || "0.00"}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm pt-0">
          <div className="flex items-center gap-1 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground text-xs">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardDescription>New Customers</CardDescription>
            <Badge variant="outline" className="gap-1">
              <IconTrendingDown className="size-3" />
              -20%
            </Badge>
          </div>
          <CardTitle className="text-3xl font-bold tabular-nums">
            {totalProducts?.toLocaleString() ?? "0"}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm pt-0">
          <div className="flex items-center gap-1 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground text-xs">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardDescription>Active Accounts</CardDescription>
            <Badge variant="outline" className="gap-1">
              <IconTrendingUp className="size-3" />
              +12.5%
            </Badge>
          </div>
          <CardTitle className="text-3xl font-bold tabular-nums">
            {lowStockCount?.toLocaleString() ?? "0"}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm pt-0">
          <div className="flex items-center gap-1 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground text-xs">
            Engagement exceed targets
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardDescription>Growth Rate</CardDescription>
            <Badge variant="outline" className="gap-1">
              <IconTrendingUp className="size-3" />
              +4.5%
            </Badge>
          </div>
          <CardTitle className="text-3xl font-bold tabular-nums">
            {recentProducts?.toLocaleString() ?? "0"}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm pt-0">
          <div className="flex items-center gap-1 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground text-xs">
            Meets growth projections
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
