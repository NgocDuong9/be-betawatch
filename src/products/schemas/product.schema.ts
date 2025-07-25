import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true, index: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true, index: true })
  category: Types.ObjectId;

  @Prop({ default: 0 })
  stock: number;

  @Prop({ default: true, index: true })
  isActive: boolean;

  @Prop({ type: [String], default: [], index: true })
  tags: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  createdBy: Types.ObjectId;

  @Prop({ default: false, index: true })
  isDeleted: boolean;

  @Prop({ type: [{ key: String, value: String }], default: [] })
  attributes: { key: string; value: string }[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ name: 'text', description: 'text', tags: 1 });
