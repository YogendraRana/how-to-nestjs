import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { SignupDto } from 'src/modules/auth/dtos/signup.dto';
import { SigninDto } from 'src/modules/auth/dtos/signin.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { LocalEmailAuthGuard } from './guards/local-email.guard';
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }


    // signup or register
    @Public()
    @Post('signup')
    @ApiBody({type: SignupDto})
    async signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto)
    }


    // signin or login
    @Public()
    @ApiBody({type: SigninDto})
    @UseGuards(LocalEmailAuthGuard)
    @Post('signin')
    async signin (@Body() signinDto: SigninDto) {
        return this.authService.signin(signinDto);
    }


     // verify otp
     @Public()
     @Post('verify-otp')
     @ApiBody({type: VerifyOtpDto})
     @HttpCode(200)
     async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
         return this.authService.verifyOtp(verifyOtpDto);
     }  


    // forgot password



    // reset or update password



    // change password



    // logout



    // refresh token
}
