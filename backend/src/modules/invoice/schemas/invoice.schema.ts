import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { BaseSchema } from '../../../shared/base/base.schema';
import { Customer } from '../../customer/schemas/customer.schema';
import { InvoiceItem, InvoiceItemSchema } from './invoice-item.schema';

export type InvoiceDocument = Invoice & Document;

@Schema()
export class Invoice extends BaseSchema {
  @Prop({ unique: true, required: true })
  invoiceCode: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: true })
  customer: Customer;

  @Prop({ type: [InvoiceItemSchema] })
  items: InvoiceItem[];

  @Prop({ required: true })
  total: number;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
