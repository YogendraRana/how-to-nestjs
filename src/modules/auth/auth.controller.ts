import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { SignupDto } from 'src/modules/auth/dtos/signup.dto';
import { SigninDto } from 'src/modules/auth/dtos/signin.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { LocalEmailAuthGuard } from './guards/local-email.guard';
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }


    // signup or register
    @Public()
    @Post('signup')
    @ApiBody({ type: SignupDto })
    async signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto)
    }


    // signin or login
    @Public()
    @ApiBody({ type: SigninDto })
    @UseGuards(LocalEmailAuthGuard)
    @Post('signin')
    async signin(@Body() signinDto: SigninDto) {
        return await this.authService.signin(signinDto);
    }


    // verify otp
    @Public()
    @Post('verify-email')
    @ApiBody({ type: VerifyOtpDto })
    @HttpCode(200)
    async verifyEmail(@Body() verifyOtpDto: VerifyOtpDto) {
        return await this.authService.verifyEmail(verifyOtpDto);
    }


    // forgot password
    @Public()
    @Post('forgot-password')
    @HttpCode(200)
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return await this.authService.forgotPassword(forgotPasswordDto);
    }


    //  verify password reset otp
    @Public()
    @Post('verify-password-reset-otp')
    @HttpCode(200)
    async verifyPasswordResetOtp(@Body() verifyOtpDto: VerifyOtpDto) {
        return await this.authService.verifyPasswordResetOtp(verifyOtpDto);
    }


    // reset password
    @Public()
    @Post('reset-password')
    async resetPassword() {
        return await this.authService.resetPassword();
    }


    // update password
    @Post('reset-password')
    async updatePassword() {
        return await this.authService.updatePassword();
    }


    // logout
    @Post('logout')
    async logout() {
        return await this.authService.logout();
    }


    // refresh token
}
