import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true, unique: true, index: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
  parent: Types.ObjectId | null;

  @Prop({ default: true, index: true })
  isActive: boolean;

  @Prop({ default: false, index: true })
  isDeleted: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
