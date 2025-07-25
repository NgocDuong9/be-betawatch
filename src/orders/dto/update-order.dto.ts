import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateOrderProductDto {
  @ApiProperty({ example: 'productId123', required: false })
  @IsOptional()
  @IsString()
  product?: string;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiProperty({ example: 100000, required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ example: [{ key: 'color', value: 'red' }], required: false })
  @IsOptional()
  @IsArray()
  attributes?: { key: string; value: string }[];
}

export class UpdateOrderDto {
  @ApiProperty({ type: [UpdateOrderProductDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderProductDto)
  products?: UpdateOrderProductDto[];

  @ApiProperty({ example: 'completed', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: '123 Main St', required: false })
  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @ApiProperty({ example: 'cod', required: false })
  @IsOptional()
  @IsString()
  paymentMethod?: string;
}
