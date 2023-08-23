import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

// login user dto
export class SigninDto {
    @ApiProperty({example: "john@gmail.com"})
    @IsEmail()
    email: string;

    @ApiProperty({example: "9823456712"})
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({example: "password1@A"})
    @MinLength(8)
    password: string;
}