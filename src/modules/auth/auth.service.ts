import * as argon2 from 'argon2';
import { SigninDto } from './dtos/signin.dto';
import { HttpException } from '@nestjs/common';
import { EmailOtpDto } from './dtos/email-otp';
import { UserService } from '../users/user.service';
import generateOtp from 'src/common/util/generateOtp';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from 'src/modules/auth/dtos/signup.dto';
import { MailService } from 'src/services/mail/mail.service';
import validatePassword from 'src/common/util/validatePassword';
import { VerifyEmailOtpDto } from './dtos/verify-email-otp.dto';
import { TokenService } from 'src/services/token/token.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private tokenService: TokenService,
        private mailService: MailService,
        private prismaService: PrismaService,
    ) { }


    // send otp
    async sendOtpToEmail(emailOtpDto: EmailOtpDto) {
        if (!emailOtpDto.email) throw new HttpException("Email is required", 400);

        const user = await this.prismaService.user.findUnique({ where: { email: emailOtpDto.email } });
        if (user) throw new HttpException(`${emailOtpDto.email} is already registered. Please use another email`, 400);

        await this.prismaService.otp.deleteMany({ where: { email: emailOtpDto.email } })
        const otp = generateOtp();

        await this.prismaService.otp.create({
            data: {
                email: emailOtpDto.email,
                code: otp
            }
        })

        await this.mailService.sendMail(process.env.MAIL_SENDER, emailOtpDto.email, "OTP verification", `Your OTP token is ${otp}`);

        return {
            success: true,
            message: `OTP successfully sent to ${emailOtpDto.email}`
        }
    }


    // verify otp
    async verifyEmailOtp(verifyEmailOtpDto: VerifyEmailOtpDto) {
        const row = await this.prismaService.otp.findFirst({ where: { email: verifyEmailOtpDto.email } })
        if (!row) throw new HttpException(`No OTP was sent to ${verifyEmailOtpDto.email}`, 400);

        if (verifyEmailOtpDto.otp !== row.code) throw new HttpException("Invalid OTP", 400);

        // check if the otp is expired or not
        const createdDate = new Date(row.createdAt);
        const currentDate = new Date(Date.now());

        const diff = createdDate.getTime() - currentDate.getTime();
        if (diff > 600000) throw new HttpException("OTP expired", 400);

        await this.prismaService.otp.deleteMany({ where: { email: verifyEmailOtpDto.email } })

        return {
            success: true,
            message: "OTP verified successfully",
        };
    }


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
        const user = await this.prismaService.user.findFirst({
            where: { email: signupDto.email }
        })

        if (user) throw new HttpException(`User with the email ${signupDto.email} already exists`, 400);

        validatePassword(signupDto.password, signupDto.confirm_password);

        // create user
        const { id } = await this.userService.createUser(signupDto);

        // generate tokens
        const accessToken = await this.tokenService.generateAccessToken(id)
        const { refreshToken, refreshTokenHash } = await this.tokenService.generateRefreshTokenHash();

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
}
