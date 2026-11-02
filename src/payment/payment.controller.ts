import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Request } from 'express';
import { JwtPayload } from '../tickets/interfaces/jwtpayload.interface';
import { PaymentCallbackDto } from './dto/payment-callback.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Req() req:Request & {user:JwtPayload}, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto,req.user);
  }
  @Get('/verify') // بدون AuthGuard
  verify(@Query() query: PaymentCallbackDto) {
    return this.paymentService.verify(query)
  }
}
