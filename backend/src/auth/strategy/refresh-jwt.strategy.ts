import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import passportJwt from 'passport-jwt';
import { AuthService } from '../auth.service.js';
import type { JwtPayload } from '../auth.types.js';

const { Strategy, ExtractJwt } = passportJwt;

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(config: ConfigService, private readonly auth: AuthService) {
    super({
      jwtFromRequest: (req: Request) => req.cookies?.refreshToken ?? null,
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('REFRESH_JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    // potpis i rok su vec provereni, sada proveravamo da je to token iz baze
    return this.auth.validateRefreshToken(payload.sub, req.body?.refreshToken as string);
  }
}