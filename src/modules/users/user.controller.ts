import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Controller } from '@nestjs/common';


@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(
        private userService: UserService
    ) {}

}
