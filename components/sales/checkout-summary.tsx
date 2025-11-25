"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  IconCash,
  IconCreditCard,
  IconBrandPaypal,
  IconReceipt,
} from "@tabler/icons-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CheckoutSummaryProps {
  total: number;
  onCheckout: (
    customer: string,
    paymentMethod: string,
    discount: number,
    taxRate: number,
    notes: string
  ) => Promise<void>;
  isProcessing: boolean;
  disabled: boolean;
}

export function CheckoutSummary({
  total,
  onCheckout,
  isProcessing,
  disabled,
}: CheckoutSummaryProps) {
  const [customer, setCustomer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [discount, setDiscount] = useState("");
  const [taxRate, setTaxRate] = useState("12"); // Default 12% VAT
  const [notes, setNotes] = useState("");

  const discountAmount = Number(discount) || 0;
  const subtotalAfterDiscount = total - discountAmount;
  const taxAmount = subtotalAfterDiscount * (Number(taxRate) / 100);
  const finalTotal = subtotalAfterDiscount + taxAmount;

  const handleCheckout = async () => {
    await onCheckout(
      customer,
      paymentMethod,
      discountAmount,
      Number(taxRate),
      notes
    );
    setCustomer("");
    setPaymentMethod("cash");
    setDiscount("");
    setTaxRate("12");
    setNotes("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cost Breakdown */}
        <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>₱{total.toFixed(2)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount:</span>
              <span>-₱{discountAmount.toFixed(2)}</span>
            </div>
          )}

          {Number(taxRate) > 0 && (
            <div className="flex justify-between text-sm">
              <span>Tax ({taxRate}%):</span>
              <span>₱{taxAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="border-t pt-2 flex justify-between items-center text-lg font-bold">
            <span>Total:</span>
            <span>₱{finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer">Customer Name (Optional)</Label>
          <Input
            id="customer"
            placeholder="Walk-in Customer"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment">Payment Method</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger id="payment">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">
                <div className="flex items-center gap-2">
                  <IconCash className="h-4 w-4" />
                  <span>Cash</span>
                </div>
              </SelectItem>
              <SelectItem value="card">
                <div className="flex items-center gap-2">
                  <IconCreditCard className="h-4 w-4" />
                  <span>Card</span>
                </div>
              </SelectItem>
              <SelectItem value="gcash">
                <div className="flex items-center gap-2">
                  <IconBrandPaypal className="h-4 w-4" />
                  <span>GCash</span>
                </div>
              </SelectItem>
              <SelectItem value="other">
                <div className="flex items-center gap-2">
                  <IconReceipt className="h-4 w-4" />
                  <span>Other</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details" className="border-none">
            <AccordionTrigger className="py-2 text-sm hover:no-underline">
              Additional Details (Discount, Tax, Notes)
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="discount">Discount Amount (₱)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max={total}
                  step="0.01"
                  placeholder="0.00"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="12"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add sale notes..."
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          onClick={handleCheckout}
          disabled={disabled || isProcessing || finalTotal < 0}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Complete Sale (₱${finalTotal.toFixed(2)})`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
