import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResgisterAuthDto } from './dto/resgister-auth.dto';
import { LgoinAuthDto } from './dto/login-auth.dto';
import type { Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async resgister(@Res() res:Response, @Body() registerAuthDto: ResgisterAuthDto) {
    return res.status(HttpStatus.OK).json({
      statusCode:HttpStatus.OK,
      data:await this.authService.resgister(registerAuthDto),
      message:"user register successFully"
    }) 
  }

  @Get('/login')
  async login(@Res() res:Response, @Body() loginAuthDto: LgoinAuthDto) {
    return res.status(HttpStatus.OK).json({
      statusCode:HttpStatus.OK,
      data:await this.authService.login(loginAuthDto),
      message:"login successFully"
    })
  }
}
