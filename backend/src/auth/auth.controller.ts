import { Body, Controller, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { CreateUserDto } from '../user/dto/user.dtos.js';
import { AuthService } from './auth.service.js';
import type { AuthRequest } from './auth.types.js';
import { PassportJwtGuard } from './guards/passport-jwt.guard.js';
import { PassportLocalGuard } from './guards/passport-local.guard.js';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  private setCookies(res: Response, accessToken: string, refreshToken: string) {
    const base = {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
    };
    res.cookie('accessToken', accessToken, {
      ...base,
      maxAge: Number(process.env.JWT_EXPIRES_IN) * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      ...base,
      path: '/auth', // refresh cookie ide samo na auth rute
      maxAge: Number(process.env.REFRESH_JWT_EXPIRES_IN) * 1000,
    });
  }

  @Post('register')
  async register(@Body() dto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.auth.register(dto);
    this.setCookies(res, accessToken, refreshToken);
    return { user };
  }

  @UseGuards(PassportLocalGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Req() req: AuthRequest, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.auth.login(req.user);
    this.setCookies(res, accessToken, refreshToken);
    return { user };
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: AuthRequest, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.auth.login(req.user);
    this.setCookies(res, accessToken, refreshToken);
    return { user };
  }

  @UseGuards(PassportJwtGuard)
  @Post('logout')
  @HttpCode(204)
  async logout(@Req() req: AuthRequest, @Res({ passthrough: true }) res: Response) {
    await this.auth.logout(req.user.id);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken', { path: '/auth' }); // ista putanja kao pri postavljanju
  }
}