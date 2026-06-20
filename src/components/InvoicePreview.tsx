import { Download } from "lucide-react";
import { calcInvoiceTotals, calcLineItem, formatINR } from "../utils /gst";
import type { InvoiceData } from "../types/invoice";
import { downloadInvoicePDF } from "../utils /pdf";



interface Props {
  data: InvoiceData;
}

export default function InvoicePreview({ data }: Props) {
  const totals = calcInvoiceTotals(data.items, data.gstType);

  return (
    <main className="flex-1 overflow-y-auto bg-slate-950 p-8">
      {/* Download Button Section */}
      <div className="max-w-3xl mx-auto mb-4 flex justify-end">
        <button
          onClick={() => downloadInvoicePDF(data)}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Download size={15} />
          Download PDF
        </button>
      </div>

      {/* Invoice Preview Container */}
      <div
        id="invoice-preview"
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Invoice Header */}
        <div className="bg-slate-900 px-8 py-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {data.seller.name || "Your Business"}
            </h1>
            <p className="text-slate-400 text-sm mt-1">{data.seller.address}</p>
            <p className="text-slate-400 text-sm">{data.seller.email}</p>
            {data.seller.gstin && (
              <p className="text-slate-500 text-xs mt-1">
                GSTIN: {data.seller.gstin}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="inline-block bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
              TAX INVOICE
            </div>
            <p className="text-white font-mono font-semibold">
              {data.invoiceNumber}
            </p>
            <p className="text-slate-400 text-sm">
              {data.date
                ? new Date(data.date + "T00:00:00").toLocaleDateString(
                    "en-IN",
                    { day: "numeric", month: "long", year: "numeric" },
                  )
                : ""}
            </p>
          </div>
        </div>

        {/* Bill To */}
        <div className="px-8 py-5 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            Bill To
          </p>
          <p className="font-semibold text-slate-800">
            {data.buyer.name || "—"}
          </p>
          <p className="text-slate-500 text-sm">{data.buyer.address}</p>
          <p className="text-slate-500 text-sm">{data.buyer.email}</p>
          {data.buyer.gstin && (
            <p className="text-slate-400 text-xs mt-1">
              GSTIN: {data.buyer.gstin}
            </p>
          )}
        </div>

        {/* Items Table */}
        <div className="px-8 py-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left text-xs text-slate-400 uppercase tracking-wide pb-2 font-medium">
                  Description
                </th>
                <th className="text-center text-xs text-slate-400 uppercase tracking-wide pb-2 font-medium">
                  HSN
                </th>
                <th className="text-center text-xs text-slate-400 uppercase tracking-wide pb-2 font-medium">
                  Qty
                </th>
                <th className="text-right text-xs text-slate-400 uppercase tracking-wide pb-2 font-medium">
                  Rate
                </th>
                <th className="text-center text-xs text-slate-400 uppercase tracking-wide pb-2 font-medium">
                  GST
                </th>
                <th className="text-right text-xs text-slate-400 uppercase tracking-wide pb-2 font-medium">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => {
                const { subtotal, gstAmount, total } = calcLineItem(item);
                return (
                  <tr key={item.id} className="border-b border-slate-50">
                    <td className="py-3 text-slate-700 font-medium">
                      {item.description || "—"}
                    </td>
                    <td className="py-3 text-center text-slate-400 font-mono text-xs">
                      {item.hsn || "—"}
                    </td>
                    <td className="py-3 text-center text-slate-600">
                      {item.qty}
                    </td>
                    <td className="py-3 text-right text-slate-600 tabular">
                      {formatINR(item.rate)}
                    </td>
                    <td className="py-3 text-center">
                      <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">
                        {item.gstRate}% • {formatINR(gstAmount)}
                      </span>
                    </td>
                    <td className="py-3 text-right font-semibold text-slate-800 tabular">
                      {formatINR(total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Tax Breakdown */}
        <div className="px-8 pb-6 flex justify-end">
          <div className="w-72 space-y-2">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal</span>
              <span className="tabular">{formatINR(totals.subtotal)}</span>
            </div>
            {data.gstType === "intra" ? (
              <>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>CGST</span>
                  <span className="tabular">{formatINR(totals.cgst)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>SGST</span>
                  <span className="tabular">{formatINR(totals.sgst)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-sm text-slate-500">
                <span>IGST</span>
                <span className="tabular">{formatINR(totals.igst)}</span>
              </div>
            )}
            <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-800">
              <span>Total</span>
              <span className="tabular text-indigo-600">
                {formatINR(totals.grandTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {data.notes && (
          <div className="px-8 pb-6">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                Notes
              </p>
              <p className="text-slate-600 text-sm">{data.notes}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-50 px-8 py-4 flex items-center justify-between border-t border-slate-100">
          <p className="text-xs text-slate-400">
            Generated with GST Invoice Calculator
          </p>
          <p className="text-xs text-slate-400">
            {data.gstType === "intra"
              ? "Intra-State Supply"
              : "Inter-State Supply"}
          </p>
        </div>
      </div>
    </main>
  );
}
