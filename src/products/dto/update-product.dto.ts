import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    description: 'Tên sản phẩm',
    example: 'Laptop',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Giá sản phẩm',
    example: 1500,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price?: number;
}
