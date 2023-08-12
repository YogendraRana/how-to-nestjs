import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class PasswordService {

    validatePassword(password: string, confirm_password: string) {
        if (password !== confirm_password) throw new HttpException("Passwords do not match", HttpStatus.BAD_REQUEST);

        const requirements = [
            { regex: /.{8,}/, index: 0, message: "Password must be at least 8 characters long" },
            { regex: /[0-9]/, index: 1, message: "Password must contain at least one number" },
            { regex: /[A-Z]/, index: 2, message: "Password must contain at least one uppercase letter" },
            { regex: /[a-z]/, index: 3, message: "Password must contain at least one lowercase letter" },
            { regex: /[^A-Za-z0-9]/, index: 4, message: "Password must contain at least one special character" },
        ];

        for (const requirement of requirements) {
            const isValid = requirement.regex.test(password);

            if (!isValid) {
                throw new HttpException(requirement.message, HttpStatus.BAD_REQUEST);
            }
        }
    }
}
