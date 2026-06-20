import { Plus, Trash2 } from "lucide-react";
import type { InvoiceData, LineItem, GSTType } from "../types/invoice";

const GST_RATES = [0, 5, 12, 18, 28];

interface Props {
  data: InvoiceData;
  onUpdateField: <K extends keyof InvoiceData>(
    key: K,
    value: InvoiceData[K],
  ) => void;
  onAddItem: () => void;
  onUpdateItem: (id: string, patch: Partial<LineItem>) => void;
  onRemoveItem: (id: string) => void;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs text-slate-400 mb-1 font-medium uppercase tracking-wide">
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
    />
  );
}

export default function Sidebar({
  data,
  onUpdateField,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}: Props) {
  return (
    <aside className="w-[420px] shrink-0 bg-slate-900 border-r border-slate-800 overflow-y-auto">
      <div className="p-5 space-y-6">
        {/* Invoice Meta */}
        <section>
          <h2 className="text-slate-200 font-semibold mb-3 text-sm">
            Invoice Details
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Invoice No.</Label>
              <Input
                value={data.invoiceNumber}
                onChange={(e) => onUpdateField("invoiceNumber", e.target.value)}
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={data.date}
                onChange={(e) => onUpdateField("date", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* GST Type Toggle */}
        <section>
          <h2 className="text-slate-200 font-semibold mb-3 text-sm">
            GST Type
          </h2>
          <div className="flex rounded-lg overflow-hidden border border-slate-700">
            {(["intra", "inter"] as GSTType[]).map((type) => (
              <button
                key={type}
                onClick={() => onUpdateField("gstType", type)}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  data.gstType === type
                    ? "bg-indigo-500 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {type === "intra"
                  ? "Intra-State (CGST + SGST)"
                  : "Inter-State (IGST)"}
              </button>
            ))}
          </div>
        </section>

        {/* Seller */}
        <section>
          <h2 className="text-slate-200 font-semibold mb-3 text-sm">
            Your Business
          </h2>
          <div className="space-y-2">
            <div>
              <Label>Business Name</Label>
              <Input
                placeholder="Acme Pvt. Ltd."
                value={data.seller.name}
                onChange={(e) =>
                  onUpdateField("seller", {
                    ...data.seller,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>GSTIN</Label>
              <Input
                placeholder="22AAAAA0000A1Z5"
                value={data.seller.gstin}
                onChange={(e) =>
                  onUpdateField("seller", {
                    ...data.seller,
                    gstin: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Address</Label>
              <Input
                placeholder="123, Street, City, State"
                value={data.seller.address}
                onChange={(e) =>
                  onUpdateField("seller", {
                    ...data.seller,
                    address: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                placeholder="you@business.com"
                value={data.seller.email}
                onChange={(e) =>
                  onUpdateField("seller", {
                    ...data.seller,
                    email: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </section>

        {/* Buyer */}
        <section>
          <h2 className="text-slate-200 font-semibold mb-3 text-sm">Bill To</h2>
          <div className="space-y-2">
            <div>
              <Label>Client Name</Label>
              <Input
                placeholder="Client Pvt. Ltd."
                value={data.buyer.name}
                onChange={(e) =>
                  onUpdateField("buyer", {
                    ...data.buyer,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>GSTIN</Label>
              <Input
                placeholder="27BBBBB0000B1Z1"
                value={data.buyer.gstin}
                onChange={(e) =>
                  onUpdateField("buyer", {
                    ...data.buyer,
                    gstin: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Address</Label>
              <Input
                placeholder="456, Avenue, City, State"
                value={data.buyer.address}
                onChange={(e) =>
                  onUpdateField("buyer", {
                    ...data.buyer,
                    address: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                placeholder="client@company.com"
                value={data.buyer.email}
                onChange={(e) =>
                  onUpdateField("buyer", {
                    ...data.buyer,
                    email: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </section>

        {/* Line Items */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-slate-200 font-semibold text-sm">Line Items</h2>
            <button
              onClick={onAddItem}
              className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Plus size={14} /> Add Item
            </button>
          </div>
          <div className="space-y-3">
            {data.items.map((item, idx) => (
              <div
                key={item.id}
                className="bg-slate-800 rounded-xl p-3 space-y-2 border border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Item {idx + 1}</span>
                  {data.items.length > 1 && (
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
                <Input
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) =>
                    onUpdateItem(item.id, { description: e.target.value })
                  }
                />
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label>HSN</Label>
                    <Input
                      placeholder="9983"
                      value={item.hsn}
                      onChange={(e) =>
                        onUpdateItem(item.id, { hsn: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Qty</Label>
                    <Input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) =>
                        onUpdateItem(item.id, { qty: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Rate (₹)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={item.rate}
                      onChange={(e) =>
                        onUpdateItem(item.id, { rate: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>GST Rate</Label>
                  <div className="flex gap-1.5 flex-wrap">
                    {GST_RATES.map((r) => (
                      <button
                        key={r}
                        onClick={() => onUpdateItem(item.id, { gstRate: r })}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                          item.gstRate === r
                            ? "bg-indigo-500 text-white"
                            : "bg-slate-700 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {r}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Notes */}
        <section>
          <h2 className="text-slate-200 font-semibold mb-3 text-sm">Notes</h2>
          <textarea
            value={data.notes}
            onChange={(e) => onUpdateField("notes", e.target.value)}
            placeholder="Payment terms, bank details, thank you note..."
            rows={3}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
          />
        </section>
      </div>
    </aside>
  );
}
