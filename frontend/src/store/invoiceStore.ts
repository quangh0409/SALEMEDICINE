
import { create } from 'zustand';
import { Invoice } from '../types/invoice';

interface InvoiceState {
  invoices: Invoice[];
  setInvoices: (invoices: Invoice[]) => void;
}

export const useInvoiceStore = create<InvoiceState>((set) => ({
  invoices: [],
  setInvoices: (invoices) => set({ invoices }),
}));
