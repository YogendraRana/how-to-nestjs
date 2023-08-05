import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2'

@Injectable()
export class UserService {

    constructor(
        private prismaService: PrismaService
    ) { }

    // find user by email
    async findUserByEmail(email: string) {
        const user = await this.prismaService.user.findUnique({ where: { email } });
        return user;
    }

    // find user by id
    async findUserById(id: string) {
        const user = await this.prismaService.user.findUnique({ where: { id } });
        return user;
    }

    // create user
    async createUser(createUserDto: CreateUserDto) {
        const hashPassword = await argon2.hash(createUserDto.password);
        createUserDto.password = hashPassword;
        delete createUserDto.confirm_password;
        const newUser = await this.prismaService.user.create({ data: createUserDto });
        delete newUser.password;
        return newUser;
    }
}