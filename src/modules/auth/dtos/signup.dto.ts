import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MinLength, IsIn, IsString, IsDateString, IsOptional, IsNotEmpty } from "class-validator";


// Prisma schema
enum Gender {
    Male = 'MALE',
    Female = 'FEMALE',
    Other = 'OTHER',
}


// register user dto
export class SignupDto {
    @ApiProperty({ example: 'john@gmail.com' })
    @IsEmail()
    email: string;


    @ApiProperty({ example: 9812345678 })
    @MinLength(10)
    @IsString()
    @IsOptional()
    phone?: string;


    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    name: string;


    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    dob: Date;


    @ApiProperty({ example: 'MALE' })
    @IsIn([Gender.Male, Gender.Female, Gender.Other], { message: 'Gender must be one of MALE, FEMALE, or OTHER' })
    @IsNotEmpty()
    gender: Gender;


    @ApiProperty({ example: 'password1A@' })
    @IsNotEmpty()
    password: string;


    @ApiProperty({ example: 'password1A@' })
    @IsNotEmpty()
    confirm_password: string;
}