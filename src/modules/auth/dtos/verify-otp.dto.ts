import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsEmail } from 'class-validator';

export class VerifyOtpDto {
    @ApiProperty({example: 'johndoe@gmail.com'})
    @IsEmail()
    @IsNotEmpty()
    email: string;


    @ApiProperty({example: 123456})
    @IsNumber()
    @IsNotEmpty()
    otp: number;
}