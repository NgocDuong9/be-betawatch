import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
  IsMongoId,
  Min,
  MaxLength,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class AttributeDto {
  @ApiProperty({ example: 'color', description: 'Tên thuộc tính' })
  @IsString()
  @MaxLength(50)
  key: string;

  @ApiProperty({ example: 'red', description: 'Giá trị thuộc tính' })
  @IsString()
  @MaxLength(100)
  value: string;
}

export class CreateProductDto {
  @ApiProperty({
    example: 'Áo thun nam',
    description: 'Tên sản phẩm',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiProperty({
    example: 'Áo thun cotton 100% chất lượng cao',
    required: false,
    maxLength: 1000,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    example: 199000,
    description: 'Giá sản phẩm (VNĐ)',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: ['https://img.com/1.jpg', 'https://img.com/2.jpg'],
    required: false,
    description: 'Danh sách URL hình ảnh',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ArrayMinSize(1)
  images?: string[];

  @ApiProperty({
    example: '60f7c2b8e1b1c8a1b8e1b1c8',
    description: 'ID danh mục (MongoDB ObjectId)',
  })
  @IsMongoId()
  category: string;

  @ApiProperty({
    example: 10,
    required: false,
    description: 'Số lượng tồn kho',
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;

  @ApiProperty({
    example: true,
    required: false,
    description: 'Trạng thái hoạt động',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    example: ['thoi-trang', 'nam', 'ao-thun'],
    required: false,
    description: 'Tags để tìm kiếm',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ArrayMinSize(1)
  tags?: string[];

  @ApiProperty({
    example: [
      { key: 'color', value: 'red' },
      { key: 'size', value: 'L' },
    ],
    required: false,
    description: 'Thuộc tính sản phẩm',
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AttributeDto)
  attributes?: AttributeDto[];
}
