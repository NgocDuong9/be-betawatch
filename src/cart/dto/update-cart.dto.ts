import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateCartDto {
  @ApiProperty({
    description: 'ID của người dùng',
    example: '12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    description: 'Tổng giá trị giỏ hàng',
    example: 500,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  total?: number;
}
