import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { UserService } from '../users/user.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    imports: [PassportModule],
    controllers: [AuthController],
    providers: [AuthService, UserService, PrismaService, LocalStrategy, JwtStrategy],
    exports: [AuthService]
})

export class AuthModule { }
