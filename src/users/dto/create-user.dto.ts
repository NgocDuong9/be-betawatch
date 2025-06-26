import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Tên người dùng', example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email người dùng',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;
}
