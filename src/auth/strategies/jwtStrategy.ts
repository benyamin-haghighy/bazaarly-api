import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt'
import roleFind from "../../users/enums/roleFind.enum";
import { UsersService } from "../../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly configService:ConfigService,
        private readonly userService:UsersService
    ){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:configService.getOrThrow('ACCESS_TOKEN_SECRETE_KEY')
        })
    }
    async validate(payload:{sub:number, name:string, role:roleFind}) {
        try {
            
            await this.userService.findOne(payload.sub)
            return payload
        } catch (error) {
            throw error
        }
    }
}