import { IsEmail, MinLength, IsIn, IsString, IsDateString, IsOptional, IsNotEmpty } from "class-validator";

// Prisma schema
enum Gender {
    Male = 'MALE',
    Female = 'FEMALE',
    Other = 'OTHER',
}

// register user dto
export class CreateUserDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @MinLength(10)
    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsDateString()
    @IsNotEmpty()
    dateOfBirth: Date;

    @IsIn([Gender.Male, Gender.Female, Gender.Other], { message: 'Gender must be one of MALE, FEMALE, or OTHER' })
    @IsNotEmpty()
    gender: Gender;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    confirm_password: string;
}