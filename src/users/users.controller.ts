import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, DefaultValuePipe, ParseIntPipe, Query, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { Response } from 'express';
import roleFind from './enums/roleFind.enum';
import role from './enums/roleUser.enum.';
import { User } from './entities/user.entity';
import { pageNation } from './dto/pageNation.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from '../tickets/interfaces/jwtpayload.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Res() res: Response, @Body() createUserDto: CreateUserDto): Promise<object> {
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: await this.usersService.create(createUserDto),
      message: "user create successFully"
    })
  }
  @UseGuards(AuthGuard('adminStrategy'))
  @Get()
  async findAll(@Res() res: Response, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number): Promise<object> {
    const pageNation: pageNation = { page, limit }
    const users = await this.usersService.findAll(pageNation)
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        pageNation: {
          page,
          limit,
          countUsers: users.length,
          countPage: Math.ceil(users.length / limit)
        },
        users
      }
    })
  }
  @UseGuards(AuthGuard('adminStrategy'))
  @Get('role/{/:role}')
  async findAllWithRole(@Res() res: Response, @Param('role') role: roleFind, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number) {
    const pageNation: pageNation = { page, limit }
    const users = await this.usersService.findAllWithRole(role, pageNation)
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        pageNation: {
          page,
          limit,
          countUsers: users.length,
          countPage: Math.ceil(users.length / limit)
        },
        users
      }
    })
  }
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Res() res: Response, @Param('id', ParseIntPipe) id: number, @Req() req: Request & { user: JwtPayload }) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this.usersService.findOne(id, req.user)
    })
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@Res() res: Response, @Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto, @Req() req: Request & { user: JwtPayload }): Promise<object> {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: await this.usersService.update(+id, updateUserDto, req.user)
    })
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Res() res: Response, @Param('id', ParseIntPipe) id: number, @Req() req: Request & { user: JwtPayload }) {

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: await this.usersService.remove(id, req.user)
    })
  }
}
