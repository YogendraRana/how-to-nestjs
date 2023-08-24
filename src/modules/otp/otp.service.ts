import { OtpType } from '@prisma/client';
import { Injectable, HttpException } from '@nestjs/common';
import { VerifyOtpDto } from '../auth/dtos/verify-otp.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';


@Injectable()
export class OtpService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }


    // generate otp
    generateOtp() {
        const otp = Math.floor(Math.random() * 900000 + 100000);
        return otp;
    }


    // verify otp
    async verifyOtp(verifyOtpDto: VerifyOtpDto) {
        const row = await this.prismaService.otp.findFirst({ where: { email: verifyOtpDto.email } })
        if (!row) throw new HttpException(`No OTP was sent to ${verifyOtpDto.email}`, 400);
        if (verifyOtpDto.otp !== row.code) throw new HttpException("Invalid OTP", 400);
        if (verifyOtpDto.otpType !== row.otpType) throw new HttpException("Invalid OTP type", 400);

        // check if the otp is expired or not
        const currentDate = new Date(Date.now());
        const createdDate = new Date(row.createdAt);

        const diff = createdDate.getTime() - currentDate.getTime();
        if (diff > 10 * 60 * 1000) throw new HttpException("OTP expired", 400);

        // if verified then delete otp
        await this.prismaService.otp.deleteMany({ where: { email: verifyOtpDto.email, otpType: verifyOtpDto.otpType }})

        return {
            success: true,
            message: "OTP verified successfully"
        };
    }
}