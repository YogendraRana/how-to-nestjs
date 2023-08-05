import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import generateOtp from 'src/util/generateOtp';
import { HttpException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { MailerService } from '@nestjs-modules/mailer';
import validatePassword from 'src/util/validatePassword';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { LoginUserDto } from './../../dtos/login-user.dto';

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private prismaService: PrismaService,
        private mailerService: MailerService,
    ) { }


    // handle validate user
    async handleValidateUser(email: string, password: string) {
        const user = await this.prismaService.user.findUnique({ where: { email } });
        if (!user) throw new HttpException("Invalid credentials", 400);

        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) throw new HttpException("Invalid credentials", 400);

        return user;
    }

    // register email or phone
    async handleSignup(email: string) {
        try {
            if (!email) throw new HttpException("Email is required", 400);
            await this.userService.findUserByEmail(email);
            await this.prismaService.otp.deleteMany({ where: { email } })
            const otp = generateOtp();
            const hashedOtp = await argon2.hash(`${otp}`);

            await this.prismaService.otp.create({
                data: {
                    email: email,
                    code: hashedOtp
                }
            })

            await this.mailerService.sendMail({
                to: email,
                from: "yogendrarana9595@gmail.com",
                subject: "OTP for registration",
                text: `Hello, your OTP for registration is ${otp}`,
            })

            return {
                success: true,
                message: `OTP successfully sent to ${email}`
            }

        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }

    // verify otp
    async handleVerification(email: string, otp: string) {
        if (!email || !otp) throw new HttpException("Email and OTP are required", 400);

        const row = await this.prismaService.otp.findFirst({ where: { email } })
        if (!row) throw new HttpException(`No OTP was sent to ${email}`, 400);
        const isValidOtp = await argon2.verify(row.code, otp);
        if (!isValidOtp) throw new HttpException("Invalid OTP", 400);

        // check if the otp is expired or not
        const createdDate = new Date(row.createdAt);
        const currentDate = new Date(Date.now());

        const diff = createdDate.getTime() - currentDate.getTime();
        if (diff > 600000) throw new HttpException("OTP expired", 400);

        await this.prismaService.otp.deleteMany({ where: { email } })

        return {
            success: true,
            message: "OTP verified successfully",
        };
    }


    // create user handler
    async handleRegisterUser(createUserDto: CreateUserDto) {
        const user = await this.prismaService.user.findFirst({
            where: {
                OR: [{ email: createUserDto.email.toLowerCase() }, { phone: createUserDto.phone }]
            }
        })

        if (user) throw new HttpException("User already exists", 400);

        validatePassword(createUserDto.password, createUserDto.confirm_password);

        // create user
        const { id } = await this.userService.createUser(createUserDto);

        // generate token
        const accessToken = await this.jwtService.signAsync({ id }, { secret: process.env.JWT_SECRET, expiresIn: "1d" });
        const refreshToken = uuidv4();
        const refreshTokenHash = await argon2.hash(refreshToken);

        await this.prismaService.refreshToken.upsert({
            where: { userId: id },
            update: { refreshTokenHash },
            create: {
                refreshTokenHash,
                userId: id
            }
        })

        return {
            success: true,
            message: "Account created successfully",
            accessToken,
        }
    }


    // validate user
    async handleSignIn(loginUserDto: LoginUserDto) {
        const user = await this.handleValidateUser(loginUserDto.email, loginUserDto.password);

        // generate tokens
        const accessToken = await this.jwtService.signAsync({ id: user.id }, { secret: process.env.JWT_SECRET, expiresIn: "1d" });

        const refreshToken = uuidv4();
        const refreshTokenHash = await argon2.hash(refreshToken);

        await this.prismaService.refreshToken.upsert({
            where: { userId: user.id },
            update: { refreshTokenHash },
            create: {
                userId: user.id,
                refreshTokenHash,
            }
        })

        delete user.password;

        return {
            success: true,
            message: "Login successful",
            accessToken,
            user
        }
    }
}
