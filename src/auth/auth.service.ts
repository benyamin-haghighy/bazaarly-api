import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ResgisterAuthDto } from './dto/resgister-auth.dto';
import { LgoinAuthDto } from './dto/login-auth.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import role from '../users/enums/roleUser.enum.';
import { compare, compareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import roleFind from '../users/enums/roleFind.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }
  async resgister(registerAuthDto: ResgisterAuthDto): Promise<object> {
    const user = await this.usersService.create({ name: registerAuthDto.name, mobile: registerAuthDto.mobile, password: registerAuthDto.password })
    return user
  }

  async login(loginAuthDto: LgoinAuthDto): Promise<object> {
    const user = await this.userRepository.findOne({
      where: { mobile: loginAuthDto.mobile }, select: {
        id: true,
        name: true,
        role: true,
        password: true

      }
    })
    if (!user) {
      throw new NotFoundException('کاربری با این شماره تلفن پیدا نشده است')
    }
    const isPasswordCurrect = await compare(loginAuthDto.password, user.password)
    if (!isPasswordCurrect) {
      throw new UnauthorizedException('پسورد وارد شده اشتباه می باشد')
    }

    const accessToken = this.jwtService.sign({ sub: user.id, name: user.name, role: user.role })
    const refreshToken = this.jwtService.sign({ sub: user.id, name: user.name, role: user.role }, {
      secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.getOrThrow('REFRESH_TOKEN_EXPIRES_IN')
    })
    return {
      accessToken,
      refreshToken
    }
  }
}
