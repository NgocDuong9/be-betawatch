import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({ description: 'ID của sản phẩm', example: '67890' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Số lượng sản phẩm', example: 2 })
  @IsNumber()
  quantity: number;
}
