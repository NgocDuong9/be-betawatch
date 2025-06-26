import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ description: 'ID của sản phẩm', example: '12345' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Số lượng sản phẩm', example: 2 })
  @IsNumber()
  quantity: number;
}
