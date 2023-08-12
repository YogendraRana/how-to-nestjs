import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { UserService } from "src/modules/users/user.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access-token') {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_ACCESS_SECRET,
        });
    }

    async validate(payload: any) {
        // payload = { id: 'cll7mmzlc0003yzjkdp91eybo', iat: 1691825909, exp: 1691912309 }
        const user = await this.userService.findUserById(payload.id);
        if (!user) throw new UnauthorizedException();
        delete user.password;
        return user;
    }
}