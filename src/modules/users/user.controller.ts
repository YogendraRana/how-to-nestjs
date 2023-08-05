import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../../dtos/create-user.dto';

@Controller('users')
export class UserController {
    constructor(
        private userService: UserService
    ) {}

    @Post()
    async createUser(@Body(new ValidationPipe) createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }
}
