import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalEmailStrategy extends PassportStrategy(Strategy, 'local-email') {
    constructor(private authService: AuthService) {
        super({ 
            usernameField: 'email',
            passwordField: 'password'
        });
    }

    async validate(email: string, password: string) {
        const user = await this.authService.validateEmail(email, password);
        if (!user) throw new UnauthorizedException();
        return user;
    }
}