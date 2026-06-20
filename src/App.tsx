import { useState } from "react";
import type { InvoiceData, LineItem, GSTType } from "./types/invoice";
import Sidebar from "./components/Sidebar";
import InvoicePreview from "./components/InvoicePreview";
import { generateInvoiceNumber } from "./utils /gst";


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
    <div className="h-screen overflow-hidden bg-[#F2F2F7] flex flex-col selection:bg-indigo-500/20">
      {/* Topbar - Frosted Glass */}
      <header className="fade-in backdrop-blur-xl bg-white/70 border-b border-black/[0.04] px-6 h-14 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <span className="text-white text-xs font-bold">G</span>
          </div>
          <span className="text-gray-900 font-semibold text-[15px] tracking-tight">
            GST Invoice
          </span>
          <span className="text-[10px] font-medium text-gray-500 bg-gray-200/50 px-2 py-0.5 rounded-full ml-1">
            India
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-gray-400 hidden sm:block">
            Mohammad Taaha Ashraf · mtaahaashraf@gmail.com
          </span>

          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-gray-900 hover:bg-gray-800 active:scale-95 text-white px-3.5 py-2 rounded-full font-medium transition-all duration-200 shadow-sm"
          >
            Built for Digital Heroes
          </a>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden p-4 sm:p-6 gap-6">
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
