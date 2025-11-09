import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '../../../shared/base/base.schema';

export type CustomerDocument = Customer & Document;

@Schema()
export class Customer extends BaseSchema {
  @Prop({ unique: true, required: true })
  customerCode: string;

  @Prop({ required: true })
  fullName: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop()
  address: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
