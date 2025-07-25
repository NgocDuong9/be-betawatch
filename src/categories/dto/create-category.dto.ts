import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiPropertyOptional({
    required: false,
  })
  @IsString()
  @IsOptional()
  partner?: string;
}
