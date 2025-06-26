import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'ID của sản phẩm',
    example: '12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiProperty({
    description: 'Số lượng sản phẩm',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  quantity?: number;
}
