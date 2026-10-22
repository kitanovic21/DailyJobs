import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, randomUUID, timingSafeEqual } from 'crypto';
import bcrypt from 'bcrypt';
import { UserService } from '../user/user.service.js';
import type { AuthUser, JwtPayload } from './auth.types.js';
import { CreateUserDto } from '../user/dto/user.dtos.js';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from './config/refresh-jwt.config.js';
import { type ConfigType } from '@nestjs/config';


const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');
const same = (a: string, b: string) =>
  a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

@Injectable()
export class AuthService {

    constructor(
        private readonly users: UserService,
        private readonly jwt: JwtService,
        @Inject(refreshJwtConfig.KEY)
        private readonly refreshCfg: ConfigType<typeof refreshJwtConfig>,
    ){}

    async register(dto: CreateUserDto){
        const user = await this.users.create(dto);
        return this.login({id: user.id,email: user.email});

    }

    async validateUser(email: string, password: string): Promise<AuthUser>{
        const user = await this.users.findByEmailWithPassword(email.trim().toLocaleLowerCase());
        const ok = user && (await bcrypt.compare(password, user.passwordHash));
        if(!user || !ok){
            throw new UnauthorizedException('Pogresan email ili lozinka');
        }
        return {id: user.id, email: user.email};
    }

    async login(user: AuthUser){
        const tokens = await this.issueTokens(user);
        await this.users.setRefreshTokenHash(user.id, sha256(tokens.refreshToken));
        const profile = await this.users.findById(user.id);
        return {
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
                firstName: profile?.firstName,
                lastName: profile?.lastName,
            },
        };
    }

    async validateRefreshToken(userId: string, token: string):Promise<AuthUser>{
        const user = await this.users.findByIdWithRefreshHash(userId);
        if(!user?.refreshTokenHash || !token || !same(user.refreshTokenHash, sha256(token))){
            throw new UnauthorizedException('Nevazeci refresh token');
        }
        return {id: userId, email: user.email};
    }

    async logout(userId:string){
        await this.users.setRefreshTokenHash(userId, null);

    }


    private async issueTokens(user: AuthUser){
        const payload: JwtPayload = {sub: user.id, email: user.email};
        const [accessToken, refreshToken] = await Promise.all([
            this.jwt.signAsync(payload),
            this.jwt.signAsync(payload, {...this.refreshCfg, jwtid: randomUUID()})
        ]);
        return {accessToken,refreshToken};
    }
}
