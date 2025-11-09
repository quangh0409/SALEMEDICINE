
export interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  unit: string;
  stock: number;
  warningThreshold: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}
