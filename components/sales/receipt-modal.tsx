/**
 * Receipt Modal Component
 * Displays sale receipt with print functionality
 */

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IconPrinter, IconX } from "@tabler/icons-react";

interface ReceiptItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalPrice: number;
}

export interface ReceiptData {
  invoiceNumber: string;
  customer?: string | null;
  paymentMethod?: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  items: ReceiptItem[];
  createdAt: Date;
  notes?: string | null;
}

interface ReceiptModalProps {
  open: boolean;
  onClose: () => void;
  receiptData: ReceiptData | null;
}

export function ReceiptModal({
  open,
  onClose,
  receiptData,
}: ReceiptModalProps) {
  if (!receiptData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] print:shadow-none">
        <DialogHeader className="print:hidden">
          <DialogTitle>Sale Receipt</DialogTitle>
        </DialogHeader>

        {/* Receipt Content */}
        <div id="receipt-content" className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold">Velos</h2>
            <p className="text-sm text-muted-foreground">Sales Receipt</p>
          </div>

          {/* Invoice Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Invoice #:</span>
              <span>{receiptData.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{new Date(receiptData.createdAt).toLocaleString()}</span>
            </div>
            {receiptData.customer && (
              <div className="flex justify-between">
                <span className="font-medium">Customer:</span>
                <span>{receiptData.customer}</span>
              </div>
            )}
            {receiptData.paymentMethod && (
              <div className="flex justify-between">
                <span className="font-medium">Payment:</span>
                <span className="capitalize">{receiptData.paymentMethod}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Items */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Items</h3>
            {receiptData.items.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">
                    {item.productName}
                  </span>
                  <span className="text-sm">₱{item.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {item.quantity} x ₱{item.unitPrice.toFixed(2)}
                    {item.discount > 0 && ` (-₱${item.discount.toFixed(2)})`}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₱{receiptData.subtotal.toFixed(2)}</span>
            </div>
            {receiptData.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-₱{receiptData.discount.toFixed(2)}</span>
              </div>
            )}
            {receiptData.tax > 0 && (
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>₱{receiptData.tax.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>₱{receiptData.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Notes */}
          {receiptData.notes && (
            <>
              <Separator />
              <div className="text-sm">
                <span className="font-medium">Notes:</span>
                <p className="mt-1 text-muted-foreground">
                  {receiptData.notes}
                </p>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground pt-4">
            <p>Thank you for your business!</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 print:hidden">
          <Button onClick={handlePrint} className="flex-1" variant="outline">
            <IconPrinter className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handlePrint} className="flex-1">
            <IconPrinter className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={onClose} variant="ghost">
            <IconX className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
