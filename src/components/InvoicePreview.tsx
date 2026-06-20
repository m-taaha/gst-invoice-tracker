import { Download } from "lucide-react";
import type { InvoiceData } from "../types/invoice";
import { calcInvoiceTotals, calcLineItem, formatINR } from "../utils /gst";
import { downloadInvoicePDF } from "../utils /pdf";



interface Props {
  data: InvoiceData;
}

export default function InvoicePreview({ data }: Props) {
  const totals = calcInvoiceTotals(data.items, data.gstType);

  return (
    <main className="flex-1 h-full overflow-y-auto hide-scrollbar rounded-[32px] fade-in relative pb-10">
      {/* Floating Action Bar */}
      <div className="sticky top-0 right-0 z-10 flex justify-end p-4 pointer-events-none">
        <button
          onClick={() => downloadInvoicePDF(data)}
          className="pointer-events-auto flex items-center gap-2 backdrop-blur-xl bg-gray-900/90 hover:bg-black active:scale-95 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all duration-200 shadow-[0_8px_16px_rgba(0,0,0,0.15)]"
        >
          <Download size={14} strokeWidth={2.5} />
          Export PDF
        </button>
      </div>

      {/* Invoice Card */}
      <div
        id="invoice-preview"
        className="max-w-3xl mx-auto bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.02] overflow-hidden fade-up -mt-2"
        style={{ animationDelay: "0.1s" }}
      >
        {/* Header Region */}
        <div className="px-10 py-10 flex items-start justify-between">
          <div className="max-w-[60%]">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight leading-none mb-3">
              {data.seller.name || (
                <span className="text-gray-300 font-normal">Your Business</span>
              )}
            </h1>
            <div className="space-y-1 text-[13px] text-gray-500 leading-relaxed">
              {data.seller.address && <p>{data.seller.address}</p>}
              {data.seller.email && <p>{data.seller.email}</p>}
              {data.seller.gstin && (
                <p className="inline-block mt-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[11px] font-medium">
                  GSTIN: {data.seller.gstin}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full mb-4">
              Tax Invoice
            </span>
            <p className="text-lg font-semibold text-gray-900 tracking-tight">
              {data.invoiceNumber}
            </p>
            <p className="text-[13px] text-gray-400 mt-1">
              {data.date
                ? new Date(data.date + "T00:00:00").toLocaleDateString(
                    "en-IN",
                    { day: "numeric", month: "short", year: "numeric" },
                  )
                : ""}
            </p>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="px-10 py-8 bg-gray-50/50 border-y border-gray-100 flex justify-between items-start">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Billed To
            </p>
            <p className="text-[15px] font-semibold text-gray-900 mb-1">
              {data.buyer.name || (
                <span className="text-gray-400 font-normal">Client Name</span>
              )}
            </p>
            <div className="space-y-0.5 text-[13px] text-gray-500">
              {data.buyer.address && <p>{data.buyer.address}</p>}
              {data.buyer.email && <p>{data.buyer.email}</p>}
              {data.buyer.gstin && (
                <p className="text-[11px] font-medium text-gray-400 mt-1">
                  GSTIN: {data.buyer.gstin}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <span
              className={`inline-block text-[11px] font-semibold px-3 py-1 rounded-full ${
                data.gstType === "intra"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-purple-50 text-purple-600"
              }`}
            >
              {data.gstType === "intra"
                ? "Intra-State Supply"
                : "Inter-State Supply"}
            </span>
          </div>
        </div>

        {/* Items Table */}
        <div className="px-10 py-8">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b-2 border-gray-100">
                {["Description", "HSN", "Qty", "Rate", "GST", "Amount"].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={`pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider ${
                        i === 0 ? "text-left" : "text-right"
                      }`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.items.map((item) => {
                const { gstAmount, total } = calcLineItem(item);
                return (
                  <tr
                    key={item.id}
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 text-gray-900 font-medium pr-4">
                      {item.description || "—"}
                    </td>
                    <td className="py-4 text-right text-gray-400 font-mono text-[11px]">
                      {item.hsn || "—"}
                    </td>
                    <td className="py-4 text-right text-gray-600">
                      {item.qty}
                    </td>
                    <td className="py-4 text-right text-gray-600 tabular">
                      {formatINR(item.rate)}
                    </td>
                    <td className="py-4 text-right">
                      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-1 rounded-md">
                        {item.gstRate}%{" "}
                        <span className="text-gray-400 font-normal">|</span>{" "}
                        {formatINR(gstAmount)}
                      </span>
                    </td>
                    <td className="py-4 text-right font-semibold text-gray-900 tabular">
                      {formatINR(total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Tax Summary */}
        <div className="px-10 pb-10 flex justify-end">
          <div className="w-72 bg-gray-50/80 rounded-[20px] p-6 space-y-3">
            <div className="flex justify-between text-[13px] text-gray-500 font-medium">
              <span>Subtotal</span>
              <span className="tabular text-gray-900">
                {formatINR(totals.subtotal)}
              </span>
            </div>
            {data.gstType === "intra" ? (
              <>
                <div className="flex justify-between text-[13px] text-gray-500 font-medium">
                  <span>CGST</span>
                  <span className="tabular text-gray-900">
                    {formatINR(totals.cgst)}
                  </span>
                </div>
                <div className="flex justify-between text-[13px] text-gray-500 font-medium">
                  <span>SGST</span>
                  <span className="tabular text-gray-900">
                    {formatINR(totals.sgst)}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-[13px] text-gray-500 font-medium">
                <span>IGST</span>
                <span className="tabular text-gray-900">
                  {formatINR(totals.igst)}
                </span>
              </div>
            )}
            <div className="border-t border-gray-200/60 pt-3 flex justify-between items-center">
              <span className="text-[15px] font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-indigo-600 tabular tracking-tight">
                {formatINR(totals.grandTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {data.notes && (
          <div className="px-10 pb-10 fade-in">
            <div className="border-l-2 border-indigo-200 pl-4 py-1">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Notes & Terms
              </p>
              <p className="text-[13px] text-gray-600 leading-relaxed max-w-xl">
                {data.notes}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-900 px-10 py-5 flex items-center justify-between">
          <p className="text-[11px] font-medium text-gray-400">
            GST Invoice Generator
          </p>
          <div className="flex gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 my-auto"></span>
            <p className="text-[11px] font-medium text-gray-400">
              {data.gstType === "intra"
                ? "Intra-State Supply"
                : "Inter-State Supply"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
