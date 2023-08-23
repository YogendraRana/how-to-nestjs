import * as argon2 from 'argon2';
import { SigninDto } from './dtos/signin.dto';
import { HttpException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { OtpService } from 'src/services/otp/otp.service';
import { SignupDto } from 'src/modules/auth/dtos/signup.dto';
import { MailService } from 'src/services/mail/mail.service';
import { TokenService } from 'src/services/token/token.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';
import { PasswordService } from 'src/services/password/password.service';


@Injectable()
export class AuthService {
    constructor(
        private otpService: OtpService,
        private mailService: MailService,
        private userService: UserService,
        private tokenService: TokenService,
        private prismaService: PrismaService,
        private passwordService: PasswordService
    ) { }


    // validate user email and password
    async validateEmail(email: string, password: string) {
        const user = await this.userService.findUserByEmail(email);
        if (!user) throw new HttpException(`User with the email ${email} does not exist`, 400);

        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) throw new UnauthorizedException("Invalid credentials");

        return user;
    }


    // create user handler
    async signup(signupDto: SignupDto) {
        // check if user already exists
        const user = await this.prismaService.user.findFirst({ where: { email: signupDto.email } })
        if (user) throw new HttpException(`User with the email ${signupDto.email} already exists`, 400);

        // validate password
        this.passwordService.validatePassword(signupDto.password, signupDto.confirm_password);

        // create user
        const { id, email } = await this.userService.createUser(signupDto);

        // send verification otp to email
        const otp = this.otpService.generateOtp();
        await this.prismaService.otp.create({ data: { email: email, code: otp } })
        await this.mailService.sendMail(process.env.MAIL_SENDER, email, "OTP verification", `Your OTP token is ${otp}`);

        // generate tokens
        const accessToken = await this.tokenService.generateAccessToken(id)
        const { refreshToken, refreshTokenHash } = await this.tokenService.generateRefreshTokenHash();

        // save refresh token hash
        await this.prismaService.refreshToken.upsert({
            where: { userId: id },
            update: { refreshTokenHash },
            create: {
                userId: id,
                refreshTokenHash
            }
        });

        return {
            success: true,
            message: "Account created successfully",
            accessToken,
            refreshToken,
        }
    }


    // signin
    async signin(signinDto: SigninDto) {
        const user = await this.validateEmail(signinDto.email, signinDto.password);

        // generate tokens
         const accessToken = await this.tokenService.generateAccessToken(user.id)
         const { refreshToken, refreshTokenHash } = await this.tokenService.generateRefreshTokenHash();

        await this.prismaService.refreshToken.upsert({
            where: { userId: user.id },
            update: { refreshTokenHash },
            create: {
                userId: user.id,
                refreshTokenHash,
            }
        })

        return {
            success: true,
            message: "Signin successful",
            accessToken,
            refreshToken
        }
    }


    // verify otp
    async verifyOtp(verifyOtpDto: VerifyOtpDto) {
        const row = await this.prismaService.otp.findFirst({ where: { email: verifyOtpDto.email } })
        if (!row) throw new HttpException('Cannot find provided OTP', 400);
        if (verifyOtpDto.otp !== row.code) throw new HttpException("Invalid OTP", 400);

        // check if the otp is expired or not
        const createdDate = new Date(row.createdAt);
        const currentDate = new Date(Date.now());

        const diff = createdDate.getTime() - currentDate.getTime();
        if (diff > 10*60*1000) throw new HttpException("OTP expired", 400);

        // update user
        await this.prismaService.user.update({ where: { email: verifyOtpDto.email }, data: { isVerified: true } })

        // delete otp
        await this.prismaService.otp.deleteMany({ where: { email: verifyOtpDto.email } })

        return {
            success: true,
            message: "OTP verified successfully",
        };
    }
}
