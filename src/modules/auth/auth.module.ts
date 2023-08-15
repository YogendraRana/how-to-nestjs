import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { UserService } from '../users/user.service';
import { PrismaService } from '../../services/prisma/prisma.service';
import { TokenService } from 'src/services/token/token.service';
import { AccessTokenAuthGuard } from './guards/access-token.guard';
import { LocalEmailStrategy } from './strategies/local-email.strategy';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { MailService } from 'src/services/mail/mail.service';


@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_ACCESS_SECRET,
        }),
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService,
        UserService,
        PrismaService,
        TokenService,
        MailService,
        LocalEmailStrategy,
        AccessTokenStrategy,
        {
            provide: APP_GUARD,
            useClass: AccessTokenAuthGuard
        }
    ],
    exports: [
        AuthService
    ]
})


export class AuthModule { }
