import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, index: true })
  username: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user', index: true })
  role: string; // user, admin, ...

  @Prop({ default: true, index: true })
  isActive: boolean;

  @Prop({ default: false, index: true })
  isDeleted: boolean;

  @Prop({ default: '' })
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
