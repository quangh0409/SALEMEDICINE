
export interface Customer {
  id: string;
  customerCode: string;
  fullName: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}
