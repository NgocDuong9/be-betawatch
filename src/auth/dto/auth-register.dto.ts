import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class AuthRegisterDto {
  @ApiProperty({
    description: 'Tên đăng nhập của người dùng',
    example: 'johndoe',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Email của người dùng',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Mật khẩu của người dùng',
    example: 'password123',
  })
  @IsString()
  password: string;
}
