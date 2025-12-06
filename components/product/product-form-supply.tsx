use client

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function ProductFormSupply() {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="supplier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier/vendor</FormLabel>
              <FormControl>
                <Input
                  placeholder="Preferred supplier (optional)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="warrantyMonths"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Warranty period (months)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  placeholder="Warranty period in months"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}