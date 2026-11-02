import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import roleFind from "../../users/enums/roleFind.enum";
import { UsersService } from "../../users/users.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../users/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow('ACCESS_TOKEN_SECRETE_KEY')
        })
    }
    async validate(payload: { sub: number, name: string, role: roleFind }) {
        try {
            const user = await this.userRepository.findOne({ where: { id:payload.sub } })
            if (!user) {
                throw new NotFoundException('کاربری با این ایدی پیدا نشده است')
            }
            return payload
        } catch (error) {
            throw error
        }
    }
}