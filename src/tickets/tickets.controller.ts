import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import roleFind from '../users/enums/roleFind.enum';
import { JwtPayload } from './interfaces/jwtpayload.interface';


@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Res() res: Response , @Req() req:Request & {user:JwtPayload} ,@Body() createTicketDto: CreateTicketDto) {
    
    return res.status(HttpStatus.CREATED).json({
      statusCdoe:HttpStatus.CREATED,
      data: await this.ticketsService.create(createTicketDto, req.user),
      message:"user create successFully"
    })
  }
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Res() res: Response , @Req() req:Request & {user:JwtPayload}) {
    return res.status(HttpStatus.OK).json({
      statusCdoe:HttpStatus.OK,
      data: await this.ticketsService.findAll(req.user)
    }) 
  }
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Res() res: Response , @Req() req:Request & {user:JwtPayload} ,@Param('id', ParseIntPipe) id: number) {
    return res.status(HttpStatus.OK).json({
      statusCdoe:HttpStatus.OK,
      data: await this.ticketsService.findOne(id,req.user)
    })  
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@Res() res: Response , @Req() req:Request & {user:JwtPayload} ,@Param('id', ParseIntPipe) id: number, @Body() updateTicketDto: UpdateTicketDto) {
    return res.status(HttpStatus.OK).json({
      statusCdoe:HttpStatus.OK,
      data: await  this.ticketsService.update(id, updateTicketDto,req.user)
    }) 
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Res() res: Response , @Req() req:Request & {user:JwtPayload} ,@Param('id', ParseIntPipe) id: number) {
    return res.status(HttpStatus.OK).json({
      statusCdoe:HttpStatus.OK,
      data: await this.ticketsService.remove(id,req.user)
    })
  }
}
