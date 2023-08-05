import { IsEmail, MinLength } from "class-validator";

// login user dto
export class LoginUserDto {
    @IsEmail()
    email: string;

    @MinLength(8)
    password: string;
}