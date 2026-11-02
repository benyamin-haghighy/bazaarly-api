import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtPayload } from '../tickets/interfaces/jwtpayload.interface';
import { OrderStatus } from './enum/order-status.enum';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Req() req:Request & {user:JwtPayload}, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto,req.user);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/status{/:status}')
  findAll(@Req() req:Request & {user:JwtPayload}, @Param('status') status:OrderStatus) {
    return this.ordersService.findAll(req.user,status);
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/cancel')
  cancel(
  @Req() req: Request & { user: JwtPayload },
  @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ordersService.cancleOrder(id, req.user)
  }
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Req() req:Request & {user:JwtPayload}, @Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id,req.user);
  }
  @UseGuards(AuthGuard('adminStrategy'))
  @Patch(':id')
  update(@Req() req:Request & {user:JwtPayload}, @Param('id', ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto,req.user);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Req() req:Request & {user:JwtPayload}, @Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id,req.user);
  }
}
