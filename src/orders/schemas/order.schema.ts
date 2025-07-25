import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: Types.ObjectId;

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        attributes: { type: [{ key: String, value: String }], default: [] },
      },
    ],
    default: [],
  })
  products: Array<{
    product: Types.ObjectId;
    quantity: number;
    price: number;
    attributes: { key: string; value: string }[];
  }>;

  @Prop({ required: true })
  total: number;

  @Prop({ default: 'pending', index: true })
  status: string; // pending, paid, shipped, completed, cancelled

  @Prop({ default: 'cod' })
  paymentMethod: string; // cod, bank, vnpay, ...

  @Prop({ default: '' })
  shippingAddress: string;

  @Prop({ default: false, index: true })
  isDeleted: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
