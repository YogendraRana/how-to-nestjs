import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.service';
import { OtpService } from '../otp/otp.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { UserService } from '../users/user.service';
import { MailService } from 'src/services/mail/mail.service';
import { TokenService } from 'src/services/token/token.service';
import { AccessTokenAuthGuard } from './guards/access-token.guard';
import { PrismaService } from '../../services/prisma/prisma.service';
import { LocalEmailStrategy } from './strategies/local-email.strategy';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { PasswordService } from 'src/services/password/password.service';


@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_ACCESS_SECRET,
        }),
    ],

    controllers: [ AuthController ],

    providers: [
        AuthService,
        UserService,
        PrismaService,
        TokenService,
        MailService,
        PasswordService,
        OtpService,
        LocalEmailStrategy,
        AccessTokenStrategy,
        {
            provide: APP_GUARD,
            useClass: AccessTokenAuthGuard
        }
    ],
    exports: [ AuthService ]
})


export class AuthModule { }
