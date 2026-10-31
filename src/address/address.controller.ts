import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, Req, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Res() res:Response, @Req() req:Request & {user:JwtPayload},@Body() createAddressDto: CreateAddressDto) {
    
    return res.status(HttpStatus.CREATED).json({
      statusCode:HttpStatus.CREATED,
      data:await this.addressService.create(createAddressDto,req.user),
      message:"address create successFully"
    })
  }
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Res() res:Response, @Req() req:Request & {user:JwtPayload}) {
    return res.status(HttpStatus.OK).json({
      statusCode:HttpStatus.OK,
      data:await this.addressService.findAll(req.user)
    })
  }
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Res() res:Response, @Req() req:Request & {user:JwtPayload},@Param('id', ParseIntPipe) id: number) {
    return res.status(HttpStatus.OK).json({
      statusCode:HttpStatus.OK,
      data:await this.addressService.findOne(id, req.user)
    }) 
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id')
  async update(@Res() res:Response, @Req() req:Request & {user:JwtPayload},@Param('id', ParseIntPipe) id: number, @Body() updateAddressDto: UpdateAddressDto) {
    
    return res.status(HttpStatus.OK).json({
      statusCode:HttpStatus.OK,
      data:await this.addressService.update(id, updateAddressDto,req.user)
    })  
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Res() res:Response, @Req() req:Request & {user:JwtPayload},@Param('id',ParseIntPipe) id: number) {
    
    return res.status(HttpStatus.OK).json({
      statusCode:HttpStatus.OK,
      data:await this.addressService.remove(id, req.user)
    })   
  }
}
