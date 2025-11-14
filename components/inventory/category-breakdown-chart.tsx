"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "Products",
    color: "var(--chart-1)",
  },
  value: {
    label: "Value",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function CategoryBreakdownChart({
  data,
}: {
  data: { category: string; count: number; value: number }[];
}) {
  const chartData = React.useMemo(() => {
    return data
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
      .map((item) => ({
        category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
        count: item.count,
        value: Math.round(item.value),
      }));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>Products and value by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `₱${value.toLocaleString()}`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(value) => `Category: ${value}`}
                  formatter={(value, name) => [
                    name === "value"
                      ? `₱${Number(value).toLocaleString()}`
                      : `${value} items`,
                    name === "value" ? "Value" : "Count",
                  ]}
                />
              }
            />
            <Bar dataKey="value" fill="var(--color-value)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

