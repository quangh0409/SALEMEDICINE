import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userModel.findOne({ username }).exec();
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.toObject(); // Use toObject() to get a plain object
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(authRegisterDto: AuthRegisterDto): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(authRegisterDto.password, 10);
    const createdUser = new this.userModel({
      username: authRegisterDto.username,
      password: hashedPassword,
      role: authRegisterDto.role || UserRole.USER,
    });
    return createdUser.save();
  }
}