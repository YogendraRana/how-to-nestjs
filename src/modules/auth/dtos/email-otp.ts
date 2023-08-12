import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

@Injectable()
export class EmailOtpDto {
    @ApiProperty({example: "johndoe@gmail.com"})
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}