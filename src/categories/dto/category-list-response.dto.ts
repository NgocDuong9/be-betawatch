import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponseDto } from './category-response.dto';

export class CategoryListResponseDto {
  @ApiProperty({ type: [CategoryResponseDto] })
  readonly items: CategoryResponseDto[];

  @ApiProperty()
  readonly total: number;

  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly limit: number;
}
