import * as argon2 from 'argon2'
import { Injectable } from '@nestjs/common';
import { SignupDto } from 'src/modules/auth/dtos/signup.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {

    constructor(
        private prismaService: PrismaService
    ) { }

    
    // create user
    async createUser(signupDto: SignupDto) {
        const hashPassword = await argon2.hash(signupDto.password);
        signupDto.password = hashPassword;
        delete signupDto.confirm_password;
        const newUser = await this.prismaService.user.create({ data: signupDto });
        delete newUser.password;
        return newUser;
    }


    // find user by id
    async findUserById(id: string) {
        const user = await this.prismaService.user.findUnique({ where: { id } });
        return user;
    }


    // find user by email
    async findUserByEmail(email: string) {
        const user = await this.prismaService.user.findUnique({ where: { email } });
        return user;
    }

}