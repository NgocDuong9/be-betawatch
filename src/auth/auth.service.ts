import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../users/schemas/user.schema';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(authRegisterDto: AuthRegisterDto): Promise<User> {
    const { username, email, password } = authRegisterDto;
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email đã được đăng ký');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      username,
      email,
      password: hashedPassword,
    });
    return newUser.save();
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }
    const userProfile = await this.getUserProfileById(user._id as string);
    return userProfile;
  }

  async generateRefreshToken(userId: Types.ObjectId): Promise<string> {
    const refreshToken = uuidv4();
    await this.userModel.findByIdAndUpdate(userId, { refreshToken });
    return refreshToken;
  }

  async login(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    user: { _id: any; username: string; email: string };
  }> {
    const payload = { username: user.username, sub: user._id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const userProfile = await this.getUserProfileById(user._id as string);

    return {
      accessToken,
      refreshToken,
      user: userProfile,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const accessToken = this.jwtService.sign(
        { username: payload.username, sub: payload.sub },
        { expiresIn: '15m' },
      );
      return { accessToken };
    } catch (e) {
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
      );
    }
  }

  async getUserProfileById(userId: string) {
    const user = await this.userModel.findById(userId).lean();
    if (!user) throw new UnauthorizedException('User not found');
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
