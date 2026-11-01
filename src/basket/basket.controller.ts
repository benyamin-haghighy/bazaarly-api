import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe, UseGuards } from '@nestjs/common';
import { BasketService } from './basket.service';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto'
import { Request } from 'express';
import { JwtPayload } from '../tickets/interfaces/jwtpayload.interface';
import { AuthGuard } from '@nestjs/passport';
@UseGuards(AuthGuard('jwt'))
@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Post()
  create(@Req() req:Request & {user:JwtPayload}, @Body() createBasketDto: CreateBasketDto) {
    return this.basketService.create(createBasketDto,req.user);
  }

  @Get()
  findAll(@Req() req:Request & {user:JwtPayload}, ) {
    return this.basketService.findAll(req.user);
  }


  @Patch(':id')
  update(@Req() req:Request & {user:JwtPayload}, @Param('id',ParseIntPipe) id: number, @Body() updateBasketDto: UpdateBasketDto) {
    return this.basketService.update(id, updateBasketDto,req.user);
  }

  @Delete(':id')
  remove(@Req() req:Request & {user:JwtPayload}, @Param('id',ParseIntPipe) id: number) {
    return this.basketService.remove(id,req.user);
  }
}
