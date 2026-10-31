import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt"
import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtPayload } from "../../tickets/interfaces/jwtpayload.interface";


@Injectable()
export class adminStrategy extends PassportStrategy(Strategy, 'adminStrategy'){
    constructor(configService:ConfigService){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:configService.getOrThrow("ACCESS_TOKEN_SECRETE_KEY")
        })
    }
    validate(payload:JwtPayload) {
        if (payload.role === 'ADMIN') {
            return payload
        }
        throw new ForbiddenException('شما دسترسی به این قسمت را ندارد')
    }
}