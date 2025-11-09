import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class BaseSchema {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ type: String, nullable: true })
  createdBy: string;

  @Prop({ type: String, nullable: true })
  updatedBy: string;
}
