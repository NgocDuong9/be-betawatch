import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async findAll(): Promise<Order[]> {
    try {
      return await this.orderModel.find().exec();
    } catch (error) {
      throw new HttpException(
        'Lỗi lấy danh sách đơn hàng',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<Order | null> {
    try {
      const order = await this.orderModel.findById(id).exec();
      if (!order)
        throw new HttpException(
          'Không tìm thấy đơn hàng',
          HttpStatus.NOT_FOUND,
        );
      return order;
    } catch (error) {
      throw new HttpException(
        'Lỗi lấy đơn hàng',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(orderData: CreateOrderDto): Promise<Order> {
    try {
      const newOrder = new this.orderModel(orderData);
      return await newOrder.save();
    } catch (error) {
      throw new HttpException('Lỗi tạo đơn hàng', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateData: UpdateOrderDto): Promise<Order | null> {
    try {
      const updated = await this.orderModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();
      if (!updated)
        throw new HttpException(
          'Không tìm thấy đơn hàng',
          HttpStatus.NOT_FOUND,
        );
      return updated;
    } catch (error) {
      throw new HttpException('Lỗi cập nhật đơn hàng', HttpStatus.BAD_REQUEST);
    }
  }

  async delete(id: string): Promise<Order | null> {
    try {
      const deleted = await this.orderModel.findByIdAndDelete(id).exec();
      if (!deleted)
        throw new HttpException(
          'Không tìm thấy đơn hàng',
          HttpStatus.NOT_FOUND,
        );
      return deleted;
    } catch (error) {
      throw new HttpException('Lỗi xóa đơn hàng', HttpStatus.BAD_REQUEST);
    }
  }
}
