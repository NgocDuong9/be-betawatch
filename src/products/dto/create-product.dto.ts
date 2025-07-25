import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Áo thun nam', description: 'Tên sản phẩm' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Áo thun cotton 100%', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 199000, description: 'Giá sản phẩm' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: ['https://img.com/1.jpg'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({
    example: '60f7c2b8e1b1c8a1b8e1b1c8',
    description: 'ID danh mục',
  })
  @IsString()
  category: string;

  @ApiProperty({ example: 10, required: false })
  @IsNumber()
  @IsOptional()
  stock?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: ['thoi-trang', 'nam'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ example: [{ key: 'color', value: 'red' }], required: false })
  @IsArray()
  @IsOptional()
  attributes?: { key: string; value: string }[];
}
