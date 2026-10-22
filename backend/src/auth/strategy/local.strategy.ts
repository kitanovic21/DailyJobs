import { PassportStrategy } from '@nestjs/passport';
import passportLocal from 'passport-local';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service.js';

const { Strategy } = passportLocal;

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private readonly auth: AuthService){
        super({usernameField: 'email'});
    }

    validate(email: string, password: string){
        return this.auth.validateUser(email, password);
    }
}

