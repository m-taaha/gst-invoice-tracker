export type GSTType = "intra" | "inter";

export interface LineItem {
  id: string;
  description: string;
  hsn: string;
  qty: number;
  rate: number;
  gstRate: number;
}

export interface BusinessInfo {
  name: string;
  gstin: string;
  address: string;
  email: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  seller: BusinessInfo;
  buyer: BusinessInfo;
  items: LineItem[];
  gstType: GSTType;
  notes: string;
}
