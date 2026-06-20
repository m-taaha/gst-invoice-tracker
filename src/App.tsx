import { useState } from "react";
import type { InvoiceData, LineItem, GSTType } from "./types/invoice";
import { generateInvoiceNumber } from "./utils /gst";
import Sidebar from "./components/Sidebar";
import InvoicePreview from "./components/InvoicePreview";



const emptyItem = (): LineItem => ({
  id: crypto.randomUUID(),
  description: "",
  hsn: "",
  qty: 1,
  rate: 0,
  gstRate: 18,
});

const defaultData: InvoiceData = {
  invoiceNumber: generateInvoiceNumber(),
  date: new Date().toISOString().split("T")[0],
  seller: { name: "", gstin: "", address: "", email: "" },
  buyer: { name: "", gstin: "", address: "", email: "" },
  items: [emptyItem()],
  gstType: "intra",
  notes: "",
};

export default function App() {
  const [data, setData] = useState<InvoiceData>(defaultData);

  function updateField<K extends keyof InvoiceData>(
    key: K,
    value: InvoiceData[K],
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function addItem() {
    setData((prev) => ({ ...prev, items: [...prev.items, emptyItem()] }));
  }

  function updateItem(id: string, patch: Partial<LineItem>) {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    }));
  }

  function removeItem(id: string) {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">G</span>
          </div>
          <span className="text-white font-semibold tracking-tight">
            GST Invoice Calculator
          </span>
          <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
            India
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">
            Taaha Khan • taahakhan@email.com
          </span>

          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-indigo-500 hover:bg-indigo-400 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            Built for Digital Heroes
          </a>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          data={data}
          onUpdateField={updateField}
          onAddItem={addItem}
          onUpdateItem={updateItem}
          onRemoveItem={removeItem}
        />
        <InvoicePreview data={data} />
      </div>
    </div>
  );
}
