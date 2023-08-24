import { OtpType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsEmail, IsEnum } from 'class-validator';

export class VerifyOtpDto {
    @ApiProperty({example: 'johndoe@gmail.com'})
    @IsEmail()
    @IsNotEmpty()
    email: string;


    @ApiProperty({example: 123456})
    @IsNumber()
    @IsNotEmpty()
    otp: number;

    
    @ApiProperty({example: OtpType.EMAIL_VERIFICATION})
    @IsNotEmpty()
    @IsEnum(OtpType)
    otpType: OtpType;
}