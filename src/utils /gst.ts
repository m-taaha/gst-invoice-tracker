import type { LineItem, GSTType } from "../types/invoice";


export function calcLineItem(item: LineItem) {
  const subtotal = item.qty * item.rate;
  const gstAmount = (subtotal * item.gstRate) / 100;
  return { subtotal, gstAmount, total: subtotal + gstAmount };
}

export function calcInvoiceTotals(items: LineItem[], gstType: GSTType) {
  let subtotal = 0;
  let totalGST = 0;

  for (const item of items) {
    const calc = calcLineItem(item);
    subtotal += calc.subtotal;
    totalGST += calc.gstAmount;
  }

  const cgst = gstType === "intra" ? totalGST / 2 : 0;
  const sgst = gstType === "intra" ? totalGST / 2 : 0;
  const igst = gstType === "inter" ? totalGST : 0;

  return {
    subtotal,
    cgst,
    sgst,
    igst,
    totalGST,
    grandTotal: subtotal + totalGST,
  };
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function generateInvoiceNumber() {
  const date = new Date();
  const y = date.getFullYear().toString().slice(2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `INV-${y}${m}-${Math.floor(Math.random() * 900) + 100}`;
}
