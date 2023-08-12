import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { UserService } from '../users/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { TokenService } from 'src/services/token/token.service';
import { EmailService } from '../../services/email/email.service';
import { LocalEmailStrategy } from './strategies/local-email.strategy';
import { AccessTokenStrategy } from './strategies/access-token.strategy';


@Module({
    imports: [PassportModule],
    controllers: [AuthController],
    providers: [AuthService, UserService, PrismaService, EmailService, LocalEmailStrategy, TokenService, AccessTokenStrategy],
    exports: [AuthService]
})


export class AuthModule { }
