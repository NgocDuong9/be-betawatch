import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Order extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  products: { productId: string; quantity: number }[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: 'Pending' })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
