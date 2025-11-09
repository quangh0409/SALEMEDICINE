import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '../../../shared/base/base.schema';

export type ProductDocument = Product & Document;

@Schema()
export class Product extends BaseSchema {
  @Prop({ unique: true, required: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  unit: string;

  @Prop({ default: 0 })
  stock: number;

  @Prop({ default: 10 })
  warningThreshold: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
