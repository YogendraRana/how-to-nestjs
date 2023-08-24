import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { PrismaService } from 'src/services/prisma/prisma.service';


@Module({
    controllers: [],
    providers: [OtpService, PrismaService]
})


export class OtpModule { }
