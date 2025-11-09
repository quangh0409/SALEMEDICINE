
import { Customer } from './customer';
import { Product } from './product';

export interface InvoiceItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  invoiceCode: string;
  customer: Customer;
  items: InvoiceItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}
