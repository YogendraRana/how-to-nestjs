import { AuthService } from './auth.service';
import { EmailOtpDto } from './dtos/email-otp';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { SignupDto } from 'src/modules/auth/dtos/signup.dto';
import { SigninDto } from 'src/modules/auth/dtos/signin.dto';
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { VerifyEmailOtpDto } from 'src/modules/auth/dtos/verify-email-otp.dto';
import { LocalEmailAuthGuard } from './guards/local-email.guard';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

 
    @Post('otp/email')
    @ApiBody({type: EmailOtpDto})
    @HttpCode(200)
    async sendOtp(@Body() emailOtpDto: EmailOtpDto) {
        return this.authService.sendOtpToEmail(emailOtpDto);
    }


    @Post('otp/email/verify')
    @ApiBody({type: VerifyEmailOtpDto})
    @HttpCode(200)
    async verifyEmailOtp(@Body() verifyEmailOtpDto: VerifyEmailOtpDto) {
        return this.authService.verifyEmailOtp(verifyEmailOtpDto);
    }  


    // signup or register
    @Post('signup')
    @ApiBody({type: SignupDto})
    async signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto)
    }


    // signin or login
    @Post('signin')
    @ApiBody({type: SigninDto})
    @UseGuards(LocalEmailAuthGuard)
    async signin (@Body() signinDto: SigninDto) {
        return this.authService.signin(signinDto);
    }


    // forgot password



    // reset or update password



    // change password



    // logout



    // refresh token
}
