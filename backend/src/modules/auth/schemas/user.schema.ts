import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '../../../shared/base/base.schema';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export type UserDocument = User & Document;

@Schema()
export class User extends BaseSchema {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
