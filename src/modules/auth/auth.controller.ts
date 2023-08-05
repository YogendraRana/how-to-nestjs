import { Body, Controller, HttpCode, Post, ValidationPipe, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginUserDto } from 'src/dtos/login-user.dto';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    // signup or register
    @Post('signup')
    @HttpCode(200)
    async handleSignup(@Body('email') email: string) {
        return this.authService.handleSignup(email);
    }

    // verification
    @Post('verify')
    @HttpCode(200)
    async handleVerification(@Body('email') email: string, @Body('otp') otp: string) {
        return this.authService.handleVerification(email, otp);
    }

    // create profile or create user
    @Post('profile')
    async handleRegisterUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
        return this.authService.handleRegisterUser(createUserDto)
    }

    // signin or login
    @Post('signin')
    @UseGuards(LocalAuthGuard)
    async handleSignIn (@Body() loginUserDto: LoginUserDto) {
        return this.authService.handleSignIn(loginUserDto);
    }

}
