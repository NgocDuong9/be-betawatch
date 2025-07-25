import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';
import { Order } from './schemas/order.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll() {
    const data = await this.ordersService.findAll();
    return {
      message: 'Lấy danh sách đơn hàng thành công',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.ordersService.findOne(id);
    return {
      message: 'Lấy đơn hàng thành công',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const data = await this.ordersService.create(createOrderDto);
    return {
      message: 'Tạo đơn hàng thành công',
      data,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const data = await this.ordersService.update(id, updateOrderDto);
    return {
      message: 'Cập nhật đơn hàng thành công',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const data = await this.ordersService.delete(id);
    return {
      message: 'Xóa đơn hàng thành công',
      data,
      statusCode: HttpStatus.OK,
    };
  }
}
