import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Product } from '../../product/schemas/product.schema';

@Schema()
export class InvoiceItem extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  product: Product;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;
}

export const InvoiceItemSchema = SchemaFactory.createForClass(InvoiceItem);
