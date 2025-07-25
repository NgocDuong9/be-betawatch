import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() authRegisterDto: AuthRegisterDto) {
    try {
      return await this.authService.register(authRegisterDto);
    } catch (error) {
      // Nếu là lỗi đã biết thì throw lại, không thì trả về lỗi 500
      if (error.status && error.message) throw error;
      throw new Error('Đăng ký thất bại');
    }
  }

  @Post('login')
  async login(@Body() authLoginDto: AuthLoginDto) {
    const user = await this.authService.validateUser(
      authLoginDto.email,
      authLoginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const newAccessToken = await this.authService.refreshToken(
      refreshTokenDto.refreshToken,
    );
    return newAccessToken;
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  @ApiBearerAuth()
  async getProfile(@Request() req) {
    return this.authService.getUserProfileById(req.user.userId);
  }
}
