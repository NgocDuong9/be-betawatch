import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Tên sản phẩm', example: 'Laptop' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Giá sản phẩm', example: 1500 })
  @IsNumber()
  price: number;
}
