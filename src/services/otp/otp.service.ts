import { Injectable } from '@nestjs/common';


@Injectable()
export class OtpService {
    generateOtp() {
        const otp = Math.floor(Math.random() * 900000 + 100000);
        return otp;
    }
}