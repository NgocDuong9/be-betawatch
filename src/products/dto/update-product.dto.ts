import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';

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

  @ApiProperty({
    description: 'Mô tả sản phẩm',
    example: 'Áo thun cotton 100%',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Ảnh sản phẩm',
    example: ['https://img.com/1.jpg'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({
    description: 'ID danh mục',
    example: '60f7c2b8e1b1c8a1b8e1b1c8',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ description: 'Tồn kho', example: 10, required: false })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @ApiProperty({
    description: 'Trạng thái hoạt động',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Tags',
    example: ['thoi-trang', 'nam'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'Thuộc tính mở rộng',
    example: [{ key: 'color', value: 'red' }],
    required: false,
  })
  @IsOptional()
  @IsArray()
  attributes?: { key: string; value: string }[];
}
