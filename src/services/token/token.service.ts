import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';


@Injectable()
export class TokenService {

    constructor(
        private jwtService: JwtService
    ) {}
    

    // generate access token
    async generateAccessToken(id: string) {
        const accessToken = await this.jwtService.signAsync({ id }, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: process.env.ACCESS_EXPIRES_IN });
        return accessToken;
    }


    // generate refresh token hash
    async generateRefreshTokenHash() {
        const refreshToken = uuidv4();
        const refreshTokenHash = await argon2.hash(refreshToken);
        return { refreshToken, refreshTokenHash };
    }

}
