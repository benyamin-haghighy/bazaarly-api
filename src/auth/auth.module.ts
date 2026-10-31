import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwtStrategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';

@Module({
  imports:[
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject:[ConfigService],
      useFactory:async(configService:ConfigService)=>({
        secret:configService.get('ACCESS_TOKEN_SECRETE_KEY'),
        signOptions:{expiresIn:configService.get('ACCESS_TOKEN_EXPIRE'), audience:"benyamin", issuer:"user"}
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
})
export class AuthModule {}
