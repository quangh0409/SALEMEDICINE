import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { UserRole } from './schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() authRegisterDto: AuthRegisterDto) {
    return this.authService.register(authRegisterDto);
  }

  @Post('login')
  async login(@Body() authLoginDto: AuthLoginDto) {
    const user = await this.authService.validateUser(authLoginDto.username, authLoginDto.password);
    if (!user) {
      return { message: 'Invalid credentials' };
    }
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}