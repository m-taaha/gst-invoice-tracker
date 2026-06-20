import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { calcLineItem, calcInvoiceTotals, formatINR } from "./gst";
import type { InvoiceData } from "../types/invoice";

export function downloadInvoicePDF(data: InvoiceData) {
  const doc = new jsPDF();
  const totals = calcInvoiceTotals(data.items, data.gstType);
  const pageW = doc.internal.pageSize.getWidth();

  // header block
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageW, 45, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(data.seller.name || "Your Business", 14, 18);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  if (data.seller.address) doc.text(data.seller.address, 14, 26);
  if (data.seller.email) doc.text(data.seller.email, 14, 31);
  if (data.seller.gstin) doc.text(`GSTIN: ${data.seller.gstin}`, 14, 36);

  // invoice badge + number
  doc.setFillColor(99, 102, 241);
  doc.roundedRect(pageW - 55, 8, 40, 7, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("TAX INVOICE", pageW - 35, 13.5, { align: "center" });

  doc.setFontSize(10);
  doc.text(data.invoiceNumber, pageW - 14, 23, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  const dateStr = data.date
    ? new Date(data.date + "T00:00:00").toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
  doc.text(dateStr, pageW - 14, 30, { align: "right" });

  // bill to
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO", 14, 54);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(data.buyer.name || "—", 14, 61);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  if (data.buyer.address) doc.text(data.buyer.address, 14, 67);
  if (data.buyer.email) doc.text(data.buyer.email, 14, 72);
  if (data.buyer.gstin) doc.text(`GSTIN: ${data.buyer.gstin}`, 14, 77);

  // line items table
  const rows = data.items.map((item) => {
    const { subtotal, gstAmount, total } = calcLineItem(item);
    return [
      item.description || "—",
      item.hsn || "—",
      item.qty,
      formatINR(item.rate),
      `${item.gstRate}%`,
      formatINR(gstAmount),
      formatINR(total),
    ];
  });

  autoTable(doc, {
    startY: 84,
    head: [["Description", "HSN", "Qty", "Rate", "GST%", "Tax Amt", "Total"]],
    body: rows,
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [148, 163, 184],
      fontSize: 7,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 55 },
      3: { halign: "right" },
      5: { halign: "right" },
      6: { halign: "right", fontStyle: "bold" },
    },
    margin: { left: 14, right: 14 },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 8;

  // tax summary box
  const boxX = pageW - 80;
  const lineH = 7;
  let y = finalY;

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);

  const addSummaryRow = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 9 : 8);
    doc.setTextColor(bold ? 30 : 100, bold ? 41 : 116, bold ? 59 : 139);
    doc.text(label, boxX, y);
    doc.text(value, pageW - 14, y, { align: "right" });
    y += lineH;
  };

  addSummaryRow("Subtotal", formatINR(totals.subtotal));

  if (data.gstType === "intra") {
    addSummaryRow("CGST", formatINR(totals.cgst));
    addSummaryRow("SGST", formatINR(totals.sgst));
  } else {
    addSummaryRow("IGST", formatINR(totals.igst));
  }

  doc.line(boxX, y - 2, pageW - 14, y - 2);
  addSummaryRow("Grand Total", formatINR(totals.grandTotal), true);

  // notes
  if (data.notes) {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, finalY, boxX - 24, y - finalY, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text("NOTES", 20, finalY + 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const lines = doc.splitTextToSize(data.notes, boxX - 32);
    doc.text(lines, 20, finalY + 14);
  }

  // footer
  const footerY = doc.internal.pageSize.getHeight() - 12;
  doc.setFillColor(248, 250, 252);
  doc.rect(0, footerY - 6, pageW, 18, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("Generated with GST Invoice Calculator", 14, footerY + 2);
  doc.text(
    data.gstType === "intra" ? "Intra-State Supply" : "Inter-State Supply",
    pageW - 14,
    footerY + 2,
    { align: "right" },
  );

  doc.save(`${data.invoiceNumber}.pdf`);
}
