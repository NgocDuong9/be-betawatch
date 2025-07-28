import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty()
  readonly _id: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty({ required: false })
  readonly description?: string;

  @ApiProperty({ required: false })
  readonly parent?: string;

  @ApiProperty({ required: false })
  readonly isActive?: boolean;

  @ApiProperty({ required: false })
  readonly createdAt?: Date;

  @ApiProperty({ required: false })
  readonly updatedAt?: Date;
}
