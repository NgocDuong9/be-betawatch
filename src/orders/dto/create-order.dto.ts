import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  ValidateNested,
  IsString,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderProductDto {
  @ApiProperty({ example: 'productId123' })
  @IsString()
  @IsNotEmpty()
  product: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 100000 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: [{ key: 'color', value: 'red' }], required: false })
  @IsArray()
  attributes?: { key: string; value: string }[];
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderProductDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  products: OrderProductDto[];

  @ApiProperty({ example: '123 Main St' })
  @IsString()
  shippingAddress: string;

  @ApiProperty({ example: 'cod', enum: ['cod', 'bank', 'vnpay'] })
  @IsString()
  paymentMethod: string;
}
