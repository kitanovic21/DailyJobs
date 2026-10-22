import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import passportJwt from 'passport-jwt';
import type { AuthUser, JwtPayload } from '../auth.types.js';
import type { Request } from 'express';

const { Strategy, ExtractJwt } = passportJwt;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(config: ConfigService){
        super({
            jwtFromRequest: (req: Request) => req.cookies?.accessToken ?? null,
            ignoreExpiration : false,
            secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
        });
    }
    validate(payload: JwtPayload): AuthUser {
        return { id: payload.sub, email: payload.email};
    }
}