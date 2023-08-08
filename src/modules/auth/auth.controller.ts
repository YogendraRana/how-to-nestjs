import { Body, Controller, HttpCode, Post, ValidationPipe, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../../common/dtos/create-user.dto';
import { LoginUserDto } from 'src/common/dtos/login-user.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    // signup or register
    @Post('signup')
    @HttpCode(200)
    async signup(@Body('email') email: string) {
        return this.authService.signup(email);
    }

    // verification
    @Post('verify-otp')
    @HttpCode(200)
    async verifyOtp(@Body('email') email: string, @Body('otp') otp: string) {
        return this.authService.verifyOtp(email, otp);
    }

    // create profile or create user
    @Post('profile')
    async createProfile(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
        return this.authService.createUserProfile(createUserDto)
    }

    // signin or login
    @Post('signin')
    @UseGuards(AuthGuard('local'))
    async signin (@Body() loginUserDto: LoginUserDto) {
        return this.authService.signin(loginUserDto);
    }

}
