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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[13px] font-semibold text-gray-800 tracking-tight mb-4 flex items-center gap-2">
      {children}
    </h3>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-medium text-gray-500 mb-1.5 ml-1">
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full bg-[#F2F2F7] border border-transparent rounded-xl px-3.5 py-2.5 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
    />
  );
}

function BentoCard({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: string;
}) {
  return (
    <section
      className="fade-up bg-white rounded-[24px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-black/[0.03]"
      style={{ animationDelay: delay }}
    >
      {children}
    </section>
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
    <aside className="w-[340px] shrink-0 h-full overflow-y-auto hide-scrollbar fade-in space-y-4 pb-10">
      {/* Invoice Details */}
      <BentoCard delay="0.05s">
        <SectionTitle>Invoice Details</SectionTitle>
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
      </BentoCard>

      {/* GST Type */}
      <BentoCard delay="0.1s">
        <SectionTitle>Supply Type</SectionTitle>
        <div className="flex bg-[#F2F2F7] p-1 rounded-xl">
          {(["intra", "inter"] as GSTType[]).map((type) => (
            <button
              key={type}
              onClick={() => onUpdateField("gstType", type)}
              className={`flex-1 py-1.5 text-[12px] font-semibold rounded-lg transition-all duration-200 ${
                data.gstType === type
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {type === "intra" ? "Intra-State" : "Inter-State"}
            </button>
          ))}
        </div>
        <p className="text-[11px] font-medium text-gray-400 mt-2.5 ml-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          {data.gstType === "intra" ? "CGST + SGST applies" : "IGST applies"}
        </p>
      </BentoCard>

      {/* Seller */}
      <BentoCard delay="0.15s">
        <SectionTitle>Your Business</SectionTitle>
        <div className="space-y-3">
          <div>
            <Input
              placeholder="Business Name (Acme Pvt. Ltd.)"
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
            <Input
              placeholder="GSTIN (Optional)"
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
            <Input
              placeholder="Full Address"
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
            <Input
              placeholder="Email Address"
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
      </BentoCard>

      {/* Buyer */}
      <BentoCard delay="0.2s">
        <SectionTitle>Bill To</SectionTitle>
        <div className="space-y-3">
          <div>
            <Input
              placeholder="Client Name"
              value={data.buyer.name}
              onChange={(e) =>
                onUpdateField("buyer", { ...data.buyer, name: e.target.value })
              }
            />
          </div>
          <div>
            <Input
              placeholder="Client GSTIN"
              value={data.buyer.gstin}
              onChange={(e) =>
                onUpdateField("buyer", { ...data.buyer, gstin: e.target.value })
              }
            />
          </div>
          <div>
            <Input
              placeholder="Client Address"
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
            <Input
              placeholder="Client Email"
              value={data.buyer.email}
              onChange={(e) =>
                onUpdateField("buyer", { ...data.buyer, email: e.target.value })
              }
            />
          </div>
        </div>
      </BentoCard>

      {/* Line Items */}
      <BentoCard delay="0.25s">
        <div className="flex items-center justify-between mb-4">
          <SectionTitle>Line Items</SectionTitle>
          <button
            onClick={onAddItem}
            className="flex items-center justify-center w-7 h-7 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-full transition-colors"
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        </div>
        <div className="space-y-4">
          {data.items.map((item, idx) => (
            <div
              key={item.id}
              className="relative bg-gray-50/50 border border-gray-100 rounded-[16px] p-3 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                  Item {idx + 1}
                </span>
                {data.items.length > 1 && (
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <Input
                placeholder="Item Description"
                value={item.description}
                onChange={(e) =>
                  onUpdateItem(item.id, { description: e.target.value })
                }
              />
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>HSN</Label>
                  <Input
                    placeholder="Code"
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
                  <Label>Rate ₹</Label>
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
              <div className="pt-1">
                <Label>GST Rate</Label>
                <div className="flex gap-1.5 flex-wrap mt-1.5">
                  {GST_RATES.map((r) => (
                    <button
                      key={r}
                      onClick={() => onUpdateItem(item.id, { gstRate: r })}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-200 active:scale-95 ${
                        item.gstRate === r
                          ? "bg-gray-900 text-white shadow-sm"
                          : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
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
      </BentoCard>

      {/* Notes */}
      <BentoCard delay="0.3s">
        <SectionTitle>Notes & Terms</SectionTitle>
        <textarea
          value={data.notes}
          onChange={(e) => onUpdateField("notes", e.target.value)}
          placeholder="Add payment terms, bank details, or a thank you note..."
          rows={3}
          className="w-full bg-[#F2F2F7] border border-transparent rounded-xl px-3.5 py-3 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 resize-none"
        />
      </BentoCard>
    </aside>
  );
}
