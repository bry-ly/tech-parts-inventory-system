import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards({
  totalRevenue,
  totalProducts,
  lowStockCount,
  recentProducts,
}: {
  totalRevenue?: number
  totalProducts?: number
  lowStockCount?: number
  recentProducts?: number
}) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${totalRevenue?.toLocaleString(undefined, {
              style: "decimal",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) || "0.00"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {/* Revenue trend placeholder */}+0.0%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Real revenue from inventory <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Calculated from product prices × quantities
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Products</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalProducts ?? 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />+0.0%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Products in stock <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Live from database</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Low-stock Products</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {lowStockCount ?? 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />{/* Placeholder trend */}-0.0%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Products at or below low stock threshold <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">Consider restocking</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Products (7d)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {recentProducts ?? 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />{/* Placeholder trend */}+0.0%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Added in last 7 days <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Shows recent inventory growth</div>
        </CardFooter>
      </Card>
    </div>
  )
}
